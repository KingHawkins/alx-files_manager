const router = require('express').Router();
const AppController = require('../controllers/AppController')
const {UsersController} = require('../controllers/UsersController')
const AuthController = require('../controllers/AuthController')
const FilesController = require('../controllers/FilesController')

router.get('/status', AppController.getStatus)
router.get('/stats', AppController.getStats)
router.post('/users', UsersController.createUsers)
router.get('/users/me', AuthController.getMe)
router.get('/disconnect', AuthController.getDisconnect)
router.get('/connect', AuthController.getConnect)
router.post('/files', FilesController.postUpload)

module.exports = router;
