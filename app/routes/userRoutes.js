const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.render('login', { error: 'User not found' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { error: 'Incorrect password' });
    }
    req.session.user = {
      _user_id_pk: user._user_id_pk,
      username: user.username,
      role: user.role
    };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(" Login error:", err);
    res.status(500).render('login', { error: 'Internal server error' });
  }
});

module.exports = router;
