import { LinkedInProfile } from '../models/linkedinProfile.model';
import { ILinkedInProfile } from '../interfaces/scraper.interface';
import puppeteer, { VanillaPuppeteer } from 'puppeteer-extra';
import { CookieData, executablePath } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';

dotenv.config();

puppeteer.use(StealthPlugin());

interface ScrapeOptions {
  searchUrl: string;
  maxProfiles: number;
}

export const scrapeLinkedInProfiles = async (options: ScrapeOptions): Promise<ILinkedInProfile[]> => {
  const { searchUrl, maxProfiles } = options;
  const browser = await puppeteer.launch({ headless: false, args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    "--proxy-server='direct://",
    '--proxy-bypass-list=*',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--disable-features=site-per-process',
    '--enable-features=NetworkService',
    '--allow-running-insecure-content',
    '--enable-automation',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-web-security',
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-speech-api',
    '--disable-sync',
    '--disk-cache-size=33554432',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain'],
    executablePath: executablePath() });

  const page = await browser.newPage();
  browser.setCookie(
    {name: 'li_at', value: process.env.LI_AT || "", domain: '.www.linkedin.com'}
  )

  const savedProfiles: ILinkedInProfile[] = [];
  let currentPage = 1;

  try {
    // Set user agent and viewport
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });

    while (savedProfiles.length < maxProfiles) {
      const pagedUrl = `${searchUrl}&page=${currentPage}`;
      await page.goto(pagedUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForSelector('.search-results-container', { timeout: 30000 });
      await autoScroll(page);

      const profiles: Partial<ILinkedInProfile>[] = await page.evaluate(() => {
        const profileElements = Array.from(document.querySelectorAll('.linked-area'));
        return profileElements.map(el => {
          const fullName = el.querySelector('.qiJoPDUkfGKpCkIYmBJsFoVTHVkhnOWcRPYI .jRmKxIDSOyXycCHUdZZoTLSiiCghyNjGDU span span')?.textContent?.trim() || '';
          if (!fullName) return null;
          let profileUrl = el.querySelector('.jRmKxIDSOyXycCHUdZZoTLSiiCghyNjGDU')?.getAttribute('href') || '';
          if (!profileUrl.includes('linkedin.com/in/')) return null;
          profileUrl = profileUrl.split('?')[0];

          const summary = el.querySelector('.zfWRkTlsdWqgImSvwJSOdjUvfgVKfzEPxE')?.textContent?.trim() || '';
          let jobTitle = '';
          let company = '';
          const match = summary.match(/^Current:\s*(.*?)\s+at\s+(.*?)(?:\s*-\s*|$)/);
          if (match) {
            jobTitle = match[1].trim();
            company = match[2].trim();
          }

          if (!jobTitle || !company) return null;

          const location = el.querySelector('.rQvclgytsaAyNpOqzGIQYoNskjUQqchIWaw')?.textContent?.trim() || '';

          return {
            fullName,
            jobTitle,
            company,
            location,
            profileUrl
          };
        }).filter(p => p !== null);
      });

      for (const profile of profiles) {
        if (savedProfiles.length >= maxProfiles) break;
        if (!profile?.profileUrl) continue;

        try {
          const exists = await LinkedInProfile.findOne({ profileUrl: profile.profileUrl });
          if (!exists) {
            const newProfile = new LinkedInProfile(profile);
            await newProfile.save();
            savedProfiles.push(newProfile);
          } else {
            savedProfiles.push(exists);
          }
        } catch (error) {
          console.error(`Error saving profile ${profile.fullName}:`, error);
        }
      }

      currentPage++;
    }

    return savedProfiles;
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error('Failed to scrape LinkedIn profiles');
  } finally {
    await browser.close();
  }
};

async function autoScroll(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

export const getProfilesFromDB = async (): Promise<ILinkedInProfile[]> => {
  return await LinkedInProfile.find().sort({ scrapedAt: -1 }).limit(20);
};