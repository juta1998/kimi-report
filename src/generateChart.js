const { createCanvas } = require('canvas');

module.exports = (rows) => {
  // rows = [{month:'فروردین',sales:1200}, ...]
  const width = 800, height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  const labels = rows.map(r => r.month);
  const values = rows.map(r => r.sales);
  const max = Math.max(...values);

  const barWidth = 60, spacing = 80, baseY = 350;

  ctx.fillStyle = '#000';
  ctx.font = '20px Tahoma';
  ctx.fillText('نمودار فروش', 700, 30);

  rows.forEach((row, i) => {
    const x = 700 - (i + 1) * (barWidth + spacing);
    const h = (row.sales / max) * 300;
    ctx.fillStyle = '#0077b6';
    ctx.fillRect(x, baseY - h, barWidth, h);
    ctx.fillStyle = '#000';
    ctx.fillText(row.month, x + barWidth / 2, baseY + 20);
    ctx.fillText(row.sales.toLocaleString(), x + barWidth / 2, baseY - h - 5);
  });

  return canvas.toBuffer('image/png');
};