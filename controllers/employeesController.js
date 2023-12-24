// const data = {
//     employees: require('../model/employees.json'),
//     setEmployees: function(data) {this.employees = data}
// };
const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    // find() returns all of the employees
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees found'});
    return res.json(employees)
}

const createNewEmployee = async (req, res) => {
    // Look to see if first and last name were received
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required'})
    }

    // Create new employee
    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        res.status(201).json(result)
    } catch (err) {
        console.error(err)
    }
    // if (!newEmployee.firstname || !newEmployee.lastname) {
    //     return res.status(400).json({'message': 'First and last names are required.'})
    // }
    // data.setEmployees([...data.employees, newEmployee])
    // res.status(201).json(data.employees);
}

const updateEmployee = async (req, res) => {
    // Check to see if there is an id parameter
    if (!req?.body?.id) return res.status(400).json({'message': 'ID parameter is required'})
    // Find employee that matches the id
    // const employee = data.employees.find(employ => employ.id === parseInt(req.body.id)) // parseInt converts String to Int
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({'message': `No employee matches ID: ${req.body.id}`});
    }

    if (req.body.firstname) {
        employee.firstname = req.body.firstname;
    }
    
    if (req.body.lastname) {
        employee.lastname = req.body.lastname;
    }
    const result = await employee.save();
    // // Get list of employees that DON'T match the id
    // const filteredArray = data.employees.filter(employ => employ.id !== parseInt(req.body.id));
    // // Combine filteredArray with the employee with matching id
    // const unsortedArray = [...filteredArray, employee];
    // // Sort the array by id
    // data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1: a.id < b.id ? -1 : 0));
    res.status(201).json(result);
}

const deleteEmployee = async (req, res) => {
    // Check if ID is received
    if (!req?.body?.id) return res.status(400).json({'message': 'ID parameter is required'})

    // Check if employee id exists
    // const employee = data.employees.find((employ) => employ.id === req.body.id);
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({'message': `No employee matches ID: ${req.body.id}`});
    }
    // // Create a new array without the employee
    // const filteredArray = data.employees.filter((employ => employ.id !== req.body.id));
    // // Set the new employees
    // data.setEmployees([...filteredArray]);
    // Delete employee at that id
    const result = await Employee.deleteOne({ _id: req.body.id});
    res.status(201).json(result);
}

const getEmployee = async (req, res) => {
    // Check if ID is received
    if (!req?.params?.id) return res.status(400).json({'message': 'ID parameter is required'});
    
    // const employee = data.employees.find((employ) => employ.id === req.body.id);
    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(400).json({"message" : `Employee ID ${req.params.id} not found`});
    }
    res.json(employee);
}

module.exports = { getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee }