import { env } from './config/index.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { sequelize } from "../server/config/index.js";

import { routes } from './routes/router.js';
import { response } from './utils/index.js';
import { messages } from './messages/index.js';

const PORT = env.server.port || process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(
  cors({
    origin: '*',
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/shared/images', express.static(path.join(__dirname, '../client/public/shared/images')));

app.use('/api', routes);


app.use((err, req, res, next) => {
  console.error(err);
  return response(res, {
    statusCode: 500,
    message: messages.general.INTERNAL_SERVER_ERROR,
  });
});

// Sync database and start the server after successful connection
(async () => {
  try {
    // await sequelize.sync({ alter: true }); 
    // await sequelize.sync({ force: true });

    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
})();
