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
      'Delete Employee',
      'View All Roles',
      'Add Role',
      'Delete Role',
      'View All Departments',
      'Add Department',
      'Delete Department',
      'Budget by Department',
      'Exit'
    ]
  }).then(answer => {
    switch (answer.choice) {
      case 'View all Employees':
        viewAllEmployees();
        break;
      case 'Add Employee':
        addEmployee(); 
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Delete Employee':
        deleteEmployee();
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
      case 'Budget by Department':
        budgetByDepartment();
        break;  
      default:
        // Exits the application when exit is chosen
        connection.end();
    }
  });
}

//Function to view all employees
function viewAllEmployees() {
    console.clear();
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
        // Clears the console
        console.clear();
        // Displays the results in a table
        console.table(res); 
        start();
    });
}

//function to add an employee
function addEmployee() {
    console.clear();
    const rolesQuery = 'SELECT id, title FROM roles';
    connection.query(rolesQuery, (err, roles) => {
        if (err) throw err;
        const managersQuery = 'SELECT id, first_name, last_name FROM employees WHERE manager_id IS NULL';
        connection.query(managersQuery, (err, managers) => {
            if (err) throw err;
            const rolesChoices = roles.map(role => {
                return {
                    name: role.title,
                    value: role.id
                };
            });
            let managersChoices = managers.map(manager => {
                return {
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id
                };
            });

            // Adds a None option to the managersChoices array by unshifting it to the beginning of the array
            managersChoices.unshift({ name: 'None', value: null });

            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'What is the employees first name?'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'What is the employees last name?'
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'What is the employees role?',
                    choices: rolesChoices
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Who is the employees manager?',
                    choices: managersChoices
                }
            ]).then(answer => {
                connection.query('INSERT INTO employees SET ?', answer, (err, res) => {
                    if (err) throw err;
                    console.clear();
                    console.log('Employee added');
                    start();
                });
            });
        });
    });
} 

//delete an employee
function deleteEmployee() {
    console.clear();
    //console.log("function called")
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        const employees = res.map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            };
        });
        //console.log("pre prompt")
        inquirer.prompt({
            name: 'employee',
            type: 'list',
            message: 'Which employee would you like to delete?',
            choices: employees
        }).then(answer => {
            connection.query('DELETE FROM employees WHERE id = ?', answer.employee, (err, res) => {
                if (err) throw err;
                console.clear();
                console.log('Employee deleted');
                start();
            });
        });
    });

}


// Function to view all departments
function viewAllDepartments() {
    console.clear();
    connection.query('SELECT id AS id, name AS Name FROM departments', (err, res) => {
        if (err) throw err;
        console.clear();
        console.table(res);
        start();
    });
}

//function to add a department
function addDepartment() {
    console.clear();
    inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'What is the name of the department?'
    }).then(answer => {
        connection.query('INSERT INTO departments SET ?', { name: answer.name }, (err, res) => {
            if (err) throw err;
            console.clear();
            console.log('Department added');
            start();
        });
    });
}

//function to delete a department
function deleteDepartment() {
    console.clear();
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        const departments = res.map(department => {
            return {
                name: department.name,
                value: department.id
            };
        });
        //console.log(departments);
        inquirer.prompt({
            name: 'department',
            type: 'list',
            message: 'Which department would you like to delete?',
            choices: departments
        }).then(answer => {
            connection.query('DELETE FROM departments WHERE id = ?', answer.department, (err, res) => {
                if (err) throw err;
                console.clear();
                console.log('Department deleted');
                start();
            });
        });
    });
}

//function to update an employee role
function updateEmployeeRole() {
    console.clear();
    connection.query('SELECT * FROM employees', (err, employees) => {
        if (err) throw err;
        const employeesChoices = employees.map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            };
        });
        connection.query('SELECT * FROM roles', (err, roles) => {
            if (err) throw err;
            const rolesChoices = roles.map(role => {
                return {
                    name: role.title,
                    value: role.id
                };
            });
            inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    message: 'Which employee would you like to update?',
                    choices: employeesChoices
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'What is the employees new role?',
                    choices: rolesChoices
                }
            ]).then(answer => {
                connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [answer.role_id, answer.employee_id], (err, res) => {
                    if (err) throw err;
                    console.clear();
                    console.log('Employee role updated');
                    start();
                });
            });
        });
    });
}

//Function to view all roles
function ViewAllRoles() {
    console.clear();
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
        console.clear();
        console.table(res);
        start();
    });
}

//function to add a role
function addRole() {
    console.clear();
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
                console.clear();
                console.log('Role added');
                start();
            });
        });
    });
}

//delete a role
function deleteRole() {
    console.clear();
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
                console.clear();
                console.log('Role deleted');
                start();
            });
        });
    });
}

//budget by department
function budgetByDepartment() {
    console.clear();
    const query = `
        SELECT 
            departments.name AS Department,
            SUM(roles.salary) AS Budget
        FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        GROUP BY departments.name
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.clear();
        console.table(res);
        start();
    });
}

start();