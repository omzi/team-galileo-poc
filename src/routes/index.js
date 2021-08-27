const appRouter = require('./app.route');
const fileRouter = require('./file.route');
const folderRouter = require('./folder.route');

module.exports = router => {
  router.use('/', appRouter);
  router.use('/file', fileRouter);
  router.use('/folder', folderRouter);

  return router;
}