// controllers/authController.js
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.loginPage = (req, res) => {
  res.render('user/login', { error: null });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.render('user/login', { error: 'User not found' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('user/login', { error: 'Incorrect password' });
    }
    req.session.user = null;
    req.session.user = { id: user._user_id_pk, username: user.username, role: user.role, };
    console.log('Session after login:', req.session.user);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).render('user/login', { error: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
