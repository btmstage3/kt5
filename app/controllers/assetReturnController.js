const { Asset, AssetReturn, Employee, User ,AssetIssue} = require('../models');
const { Op, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

exports.renderReturnAssetForm = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const assets = await Asset.findAll();
    res.render('user/return_asset', { employees1: employees, assets1: assets });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.renderScrapAssetForm = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const assets = await Asset.findAll();
    res.render('user/scrap_asset', { employees1: employees, assets1: assets });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.returnAsset = async (req, res) => {
  const { employee_id, asset_id, reason } = req.body;
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
    const assetReturn =  await AssetReturn.create({
      _asset_return_id_pk: uuidv4(),
      __user_id_fk: userId,
      __employee_id_fk: employee_id,
      __asset_id_fk: asset_id,
      return_date: new Date(),
      reason: reason,
      is_returned: 1,   
      is_scraped: 0    
    });
    await Asset.update( { is_issued: 0, is_returned: 0, __employee_id_fk: null }, { where: { _asset_id_pk: asset_id } } );
    res.redirect('/return/return');
  } catch (error) {
    console.error('Return Asset Error:', error);
    res.status(500).send('Asset return failed');
  }
};

exports.scrapAsset = async (req, res) => {
  const { employee_id, asset_id, reason } = req.body;
  if (!asset_id) {
    return res.status(400).send("Missing asset ID");
  }
  try {
    const userId = req.session.user?.id || req.user?._user_id_pk;
    if (!userId) {
      return res.status(401).send("Unauthorized: No user session");
    }
    const assetScrap = await AssetReturn.create({
      _asset_return_id_pk: uuidv4(),
      __user_id_fk: userId,
      __asset_id_fk: asset_id,
      return_date: new Date(),
      reason: reason,
      is_scraped: 1,  
      is_returned: 0
    });
    await Asset.update( { is_scrap: 1, is_issued: 0, is_returned: 0, __employee_id_fk: null }, { where: { _asset_id_pk: asset_id } } );
    res.redirect('/return/scrap');
  } catch (error) {
    console.error('Scrap Asset Error:', error);
    res.status(500).send('Asset scrap failed');
  }
};

exports.renderHistoryAssetForm = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const assets = await Asset.findAll();
    res.render('user/asset_history', { employees1: employees, assets1: assets });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.historyAsset = async (req, res) => {
  const { asset_id } = req.params;
  try {
    // 1. Fetch asset
    const asset = await Asset.findOne({ where: { _asset_id_pk: asset_id } });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    // 2. Fetch issue and return history
    const [issueHistory, returnHistory] = await Promise.all([
      AssetIssue.findAll({
        where: { __asset_id_fk: asset_id },
        order: [['created_at', 'ASC']]
      }),
      AssetReturn.findAll({
        where: { __asset_id_fk: asset_id },
        order: [['created_at', 'ASC']]
      })
    ]);
    // 3. Build unique employee & user ID sets
    const employeeIdSet = new Set();
    const userIdSet = new Set();
    for (const issue of issueHistory) {
      if (issue.__employee_id_fk !== null && issue.__employee_id_fk !== undefined) {
        employeeIdSet.add(issue.__employee_id_fk);
      }
    }
    for (const ret of returnHistory) {
      if (ret.__employee_id_fk !== null && ret.__employee_id_fk !== undefined) {
        employeeIdSet.add(ret.__employee_id_fk);
      } else if (ret.__user_id_fk !== null && ret.__user_id_fk !== undefined) {
        userIdSet.add(ret.__user_id_fk);
      }
    }
    const employeeIds = Array.from(employeeIdSet);
    const userIds = Array.from(userIdSet);
    // 4. Fetch employee and user names
    const [employees, users] = await Promise.all([
      Employee.findAll({ where: { _employee_id_pk: employeeIds }, attributes: ['_employee_id_pk', 'name'] }),
      User.findAll({ where: { _user_id_pk: userIds }, attributes: ['_user_id_pk', 'username'] })
    ]);
    const employeeMap = Object.fromEntries(employees.map(emp => [emp._employee_id_pk, emp.name]));
    const userMap = Object.fromEntries(users.map(user => [user._user_id_pk, user.username]));
    // 5. Build timeline
    const formatDate = (date) =>
      new Date(date).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    const formatDateTime = (date) =>
      new Date(date).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    const timeline = [
      {
        event_type: 'Purchased',
        date: asset.purchase_date,
        details: `Asset purchased on ${formatDate(asset.purchase_date)}`
      },   
      ...issueHistory.map(issue => ({
        event_type: 'Issued',
        date: issue.created_at,
        details: `Issued to ${employeeMap[issue.__employee_id_fk] || 'Unknown'} on ${formatDateTime(issue.created_at)}`
      })),
      ...returnHistory.map(ret => {
        let returnedBy = 'User';
        if (ret.__employee_id_fk !== null && employeeMap[ret.__employee_id_fk]) {
          returnedBy = employeeMap[ret.__employee_id_fk];
        } else if (ret.__user_id_fk !== null && userMap[ret.__user_id_fk]) {
          returnedBy = userMap[ret.__user_id_fk];
        }
        return {
          event_type: ret.is_scraped ? 'Scrapped' : 'Returned',
          date: ret.created_at,
          details: `${ret.is_scraped ? 'Scrapped' : 'Returned'} by ${returnedBy} on ${formatDateTime(ret.created_at)}<br/>Reason: ${ret.reason}`
        };
      })
    ];
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(timeline);
  } catch (error) {
    console.error('Error fetching asset history:', error);
    res.status(500).send('Error fetching asset history');
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
          //{ is_issued: 1  },
          //{ is_scrap: { [Op.ne]: 1 } },
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

exports.searchAssetsReturn = async (req, res) => {
  const searchQuery = req.query.search || '';
  try {
    const assets = await Asset.findAll({
      where: {
        [Op.and]: [
          { is_issued: { [Op.ne]: 0 } },
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

exports.searchAssetsScrap = async (req, res) => {
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

exports.getIssuedAssets = async (req, res) => {
  const employeeId = req.query.employee_id;
  if (!employeeId) return res.json([]);
  try {
    const issuedAssets = await Asset.findAll({ where: { __employee_id_fk: employeeId, is_issued: 1 }, attributes: ['_asset_id_pk', 'make', 'model', 'item_number'] });
    res.json(issuedAssets);
  } catch (error) {
    console.error('Error fetching issued assets:', error);
    res.status(500).json([]);
  }
};
