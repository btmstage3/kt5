const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../../config/config.js'))[env];
const sequelize = new Sequelize(config.url, { dialect: config.dialect });
const db = {};

db.Employee = require('./Employee')(sequelize, DataTypes);
db.User = require('./User')(sequelize, DataTypes);
db.AssetCategory = require('./AssetCategory')(sequelize, DataTypes);
db.Asset = require('./Asset')(sequelize, DataTypes);
db.AssetIssue = require('./AssetIssue')(sequelize, DataTypes);
db.AssetReturn = require('./AssetReturn')(sequelize, DataTypes);


// Asset <-> AssetCategory
db.Asset.belongsTo(db.AssetCategory, {
  foreignKey: '__category_id_fk',
  targetKey: '_category_id_pk',
  as: 'AssetCategory'
});
db.AssetCategory.hasMany(db.Asset, {
  foreignKey: '__category_id_fk',
  sourceKey: '_category_id_pk',
  as: 'Assets'
});

// Asset <-> User
db.Asset.belongsTo(db.User, {
  foreignKey: '__user_id_fk',
  targetKey: '_user_id_pk'
});
db.User.hasMany(db.Asset, {
  foreignKey: '__user_id_fk',
  sourceKey: '_user_id_pk'
});

// AssetIssue <-> Employee
db.AssetIssue.belongsTo(db.Employee, {
  foreignKey: '__employee_id_fk',
  targetKey: '_employee_id_pk'
});
db.Employee.hasMany(db.AssetIssue, {
  foreignKey: '__employee_id_fk',
  sourceKey: '_employee_id_pk'
});

// AssetIssue <-> Asset
db.AssetIssue.belongsTo(db.Asset, {
  foreignKey: '__asset_id_fk',
  targetKey: '_asset_id_pk'
});
db.Asset.hasMany(db.AssetIssue, {
  foreignKey: '__asset_id_fk',
  sourceKey: '_asset_id_pk'
});

// AssetIssue <-> User
db.AssetIssue.belongsTo(db.User, {
  foreignKey: '__user_id_fk',
  targetKey: '_user_id_pk'
});
db.User.hasMany(db.AssetIssue, {
  foreignKey: '__user_id_fk',
  sourceKey: '_user_id_pk'
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

