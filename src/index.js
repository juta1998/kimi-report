const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('open-docxtemplater-image-module');
const axios = require('axios');
const generateChart = require('./generateChart.js');
const convertToPdf = require('./convertToPdf.js');

const app = express();
app.use(express.json());
const PORT = 3000;

app.post('/generate', async (req, res) => {
  try {
    // 1) دریافت داده (از body یا از API)
    const data = req.body.data || await axios.get(req.body.apiUrl).then(r => r.data);
    
    // 5) تولید نمودار PNG
    const chartPng = await generateChart(data.chartData || []);
    const chartPath = path.join(__dirname, '..', 'output', 'chart.png');
    await fs.writeFile(chartPath, chartPng);
    
    // 2) خواندن قالب
    const templatePath = path.join(__dirname, 'template.docx');
    const content = await fs.readFile(templatePath, 'binary');
    const zip = new PizZip(content);

    // 3) تنظیم ماژول تصویر
    const opts = {
  centered: false,
  getImage: (tagValue) => fs.readFileSync(tagValue),
  getSize: () => [500, 250],
};

const imageModule = new ImageModule(opts);

    // 4) بارگذاری docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [imageModule],
    });

    // 6) پر کردن متغیرها
    doc.render({
      salesTable: data.salesTable || [],
      chartImage: chartPath,
    });

    // 7) ذخیره‌ی Word
    const tempDocx = path.join(__dirname, '..', 'output', 'filled.docx');
    await fs.writeFile(tempDocx, doc.getZip().generate({ type: 'nodebuffer' }));

    // 8) تبدیل به PDF
    const pdfPath = await convertToPdf(tempDocx);

    // 9) دانلود
    res.download(pdfPath, 'report.pdf');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/generate (POST)`));