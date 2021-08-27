require('colors');
require('dotenv').config();
require('express-async-errors');

const express = require('express');
const compression = require('compression');
const fileUpload = require('express-fileupload');

const app = express();
const router = express.Router();

const connectToDatabase = require('./db');
const rootRouter = require('./src/routes/index')(router);
const { NotFoundError } = require('./src/utils/appError');
const isProduction = process.env.NODE_ENV === 'production';
const ErrorHandler = require('./src/middlewares/errorHandler');

app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload({ createParentPath: true }));

if (isProduction) {
  app.set('trust proxy', 1); // Trust first proxy
} else {
  app.use(require('morgan')('dev'));
}

app.use('/api/v1', rootRouter);

app.use(() => {
  throw new NotFoundError();
});

app.use(ErrorHandler);

(async () => {
  await connectToDatabase();
  
  const port = parseInt(process.env.PORT, 10) || 10101;
  const server = app.listen(port, () => {
    console.log(':>>'.green.bold, 'Server running in'.yellow.bold, process.env.NODE_ENV.toUpperCase().blue.bold, 'mode, on port'.yellow.bold, `${port}`.blue.bold)
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', error => {
    // console.log(error);
    console.log(`✖ | Unhandled Rejection: ${error.message}`.red.bold);
    server.close(() => process.exit(1));
  })
})().catch(error => {
  console.log(`✖ | Error: ${error.message}`.red.bold);
});