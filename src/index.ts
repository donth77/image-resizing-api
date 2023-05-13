import express from 'express';
import routes from './routes';
const app = express();
const port = process.env.PORT || 3000;

app.use('/api', routes);

app.all('*', (_, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
