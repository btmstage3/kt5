const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const AssetCategory = sequelize.define("AssetCategory", {
    _category_id_pk: { 
      type: DataTypes.UUID, 
      defaultValue: Sequelize.UUIDV4, 
      primaryKey: true 
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
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
    tableName: "asset_categories",
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return AssetCategory;
};
