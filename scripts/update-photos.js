
const fs = require('fs');
const path = require('path');
const exifr = require('exifr');
const { glob } = require('glob');

const PHOTOS_JSON_PATH = path.join(__dirname, '../src/data/photos.json');
const ORIGINAL_DIR = path.join(__dirname, '../public/images/gallery/original');
const WEBP_DIR = path.join(__dirname, '../public/images/gallery/webp');

async function updatePhotos() {
    console.log('📸 Scanning for photos...');

    // 1. Load existing data
    let photos = [];
    if (fs.existsSync(PHOTOS_JSON_PATH)) {
        try {
            const data = fs.readFileSync(PHOTOS_JSON_PATH, 'utf8');
            photos = JSON.parse(data);
        } catch (err) {
            console.error('Error reading photos.json:', err);
        }
    }

    // 2. Scan for original files (JPG/HEIC/PNG)
    // We assume originals are the source of truth for EXIF
    const globPattern = `${ORIGINAL_DIR.replace(/\\/g, '/')}/*.{jpg,jpeg,png,heic,JPG,JPEG,PNG,HEIC}`;
    const originalFiles = await glob(globPattern);

    let updateCount = 0;
    let newCount = 0;

    for (const file of originalFiles) {
        const filename = path.basename(file);
        const id = filename.replace(/\.[^/.]+$/, ""); // Remove extension
        const webpFilename = `${id}.webp`;
        const webpPath = path.join(WEBP_DIR, webpFilename);
        const publicWebpPath = `/images/gallery/webp/${webpFilename}`;

        // Check if corresponding WebP exists
        if (!fs.existsSync(webpPath)) {
            console.warn(`⚠️ WebP version not found for ${filename}. Skipping.`);
            continue;
        }

        // Find existing photo entry
        let photoEntry = photos.find(p => p.id === id);
        const isNew = !photoEntry;

        if (isNew) {
            console.log(`✨ New photo found: ${id}`);
            photoEntry = {
                id: id,
                src: publicWebpPath,
                title: 'Untitled',
                description: '',
                location: 'Unknown',
                tags: [],
            };
            photos.push(photoEntry);
            newCount++;
        } else {
            // Update src just in case
            photoEntry.src = publicWebpPath;
        }

        try {
            // Extract EXIF from ORIGINAL file
            const exifData = await exifr.parse(file, {
                tiff: true,
                exif: true,
                gps: false,
            });

            const make = exifData?.Make || '';
            const model = exifData?.Model || 'Unknown Camera';
            const lens = exifData?.LensModel || '';
            const fNumber = exifData?.FNumber ? `f/${exifData.FNumber}` : '';
            const exposureTime = exifData?.ExposureTime ? (exifData.ExposureTime < 1 ? `1/${Math.round(1 / exifData.ExposureTime)}s` : `${exifData.ExposureTime}s`) : '';
            const iso = exifData?.ISO ? `ISO ${exifData.ISO}` : '';
            const focalLength = exifData?.FocalLength ? `${exifData.FocalLength}mm` : '';

            // Construct EXIF string
            // Priority: Model, Lens, FocalLength, FNumber, ShutterSpeed, ISO
            const exifParts = [];
            if (model) exifParts.push(model);
            if (focalLength) exifParts.push(focalLength);
            if (fNumber) exifParts.push(fNumber);
            if (exposureTime) exifParts.push(exposureTime);
            if (iso) exifParts.push(iso);

            const exifString = exifParts.join(' · ');
            console.log(`[DEBUG] ${id} EXIF: ${exifString}`);

            // Update technical fields
            photoEntry.exif = exifString;
            photoEntry.width = exifData?.ExifImageWidth || photoEntry.width || 0;
            photoEntry.height = exifData?.ExifImageHeight || photoEntry.height || 0;
            photoEntry.dateTaken = exifData?.DateTimeOriginal || photoEntry.dateTaken || new Date().toISOString();

            if (!isNew) updateCount++;

        } catch (err) {
            console.error(`Error processing EXIF for ${filename}:`, err);
        }
    }

    // 3. Save updated data
    if (newCount > 0 || updateCount > 0) {
        fs.writeFileSync(PHOTOS_JSON_PATH, JSON.stringify(photos, null, 2));
        console.log(`✅ Updated photos.json: ${newCount} new, ${updateCount} updated.`);
    } else {
        console.log('👌 Photos are up to date.');
    }
}

updatePhotos();
