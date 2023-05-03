import express from 'express';
import images from './api/images';

const routes = express.Router();

routes.get('/', (_, res) => {
  res.status(200).send('Image Processing API is running.');
});

routes.use('/images', images);
export default routes;
