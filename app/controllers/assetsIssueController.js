const { Employee, Asset, AssetIssue, User } = require('../models');
const { Op, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

exports.renderIssueAssetForm = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const assets = await Asset.findAll();
    res.render('user/issue_asset', { employees1: employees, assets1: assets });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.issueAsset = async (req, res) => {
  const { employee_id, asset_id } = req.body;
  if (!employee_id || !asset_id) {
    return res.status(400).send("Missing data");
  }
  try {
      const userId = req.session.user?.id || req.user?._user_id_pk;
      if (!userId) {
        return res.status(401).send('Unauthorized: No user session');
      }
    if (!userId) {
      return res.status(403).send('User not authorized');
    }
    await AssetIssue.create({
      _asset_issue_id_pk: uuidv4(),
      __user_id_fk: userId,
      __employee_id_fk: employee_id,
      __asset_id_fk: asset_id,
      issue_date: new Date()
    });
    await Asset.update( { is_issued: 1, is_returned: 0, __employee_id_fk: employee_id }, { where: { _asset_id_pk: asset_id } } );
    res.redirect('/issue/issue');
  } catch (error) {
    console.error('Issue Asset Error:', error);
    res.status(500).send('Asset issue failed');
  }
};

exports.searchEmployees = async (req, res) => {
  const searchQuery = req.query.search || '';
  try {
    const employees = await Employee.findAll({
      where: {
        status: 'active', 
        [Op.or]: [
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), { [Op.like]: `%${searchQuery.toLowerCase()}%` }),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('emp_code')), { [Op.like]: `%${searchQuery.toLowerCase()}%` }),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('phone')), { [Op.like]: `%${searchQuery.toLowerCase()}%` })
        ]
      }
    });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json([]);
  }
};

exports.searchAssets = async (req, res) => {
  const searchQuery = req.query.search || '';
  try {
    const assets = await Asset.findAll({
      where: {
        [Op.and]: [
          { is_issued: { [Op.ne]: 1 } },
          { is_scrap: { [Op.ne]: 1 } },
          {
            [Op.or]: [
              Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('serial_number')), { [Op.iLike]: `%${searchQuery.toLowerCase()}%` }),
              Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('make')), { [Op.iLike]: `%${searchQuery.toLowerCase()}%` }),
              Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('model')), { [Op.iLike]: `%${searchQuery.toLowerCase()}%` }),
              Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('item_number')), { [Op.iLike]: `%${searchQuery.toLowerCase()}%` })
            ]
          }
        ]
      }
    });
    res.json(assets);
  } catch (err) {
    console.error('Error fetching assets:', err);
    res.status(500).json([]);
  }
};


