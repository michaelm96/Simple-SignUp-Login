const router = require('express').Router();
const userController = require('../controller/userController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/googleLogin', userController.googleLogin);
router.post('/facebookLogin', userController.facebookLogin);
router.post('/check', userController.checkHash);
router.post('/resend', userController.resend);

router.use(authentication);
router.get('/users', userController.getAll);
router.get('/user', userController.getUser);
router.get('/oldPass', userController.oldPassDisabled);
router.get('/activeSessions/:amount', userController.activeSessions);
router.put('/reset/:id',authorization, userController.reset);

module.exports = router