const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    _employee_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    emp_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      validate: {
        isEmail: true
      }
    },
    phone: DataTypes.STRING(255),
    department: DataTypes.STRING(255),
    designation: DataTypes.STRING(255),
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'active'
    },
    branch: DataTypes.STRING(255),
    is_active: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1  
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
    tableName: 'employees',
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Employee;
};
