const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const AssetIssue = sequelize.define('AssetIssue', {
    _asset_issue_id_pk: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    __user_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    __employee_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    __asset_id_fk: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
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
    tableName: 'asset_issues',
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return AssetIssue;
};
