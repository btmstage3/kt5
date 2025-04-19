// controllers/assetCategoryController.js
const { AssetCategory } = require('../models');
const { Op, Sequelize } = require('sequelize');

exports.list = async (req, res) => {
  const categories = await AssetCategory.findAll();
  res.render('assetCategory/list', { categories });
};

exports.form = async (req, res) => {
  res.render('assetCategory/form', { category: null });
};

exports.create = async (req, res) => {
  try {
    const existing = await AssetCategory.findOne({
      where: {
        name: Sequelize.where( Sequelize.fn('LOWER', Sequelize.col('name')), req.body.name.toLowerCase() )
      }
    });

    if (existing) {
      return res.render('assetCategory/form', {
        category: req.body,
        error: 'Category with this name already exists.'
      });
    }
    await AssetCategory.create(req.body);
    res.redirect('/categories');
  } catch (err) {
    console.error("Error creating asset category:", err);
    res.render('assetCategory/form', {
      category: req.body,
      error: 'Error creating category. Please check input.'
    });
  }
};

exports.editForm = async (req, res) => {
  const category = await AssetCategory.findByPk(req.params.id);
  res.render('assetCategory/form', { category });
};

exports.update = async (req, res) => {
  try {
    const existing = await AssetCategory.findOne({
      where: {
        name: Sequelize.where( Sequelize.fn('LOWER', Sequelize.col('name')), req.body.name.toLowerCase() ),
        _category_id_pk: { [Sequelize.Op.ne]: req.params.id } 
      }
    });

    if (existing) {
      return res.render('assetCategory/form', {
        category: { ...req.body, _category_id_pk: req.params.id },
        error: 'Another category with this name already exists.'
      });
    }
    await AssetCategory.update(req.body, {
      where: { _category_id_pk: req.params.id }
    });
    res.redirect('/categories');
  } catch (err) {
    console.error("Error updating asset category:", err);
    res.render('assetCategory/form', {
      category: { ...req.body, _category_id_pk: req.params.id },
      error: 'Error updating category. Please check input.'
    });
  }
};

