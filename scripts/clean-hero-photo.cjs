const { Jimp } = require('jimp');
const path = require('path');

async function processHeroImage() {
  const inputPath = 'C:/Users/sujal/.gemini/antigravity-ide/brain/07d8d671-8dfc-47f9-a0ed-f26f8d85b317/.user_uploaded/media_1787251816440.png';
  const img = await Jimp.read(inputPath);
  
  const width = img.bitmap.width;
  const height = img.bitmap.height;
  console.log(`Dimensions: ${width}x${height}`);

  // The Gemini sparkle is in the bottom-right corner around x: [890, 960], y: [440, 520]
  // Let's sample surrounding blazer pixel color to blend/inpaint any bright sparkle pixels
  for (let y = Math.floor(height * 0.75); y < Math.floor(height * 0.95); y++) {
    for (let x = Math.floor(width * 0.85); x < Math.floor(width * 0.96); x++) {
      const c = img.getPixelColor(x, y);
      const r = (c >> 24) & 255;
      const g = (c >> 16) & 255;
      const b = (c >> 8) & 255;
      const a = c & 255;

      // Detect the white/bright sparkle watermark pixels on the dark blazer
      if (a > 100 && r > 160 && g > 160 && b > 160) {
        // Sample nearby dark blazer pixel (e.g. x - 30)
        const sampleColor = img.getPixelColor(x - 35, y);
        img.setPixelColor(sampleColor, x, y);
      }
    }
  }

  const destImport = path.join(__dirname, '../src/imports/hero-portrait.png');
  const destPublic = path.join(__dirname, '../public/hero-portrait.png');
  
  await img.write(destImport);
  await img.write(destPublic);
  console.log('Hero photograph cleaned and saved successfully to:', destImport);
}

processHeroImage().catch(console.error);
