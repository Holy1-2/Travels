const fs = require('fs');
const https = require('https');
const path = require('path');

const commons = JSON.parse(fs.readFileSync('assets-src/commons-candidates.json', 'utf8'));
const props = JSON.parse(fs.readFileSync('assets-src/commons-props.json', 'utf8'));
const extra = JSON.parse(fs.readFileSync('assets-src/commons-extra.json', 'utf8'));

const PEXELS = {
  gorilla:
    'https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=1600',
};

function pick(src, q, i, width) {
  let r;
  if (src === 'c') r = commons[q][i];
  else if (src === 'p') r = props[q][i];
  else if (src === 'e') r = extra[q][i];
  else if (src === 'px')
    return {
      url: PEXELS[q],
      title: 'Mountain gorilla in Rwanda (Pexels)',
      page: 'https://www.pexels.com/photo/mountain-gorilla-in-rwanda-s-lush-foliage-34303083/',
    };
  if (!r) throw new Error('missing ' + src + ':' + q + '#' + i);
  let u = r.url.split('?')[0];
  const w = width || 1400;
  u = u.replace(/\/1600px-/, '/' + w + 'px-');
  return {
    url: u,
    title: r.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, ''),
    page: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(r.title.replace(/ /g, '_')),
  };
}

const map = [
  ['hero/hero-gorilla.jpg', 'px', 'gorilla', 0, 1600],
  ['hero/hero-kivu.jpg', 'e', 'Lake Kivu sunset', 5, 1600],
  ['hero/hero-tea.jpg', 'c', 'Rwanda tea plantation', 7, 1600],

  ['destinations/volcanoes.jpg', 'px', 'gorilla', 0, 1400],
  ['destinations/lake-kivu.jpg', 'p', 'Rwanda resort', 3, 1400],
  ['destinations/nyungwe.jpg', 'c', 'Nyungwe National Park', 2, 1400],
  ['destinations/akagera.jpg', 'c', 'Akagera National Park wildlife', 9, 1400],
  ['destinations/kigali.jpg', 'c', 'Kigali Convention Centre', 8, 1400],
  ['destinations/twin-lakes.jpg', 'c', 'Lake Burera Rwanda', 0, 1400],

  ['stays/volcano-view-lodge-1.jpg', 'c', 'Volcanoes National Park Rwanda volcano', 5, 1400],
  ['stays/volcano-view-lodge-2.jpg', 'c', 'Volcanoes National Park Rwanda volcano', 2, 1200],
  ['stays/volcano-view-lodge-3.jpg', 'c', 'incategory:"Quality images" Gorilla beringei', 5, 1200],
  ['stays/kivu-serenity-hotel-1.jpg', 'c', 'Lake Kivu Serena Hotel', 1, 1400],
  ['stays/kivu-serenity-hotel-2.jpg', 'p', 'hotel pool Africa', 9, 1200],
  ['stays/kivu-serenity-hotel-3.jpg', 'e', 'Lake Kivu sunset', 5, 1200],
  ['stays/canopy-eco-camp-1.jpg', 'p', 'safari tent lodge', 3, 1400],
  ['stays/canopy-eco-camp-2.jpg', 'c', 'Nyungwe National Park', 3, 1200],
  ['stays/canopy-eco-camp-3.jpg', 'e', 'Nyungwe canopy walk', 7, 1200],
  ['stays/savannah-tented-camp-1.jpg', 'p', 'tented camp Africa', 8, 1400],
  ['stays/savannah-tented-camp-2.jpg', 'c', 'Akagera National Park wildlife', 3, 1200],
  ['stays/savannah-tented-camp-3.jpg', 'c', 'Akagera National Park wildlife', 7, 1200],
  ['stays/hill-suites-kigali-1.jpg', 'p', 'Kigali hotel building', 0, 1400],
  ['stays/hill-suites-kigali-2.jpg', 'p', 'hotel pool Africa', 0, 1200],
  ['stays/hill-suites-kigali-3.jpg', 'c', 'Kigali skyline', 2, 1200],
  ['stays/lakeside-villa-kibuye-1.jpg', 'p', 'tented camp Africa', 6, 1400],
  ['stays/lakeside-villa-kibuye-2.jpg', 'e', 'Lake Kivu sunset', 6, 1200],
  ['stays/lakeside-villa-kibuye-3.jpg', 'p', 'Rwanda resort', 2, 1200],
  ['stays/ibisi-garden-guesthouse-1.jpg', 'p', 'hotel pool Africa', 0, 1400],
  ['stays/ibisi-garden-guesthouse-2.jpg', 'p', 'Gorillas Nest Hotel', 5, 1200],
  ['stays/ibisi-garden-guesthouse-3.jpg', 'p', 'hotel pool Africa', 5, 1200],
  ['stays/bisate-ridge-retreat-1.jpg', 'p', 'safari tent lodge', 5, 1400],
  ['stays/bisate-ridge-retreat-2.jpg', 'c', 'incategory:"Quality images" Gorilla beringei', 3, 1200],
  ['stays/bisate-ridge-retreat-3.jpg', 'p', 'hotel pool Africa', 8, 1200],
  ['stays/rubavu-beach-villa-1.jpg', 'p', 'hotel pool Africa', 4, 1400],
  ['stays/rubavu-beach-villa-2.jpg', 'c', 'Lake Kivu Serena Hotel', 1, 1200],
  ['stays/rubavu-beach-villa-3.jpg', 'e', 'Lake Kivu sunset', 7, 1200],
  ['stays/nyarutarama-inn-1.jpg', 'p', 'Gorillas Nest Hotel', 5, 1400],
  ['stays/nyarutarama-inn-2.jpg', 'p', 'Kigali hotel building', 1, 1200],
  ['stays/nyarutarama-inn-3.jpg', 'c', 'Kigali skyline', 3, 1200],
  ['stays/twin-lakes-retreat-1.jpg', 'p', 'tented camp Africa', 9, 1400],
  ['stays/twin-lakes-retreat-2.jpg', 'c', 'Lake Ruhondo Rwanda', 3, 1200],
  ['stays/twin-lakes-retreat-3.jpg', 'c', 'Lake Burera Rwanda', 8, 1200],
  ['stays/gisovu-tea-lodge-1.jpg', 'p', 'tented camp Africa', 4, 1400],
  ['stays/gisovu-tea-lodge-2.jpg', 'c', 'Rwanda tea plantation', 3, 1200],
  ['stays/gisovu-tea-lodge-3.jpg', 'c', 'Rwanda tea plantation', 5, 1200],

  ['experiences/gorilla-trekking.jpg', 'px', 'gorilla', 0, 1400],
  ['experiences/golden-monkey-trekking.jpg', 'e', 'golden monkey Rwanda', 1, 1400],
  ['experiences/kivu-boat-cruise.jpg', 'c', 'Lake Kivu Serena Hotel', 1, 1400],
  ['experiences/nyungwe-canopy-walk.jpg', 'e', 'Nyungwe canopy walk', 7, 1400],
  ['experiences/akagera-game-drive.jpg', 'c', 'Akagera National Park wildlife', 7, 1400],
  ['experiences/kigali-city-tour.jpg', 'c', 'Kigali skyline', 2, 1400],
  ['experiences/intore-cultural-village.jpg', 'e', 'Rwanda dancers Intore', 0, 1400],
  ['experiences/twin-lakes-cycling.jpg', 'c', 'Lake Burera Rwanda', 8, 1400],
  ['experiences/tea-estate-walk.jpg', 'c', 'Rwanda tea plantation', 3, 1400],
  ['experiences/coffee-roastery.jpg', 'e', 'Rwanda coffee', 0, 1400],
];

function get(url) {
  return new Promise((res, rej) => {
    const req = https.get(
      url,
      { headers: { 'User-Agent': 'HamubereDemo/1.0 (demo; contact@hamubere.com)' } },
      (r) => {
        if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
          r.resume();
          return get(new URL(r.headers.location, url).toString()).then(res, rej);
        }
        if (r.statusCode !== 200) {
          r.resume();
          return rej(new Error('HTTP ' + r.statusCode + ' ' + url));
        }
        const b = [];
        r.on('data', (c) => b.push(c));
        r.on('end', () => res(Buffer.concat(b)));
      }
    );
    req.on('error', rej);
    req.setTimeout(45000, () => {
      req.destroy();
      rej(new Error('timeout ' + url));
    });
  });
}

(async () => {
  const credits = [];
  let ok = 0;
  let fail = 0;
  for (const [dest, src, q, i, w] of map) {
    try {
      const meta = pick(src, q, i, w);
      const out = path.join('public/images', dest);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      const buf = await get(meta.url);
      if (buf.length < 15000) throw new Error('too small ' + buf.length);
      fs.writeFileSync(out, buf);
      credits.push({ file: '/images/' + dest, title: meta.title, source: meta.page });
      ok++;
      console.log('OK', dest, Math.round(buf.length / 1024) + 'KB');
    } catch (e) {
      fail++;
      console.log('FAIL', dest, e.message);
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  fs.mkdirSync('assets-src', { recursive: true });
  fs.writeFileSync('assets-src/credits.json', JSON.stringify(credits, null, 1));
  console.log('done ok=' + ok + ' fail=' + fail);
})();
