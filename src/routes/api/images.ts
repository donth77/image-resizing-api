import express from 'express';
import fs from 'fs';
import path from 'path';
import cacheMiddleware from '../../middleware/cacheMiddleware';
import { isNumber } from '../../utils';
import { resize } from '../../imageHelpers';

const images = express.Router();

const cacheDuration = 3600; // store in cache for 3600 seconds or 1 hour
images.use(cacheMiddleware(cacheDuration));

images.get('/', async (req, res) => {
  const { filename, width, height } = req.query;

  // Check if query paramters are valid
  if (!filename || !width || !height) {
    return res
      .status(400)
      .send(
        `Request must include query parameters for filename, width, and height`
      );
  }

  // Check if width and height are valid
  if (!isNumber(width.toString()) || !isNumber(height.toString())) {
    return res.status(400).send(`width and height must be valid numbers`);
  }

  const fileExt = 'jpg';

  const assetsDir = path.join(path.resolve(__dirname, '..', '..'), 'assets');
  const filePath = path.join(assetsDir, 'full', `${filename}.${fileExt}`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(400).send(`File doesn't exist at path ${filePath}`);
  }

  // Resize image
  const newFilePath = path.join(assetsDir, 'thumb', `${filename}.${fileExt}`);
  try {
    await resize(filePath, newFilePath, Number(width), Number(height));
    return res.sendFile(newFilePath);
  } catch (err) {
    return res
      .status(500)
      .send(
        `Error ocurred while attempting to resize file <br><br> ${
          (err as Error)?.message || ''
        }`
      );
  }
});

export default images;
