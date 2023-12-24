const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController')
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles')


router.route('/')
    // User is an automatic role since it is needed for the JWT
    .get(employeesController.getAllEmployees)
    // Admins and Editors can post and put employees
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    // Only Admins can delete employees
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee)

router.route('/:id')
    .get(employeesController.getEmployee)

module.exports = router;