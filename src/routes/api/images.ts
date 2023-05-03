import express from 'express';
import fs from 'fs';
import path from 'path';
import cacheMiddleware from '../../middleware/cacheMiddleware';
import { isNumber } from '../../utils';
import { resize, isFileExtSupported } from '../../imageHelpers';
import { ERROR } from '../../errors';

const DEFAULT_FILE_EXT = 'jpg';

const images = express.Router();

const cacheDuration = 3600; // store in cache for 3600 seconds or 1 hour
images.use(cacheMiddleware(cacheDuration));

images.get('/', async (req, res) => {
  const { filename, width, height, ext } = req.query;

  console.info(`Request - ${JSON.stringify(req.query, null, 4)}`);

  // Check if query paramters are valid
  if (!filename || !width || !height) {
    return res.status(400).send(ERROR.MISSING_QUERY_PARAMS);
  }

  // Check if width and height are valid
  if (!isNumber(width.toString()) || !isNumber(height.toString())) {
    return res.status(400).send(ERROR.WIDTH_HEIGHT_INVALID);
  }

  const newFileExt: string = ext?.toString() || DEFAULT_FILE_EXT;

  if (!isFileExtSupported(newFileExt)) {
    return res.status(400).send(`${ERROR.INVALID_EXT}: ${ext}`);
  }

  const extRegex = /\.[^/.]+$/;
  const extension = filename.toString().match(extRegex);
  const fileExt = extension ? extension[0] : `.${DEFAULT_FILE_EXT}`;
  const filenameNoExt = filename.toString().replace(extRegex, '');

  const assetsDir = path.join(path.resolve(__dirname, '..', '..'), 'assets');
  const filePath = path.join(assetsDir, 'full', `${filenameNoExt}${fileExt}`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(400).send(`${ERROR.FILE_NOT_FOUND} ${filePath}`);
  }

  // Create thumb directory if it doesn't exist
  const thumbDir = path.join(assetsDir, 'thumb');
  try {
    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir);
    }
  } catch (err) {
    return res
      .status(500)
      .send(
        `${ERROR.MKDIR_ERROR} ${thumbDir} <br><br> ${
          (err as Error)?.message || ''
        }`
      );
  }

  // Resize image
  const newFilePath = path.join(
    thumbDir,
    `${filenameNoExt}-${width}x${height}.${newFileExt}`
  );
  try {
    console.info(`Resizing image - ${filePath}\nNew image - ${newFilePath}`);
    await resize(filePath, newFilePath, Number(width), Number(height));
    return res.sendFile(newFilePath);
  } catch (err) {
    return res
      .status(500)
      .send(`${ERROR.RESIZE_ERROR} <br><br> ${(err as Error)?.message || ''}`);
  }
});

export default images;
