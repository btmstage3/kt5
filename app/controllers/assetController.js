// app/controllers/assetController.js
const { Asset, AssetCategory } = require('../models');
const { Sequelize } = require('sequelize');

exports.list = async (req, res) => {
  try {
    const assets = await Asset.findAll({ raw: true });
    const categories = await AssetCategory.findAll({ raw: true });
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._category_id_pk] = cat.name;
    });
    assets.forEach(asset => {
      asset.category_name = categoryMap[asset.__category_id_fk] || '-';
      if (asset.is_scrap === 1) {
        asset.status = 'Scrapped';
      } else if (asset.is_issued === 1) {
        asset.status = 'Issued';
      } else {
        asset.status = 'In Stock';
      }
    });
    res.render('assets/index', { assets });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching assets');
  }
};

exports.form = async (req, res) => {
  const categories = await AssetCategory.findAll();
  const today = new Date().toISOString().split('T')[0];
  res.render('assets/form', { asset: null, categories,  today });
};

exports.create = async (req, res) => {
  const { serial_number, make, model, __category_id_fk, purchase_date, cost, status, branch, } = req.body;
  const userId = req.session.user?.id; 
  try {
    const generateItemNumber = () => Math.floor(10000000 + Math.random() * 90000000).toString();
    let item_number;
    let isUnique = false;
    while (!isUnique) {
      const temp = generateItemNumber();
      const existing = await Asset.findOne({ where: { item_number: temp } });
      if (!existing) { item_number = temp; isUnique = true; }
    }
    const newAsset = await Asset.create({
      serial_number,
      make,
      model,
      __category_id_fk,
      purchase_date,
      cost,
      status,
      branch,
      item_number,
      __user_id_fk: userId,
    });
    res.redirect('/assets');
  } catch (error) {
    const categories = await AssetCategory.findAll();
    res.render('assets/form', {
      asset: req.body,
      categories,
      error: 'Error creating asset'
    });
  }
};

exports.editForm = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    const categories = await AssetCategory.findAll();
    res.render('assets/form', { asset, categories });
  } catch (err) {
    res.status(500).send('Error loading asset for edit');
  }
};

exports.update = async (req, res) => {
  try {
    await Asset.update({
      serial_number: req.body.serial_number,
      make: req.body.make,
      model: req.body.model,
      __category_id_fk: req.body.__category_id_fk,
      purchase_date: req.body.purchase_date,
      cost: req.body.cost,
      status: req.body.status,
      branch: req.body.branch
    }, {
      where: { _asset_id_pk: req.params.id }
    });
    res.redirect('/assets');
  } catch (error) {
    console.error('Error updating asset:', error);
    const asset = await Asset.findByPk(req.params.id);
    const categories = await AssetCategory.findAll();
    res.render('asset/form', {
      error: 'Failed to update asset.',
      asset,
      categories
    });
  }
};
 
exports.stockView = async (req, res) => {
  try {
    const assets = await Asset.findAll({ raw: true });
    const stockByBranch = {};
    const globalStatusCount = {
      in_stock: 0,
      issued: 0,
      scrapped: 0,
    };
    assets.forEach(asset => {
      const { branch, cost, is_issued, is_scrap, is_returned } = asset;
      let status = 'in_stock';
      if (is_scrap === 1) {
        status = 'scrapped';
      } else if (is_issued === 1) {
        status = 'issued';
      }
      if (!stockByBranch[branch]) {
        stockByBranch[branch] = {
          in_stock: 0,
          issued: 0,
          scrapped: 0,
          totalValue: 0
        };
      }
      stockByBranch[branch][status] += 1;
      if (status === 'in_stock') {
        stockByBranch[branch].totalValue += parseFloat(cost || 0);
      }
      if (globalStatusCount[status] !== undefined) {
        globalStatusCount[status] += 1;
      }
    });
    const stockArray = Object.entries(stockByBranch).map(([branch, value]) => ({
      branch,
      in_stock: value.in_stock,
      issued: value.issued,
      scrapped: value.scrapped,
      value: value.totalValue
    }));
    const totalBranches = Object.keys(stockByBranch).length;
    const totalValue = stockArray.reduce((sum, item) => sum + item.value, 0);
    res.render('assets/stock', { stockArray, totalValue, totalBranches, globalStatusCount });
  } catch (error) {
    console.error(" Error loading stock view:", error);
    res.render('assets/stock', { error: "Failed to load stock view" });
  }
};

