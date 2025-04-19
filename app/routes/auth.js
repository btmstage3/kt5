const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const { User, Employee } = require('../models');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/admin/users/create', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.render('user/create_user', { employees });
  } catch (err) {
    console.error(" Error loading create user form:", err);
    res.status(500).send('Failed to load form');
  }
});

router.post('/admin/users/create', isAuthenticated, isAdmin, async (req, res) => {
  const { username, password, __employee_id_fk, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed, role, __employee_id_fk: __employee_id_fk || null });
    res.redirect('/admin/users/create');
  } catch (err) {
    console.error(" Error creating user:", err);
    res.status(500).send('Failed to create user');
  }
});

router.get('/dashboard', authMiddleware.isAuthenticated, (req, res) => {
  //console.log("Session expires at:", req.session.cookie.expires);
  res.render('user/dashboard', { user: req.session.user });
});

module.exports = router;
