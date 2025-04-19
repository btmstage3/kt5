const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const AssetReturn = sequelize.define('AssetReturn', {
    _asset_return_id_pk: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    __employee_id_fk: {
      type: DataTypes.UUID,
      allowNull: true
    },
    __asset_id_fk: {
      type: DataTypes.UUID,
      allowNull: false
    },
    __user_id_fk: {
      type: DataTypes.UUID,
      allowNull: false
    },
    return_date: {
      type: DataTypes.DATEONLY,
      defaultValue: Sequelize.NOW
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_returned: {
      type: DataTypes.SMALLINT,
      defaultValue: 0
    },
    is_scraped: {
      type: DataTypes.SMALLINT,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE(true),
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE(true),
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'asset_returns',
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return AssetReturn;
};
