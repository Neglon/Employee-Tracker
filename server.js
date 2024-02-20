const inquirer = require('inquirer');
const connection = require('./connection');

function start() {
  inquirer.prompt({
    name: 'choice',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'Delete Role',
      'View All Departments',
      'Add Department',
      'Delete Department',
      'Exit'
    ]
  }).then(answer => {
    switch (answer.choice) {
      case 'View all Employees':
        viewAllEmployees();
        break;
      case 'Add Employee':
        break;
      case 'Update Employee Role':
        break;
      case 'View All Roles':
        ViewAllRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Delete Role':
        deleteRole();
        break;  
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Delete Department':
        deleteDepartment();
        break;
      default:
        // Exits the application when exit is chosen
        connection.end();
    }
  });
}

//Function to view all employees
function viewAllEmployees() {
    const query = `
        SELECT
            e.id AS id,
            e.first_name AS 'First Name',
            e.last_name AS 'Last Name',
            roles.title AS Title,
            departments.name AS Department,
            roles.salary AS Salary,
            CONCAT(m.first_name, ' ', m.last_name) AS Manager
        FROM employees e
        LEFT JOIN roles ON e.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees m ON e.manager_id = m.id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        // Displays the results in a table
        console.table(res); 
        start();
    });
}

//function to add an employee


// Function to view all departments
function viewAllDepartments() {
    connection.query('SELECT id AS id, name AS Name FROM departments', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

//function to add a department
function addDepartment() {
    inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'What is the name of the department?'
    }).then(answer => {
        connection.query('INSERT INTO departments SET ?', { name: answer.name }, (err, res) => {
            if (err) throw err;
            console.log('Department added');
            start();
        });
    });
}

//function to delete a department
function deleteDepartment() {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        const departments = res.map(department => {
            return {
                name: department.name,
                value: department.id
            };
        });
        console.log(departments);
        inquirer.prompt({
            name: 'department',
            type: 'list',
            message: 'Which department would you like to delete?',
            choices: departments
        }).then(answer => {
            connection.query('DELETE FROM departments WHERE id = ?', answer.department, (err, res) => {
                if (err) throw err;
                console.log('Department deleted');
                start();
            });
        });
    });
}

//Function to view all roles
function ViewAllRoles() {
    const query = `
        SELECT 
            r.id AS id,
            r.title AS Title,
            r.salary AS Salary,
            departments.name AS Department
        FROM roles r
        LEFT JOIN departments ON r.department_id = departments.id
        `;  
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

//function to add a role
function addRole() {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        const departments = res.map(department => {
            return {
                name: department.name,
                value: department.id
            };
        });
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the role?'
            },
            {
                name: 'department',
                type: 'list',
                message: 'Which department does the role belong to?',
                choices: departments
            }
        ]).then(answer => {
            connection.query('INSERT INTO roles SET ?', { title: answer.title, salary: answer.salary, department_id: answer.department }, (err, res) => {
                if (err) throw err;
                console.log('Role added');
                start();
            });
        });
    });
}

//delete a role
function deleteRole() {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        const roles = res.map(role => {
            return {
                name: role.title,
                value: role.id
            };
        });
        inquirer.prompt({
            name: 'role',
            type: 'list',
            message: 'Which role would you like to delete?',
            choices: roles
        }).then(answer => {
            connection.query('DELETE FROM roles WHERE id = ?', answer.role, (err, res) => {
                if (err) throw err;
                console.log('Role deleted');
                start();
            });
        });
    });
}

start();