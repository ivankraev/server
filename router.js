const router = require('express').Router();
const authController = require('./routes/auth')
const userController = require('./routes/users')
const moviesController = require('./routes/movies')

router.use('/api/auth', authController);
router.use('/movies', moviesController);
router.use('/api/users', userController);
router.get('*', (req, res) => {
    res.render('404');
});

module.exports = router;