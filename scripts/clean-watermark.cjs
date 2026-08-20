const { Jimp } = require('jimp');
const path = require('path');

async function cleanWatermark() {
  const inputPath = path.join(__dirname, 'src/imports/portrait-cutout.png');
  const image = await Jimp.read(inputPath);
  
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  console.log(`Image dimensions: ${width}x${height}`);

  // The sparkle is in the bottom-right region near the blazer edge
  // Let's inspect the bottom-right 20% width and bottom 20% height
  // Specifically: x > width * 0.75, y > height * 0.80
  // Let's scan for white/bright sparkle pixels surrounded by transparent or dark blazer pixels
  for (let y = Math.floor(height * 0.75); y < height; y++) {
    for (let x = Math.floor(width * 0.75); x < width; x++) {
      const color = image.getPixelColor(x, y);
      const r = (color >> 24) & 255;
      const g = (color >> 16) & 255;
      const b = (color >> 8) & 255;
      const a = color & 255;

      // The Gemini sparkle is bright/white with high luminance (r > 160, g > 160, b > 160)
      // in the bottom right corner region where the background is transparent or blazer is dark
      if (a > 20 && r > 150 && g > 150 && b > 150) {
        // Clear the sparkle pixel to transparent
        image.setPixelColor(0x00000000, x, y);
      }
    }
  }

  const outputPath = path.join(__dirname, 'src/imports/portrait-cutout.png');
  const publicPath = path.join(__dirname, 'public/portrait-cutout.png');
  await image.write(outputPath);
  await image.write(publicPath);
  console.log('Watermark removed and image saved successfully!');
}

cleanWatermark().catch(err => {
  console.error('Error:', err);
});
