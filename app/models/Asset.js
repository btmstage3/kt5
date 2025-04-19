const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define("Asset", {
    _asset_id_pk: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    make: DataTypes.STRING,
    model: DataTypes.STRING,

    __category_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    __user_id_fk: {
      type: DataTypes.UUID,
    },

    __employee_id_fk: {   
      type: DataTypes.UUID,
      allowNull: true, 
    },

    item_number: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
    },   

    purchase_date: DataTypes.DATEONLY,
    cost: DataTypes.DECIMAL(10, 2),
    status: DataTypes.STRING,
    branch: DataTypes.STRING,

    is_issued: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    is_returned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    is_scrap: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'assets',
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Asset;
};
