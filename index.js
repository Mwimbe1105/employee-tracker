var mysql = require("mysql");
var inquirer = require("inquirer");
var console_table = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3000,
    user: "root",
    password: "yourRootPassword",
    database: "employee_trackerDB"
});

//creates connection and runs application
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    connection.query("SELECT * from role", function (error, res) {
        showroles = res.map(role => ({ name: role.title, value: role.id }))
      });

    connection.query("SELECT * from employee", function (error, res) {
        showemployees = res.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
      });

    connection.query("SELECT * from department", function(error, res) {
        showdepartments = res.map(dept => ({ name: dept.name, value: dept.id }));
      });

    runApp();
});

function runApp() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "View All Departments",
                "View All Roles",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Remove Employee",
                "Update Employee Role",
                "Exit Application"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    allEmployees();
                    break;
                case "View All Employees by Department":
                    allEmployeesByDepartment();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Remove Employee":
                    deleteEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Exit Application":
                    connection.end();
                    break;
            }
        });
}

//function to view all employees
function allEmployees() {
    console.log("\nViewing all employees...\n");
    connection.query(
        "SELECT employee.id, first_name AS FIRSTNAME, last_name AS LASTNAME, title AS POSITION, name AS DEPARTMENT, salary as SALARY FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;", function (err, res) {
            if (err) throw err;
            console.table('ALL EMPLOYEES', res);
            runApp();
        });
}

//function to view All Departments
function viewAllDepartments() {
    connection.query("SELECT id, name AS DEPARTMENT FROM department", function(err, res) {
      if (err) throw err;
      console.table('\nALL DEPARTMENTS\n', res);
      runApp();
    });
  }

//function to view employees by department choice
function allEmployeesByDepartment() {
    inquirer.prompt({
        name: "dept",
        type: "list",
        message: "What department would you like to view?",
        choices: showdepartments
    })
        .then(function (answer) {
            connection.query(
                "SELECT employee.id, first_name AS FIRSTNAME, last_name AS LASTNAME, title AS POSITION, name AS DEPARTMENT, salary as SALARY FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = ? ORDER BY title", [answer.dept], function (err, res) {
                    if (err) throw err;
                    console.table('\nALL EMPLOYEES BY DEPARTMENT\n', res);
                    runApp();
                });
        });
}

//function to view all Roles sorted by Department
function viewAllRoles() {
    connection.query("SELECT role.id, title AS ROLE, SALARY, name AS DEPARTMENT FROM role LEFT JOIN department ON department_id = department.id ORDER BY department.name", function(err, res) {
      if (err) throw err;
      console.table('ALL ROLES', res);
      runApp();
    });
  }

//function to add an employee
function addEmployee() {

    inquirer.prompt([
        {
            type: "input",
            name: "firstname",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastname",
            message: "What is the employee's last name?"
        },
        {
            name: "position",
            type: "list",
            message: "What is this employee's position?",
            choices: showroles
        }
        ]).then(function (answer) {
            var query = connection.query(
                "INSERT INTO employee SET ?", 
                {
                    first_name: answer.firstname,
                    last_name: answer.lastname,
                    role_id: answer.position,
                  },
                function (err, res) {
                    if (err) throw err;
                    console.table("\nNew Employee Added Successfully!\n");
                    runApp();
                });
        });
}


function addDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "new_department",
          message: "What department would you like to add?"
        }
      ])
      .then(function(answer) {
        var query = connection.query(
          "INSERT INTO department SET ?",
          {
            name: answer.new_department
          },
          function(err, res) {
            if (err) throw err;
            console.table("\nNew Department Added.\n");
            runApp();
          }
        );
      });
  }

  //function to add a role
  function addRole() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "new_role",
          message: "What role would you like to add?"
        },
        {
          type: "input",
          name: "new_salary",
          message: "What is the salary of this role?"
        },
        {
          name: "department",
          type: "list",
          message: "Which department does this role belong to?",
          choices: showdepartments
        }
      ])
      .then(function(answer) {
        var query = connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.new_role,
            salary: answer.new_salary,
            department_id: answer.department
          },
          function(err, res) {
            if (err) throw err;
            console.table("\nNew Role Added.\n");
            runApp();
          }
        );
      });
  }

//function to delete employee
function deleteEmployee() {

    inquirer.prompt([
        {
            name: "removal",
            type: "list",
            message: "What employee would you like to remove?",
            choices: showemployees
        }
        ]).then(function (answer) {
            var query = connection.query(
                "DELETE FROM employee WHERE employee.id = ?", 
                [answer.removal],
                function (err, res) {
                    if (err) throw err;
                    console.table("\nEmployee Removed from Database!\n");
                    runApp();
                });
        });
}


    function addEmployee() {

        inquirer.prompt([
            {
                type: "input",
                name: "firstname",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the employee's last name?"
            },
            {
                name: "position",
                type: "list",
                message: "What is this employee's position?",
                choices: showroles
            }
            ]).then(function (answer) {
                var query = connection.query(
                    "INSERT INTO employee SET ?", 
                    {
                        first_name: answer.firstname,
                        last_name: answer.lastname,
                        role_id: answer.position,
                      },
                    function (err, res) {
                        if (err) throw err;
                        console.table("\nNew Employee Added Successfully!\n");
                        runApp();
                    });
            });
    }
    
    //function to update Employee role
    function updateEmployeeRole() {
    
        inquirer.prompt([
            {
                name: "updateEmp",
                type: "list",
                message: "Which employee would you like to update?",
                choices: showemployees
            },
            {
                name: "updateRole",
                type: "list",
                message: "Which role would like you to assign to this employee?",
                choices: showroles
            }
            ]).then(function (answer) {
                var query = connection.query(
                    "UPDATE employee SET ? WHERE ?", [
                    {
                        role_id: answer.updateRole
                    },
                    {
                        id: answer.updateEmp
                    }],
                    function (err, res) {
                        if (err) throw err;
                        console.table("\nEmployee's Role has been Updated!\n");
                        runApp();
                    });
            });
    }

// var rufus= {
//     name: "rufus",
//     size: 6,
//     isMale: true,
//     favoriteFoods: [
//         "kibble",
//         "canFodd",

//     ],
//     Color:{
//         head: "brown",
//         body: "white",
//         tail: "black",
//     }
// }
// rufus.Color.body
// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
// Mock-Up