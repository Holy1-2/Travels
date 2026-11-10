const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const props = JSON.parse(fs.readFileSync('assets-src/commons-props.json', 'utf8'));

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'HamubereDemo/1.0' } }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

async function main() {
  const candidate = props['safari tent lodge'][4];
  if (candidate) {
    const url = candidate.url.split('?')[0].replace(/\/1600px-/, '/1400px-');
    const buf = await download(url);
    fs.writeFileSync('public/images/stays/twin-lakes-retreat-1.jpg', buf);
    console.log('replaced twin-lakes-retreat-1 with', candidate.title);
  }

  fs.mkdirSync('public/images/art', { recursive: true });
  const art = [
    ['assets-src/img-0.jpg', 'public/images/art/hills-soft.jpg'],
    ['assets-src/img-1.jpg', 'public/images/art/hills-dawn.jpg'],
    ['assets-src/img-20.jpg', 'public/images/art/hills-green.jpg'],
  ];
  for (const [from, to] of art) {
    await sharp(from).resize(900, 900, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(to);
  }

  async function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.(jpe?g|png)$/i.test(entry.name)) {
        const before = fs.statSync(full).size;
        const img = sharp(full).rotate();
        const meta = await img.metadata();
        const width = Math.min(1500, meta.width || 1500);
        const out = await img
          .resize({ width, withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true, progressive: true })
          .toBuffer();
        if (out.length < before) fs.writeFileSync(full, out);
        console.log(
          full.replace(/\\/g, '/'),
          Math.round(before / 1024) + 'KB ->',
          Math.round(out.length / 1024) + 'KB'
        );
      }
    }
  }
  await walk('public/images');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
