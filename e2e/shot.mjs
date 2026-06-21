import puppeteer from 'puppeteer';

const url = process.env.SHOT_URL ?? 'http://localhost:3996';
const out = process.env.SHOT_OUT ?? '/tmp/shot.png';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 402, height: 874, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: out });
await browser.close();
console.log('shot saved', out);
