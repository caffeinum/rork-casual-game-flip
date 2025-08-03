const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceIcon = path.join(__dirname, '../icon.png');
const assetsPath = path.join(__dirname, '../assets/images');

async function generateIcons() {
  try {
    // ensure assets directory exists
    if (!fs.existsSync(assetsPath)) {
      fs.mkdirSync(assetsPath, { recursive: true });
    }

    // main app icon - 1024x1024 (required by expo)
    await sharp(sourceIcon)
      .resize(1024, 1024)
      .toFile(path.join(assetsPath, 'icon.png'));
    console.log('✓ generated icon.png (1024x1024)');

    // android adaptive icon - 512x512
    await sharp(sourceIcon)
      .resize(512, 512)
      .toFile(path.join(assetsPath, 'adaptive-icon.png'));
    console.log('✓ generated adaptive-icon.png (512x512)');

    // splash screen icon - keep larger for better quality
    await sharp(sourceIcon)
      .resize(512, 512)
      .toFile(path.join(assetsPath, 'splash-icon.png'));
    console.log('✓ generated splash-icon.png (512x512)');

    // web favicon - 48x48
    await sharp(sourceIcon)
      .resize(48, 48)
      .toFile(path.join(assetsPath, 'favicon.png'));
    console.log('✓ generated favicon.png (48x48)');

    console.log('\n✨ all icons generated successfully!');
  } catch (error) {
    console.error('error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();