// src/convertToPdf.js
const fs   = require('fs-extra');
const path = require('path');
const mammoth = require('mammoth');
const puppeteer = require('puppeteer-core');

module.exports = async (docxPath) => {
  const outDir   = path.dirname(docxPath);
  const htmlPath = path.join(outDir, 'temp.html');
  const pdfPath  = path.join(outDir, 'result.pdf');

  // Word → HTML
  const { value: html } = await mammoth.convertToHtml({ path: docxPath });
  const fullHtml = `
    <html dir="rtl" lang="fa">
      <head>
        <meta charset="utf-8"/>
        <title>Report</title>
        <style>
          body  { font-family:Tahoma; font-size:14px; direction:rtl; text-align:right; margin:40px;}
          table { border-collapse:collapse; width:100%; margin-bottom:20px; }
          th,td{ border:1px solid #000; padding:8px; text-align:right; }
          img   { max-width:100%; display:block; margin:20px auto; }
        </style>
      </head>
      <body>${html}</body>
    </html>`;

  await fs.writeFile(htmlPath, fullHtml);

  // HTML → PDF
  const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // مسیر Chrome نصب‌شده روی سیستم
  headless: true
});
  const page    = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  await browser.close();

  return pdfPath;
};