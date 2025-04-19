// app.js
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { sequelize } = require('./app/models');
app.use(express.urlencoded({ extended: false }));

const session = require('express-session');
const bcrypt = require('bcrypt');

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'app/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(session({
  secret: '2ae5d986-dada-4d6c-a773-0274f2ab951b',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    maxAge: 1000 * 60 * 60, 
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

const assetRoutes = require('./app/routes/assetRoutes');
const employeeRoutes = require('./app/routes/employeeRoutes');
const assetIssueRoutes = require('./app/routes/assetIssueRoutes');
const assetCategoryRoutes = require('./app/routes/assetCategoryRoutes');
const authRoutes = require('./app/routes/auth');
const assetReturnRoutes = require('./app/routes/assetReturnRoutes');

const { User,Asset,Employee,AssetIssue,AssetCategory } = require('./app/models');

app.use('/', authRoutes);
app.use('/categories', assetCategoryRoutes);
app.use('/assets', assetRoutes); 
app.use('/employees', employeeRoutes);
app.use('/issue', assetIssueRoutes);
app.use('/return', assetReturnRoutes);
 


app.get('/', (req, res) => {
  res.redirect('/login');
});
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// Start server
const PORT = process.env.PORT || 3000;

sequelize.sync().then(async () => {
  const users = await User.findAll();
  if (users.length === 0) {
    await User.create({
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      role: 'admin'
    });
    console.log(' Default admin user created.');
  }
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
});

