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
      'View All Departments',
      'Add Department',
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
        break;
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'Add Department':
        break;
      default:
        // Exits the application when exit is chosen
        connection.end();
    }
  });
}

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



function viewAllDepartments() {
    connection.query('SELECT id AS id, name AS Name FROM departments', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function ViewAllRoles() {
    connection.query('SELECT id AS id, title AS Title, salary AS Salary FROM roles', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}


start();