const { Employee } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

//  Utility: Check for duplicates
const checkDuplicateEmployee = async ({ emp_code, email, phone }, excludeId = null) => {
  const conditions = [emp_code && { emp_code }, email && { email }, phone && { phone }].filter(Boolean);
  const where = { [Op.or]: conditions };
  if (excludeId) where._employee_id_pk = { [Op.ne]: excludeId };
  return await Employee.findOne({ where });
};

//  List employees
exports.list = async (req, res) => {
  const where = req.query.status ? { status: req.query.status } : {};
  const employees = await Employee.findAll({ where });
  res.render('employee/list', { employees });
};

exports.form = async (req, res) => {
  res.render('employee/form', { employee: null, isEdit: false });
};

//  Create employee
exports.create = async (req, res) => {
  try {
    const { emp_code, email, phone, ...rest } = req.body;
    const cleanData = {
      emp_code: emp_code?.trim(),
      email: email?.trim().toLowerCase(),
      phone: phone?.trim(),
    };
    const duplicate = await checkDuplicateEmployee(cleanData);
    if (duplicate) {
      let error = 'Employee with same ';
      if (duplicate.emp_code === cleanData.emp_code) error += 'code';
      else if (duplicate.email === cleanData.email) error += 'email';
      else if (duplicate.phone === cleanData.phone) error += 'phone';
      error += ' already exists!';
      return res.render('employee/form', { error, employee: req.body, isEdit: false });
    }
    await Employee.create({
      _employee_id_pk: uuidv4(),
      ...rest,
      ...cleanData,
    });
    res.redirect('/employees');
  } catch (error) {
    console.error(" Error creating employee:", error);
    res.render('employee/form', { error: error.message, employee: req.body, isEdit: false });
  }
};

//  Edit form
exports.editForm = async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  if (!employee) return res.status(404).send("Employee not found");
  res.render('employee/form', { employee, isEdit: true });
};

// Update employee
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { emp_code, email, phone, ...rest } = req.body;
    const cleanData = {
      emp_code: emp_code?.trim(),
      email: email?.trim().toLowerCase(),
      phone: phone?.trim(),
    };

    const duplicate = await checkDuplicateEmployee(cleanData, id);
    if (duplicate) {
      let error = 'Employee with same ';
      if (duplicate.emp_code === cleanData.emp_code) error += 'code';
      else if (duplicate.email === cleanData.email) error += 'email';
      else if (duplicate.phone === cleanData.phone) error += 'phone';
      error += ' already exists!';
      return res.render('employee/form', {
        error,
        employee: { ...req.body, _employee_id_pk: id },
        isEdit: true,
      });
    }

    await Employee.update(
      { ...rest, ...cleanData },
      { where: { _employee_id_pk: id } }
    );

    res.redirect('/employees');
  } catch (error) {
    console.error(" Error updating employee:", error);
    res.render('employee/form', {
      error: error.message,
      employee: req.body,
      isEdit: true,
    });
  }
};
