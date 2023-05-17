const view_all_departments = "View All Departments";
const view_all_employees = "View All Employees";
const view_all_roles = "View All Roles";
const view_employees_by_department = "View employees By department";
const view_employees_by_manager = "View employees By manager";
const add_a_department = "Add A Department";
const add_an_employee = "Add An Employee";
const add_a_role = "Add A Role";
const update_an_employee_role = "Update An Employee's Role";
const update_an_employee_manager = "Update An Employee's Manager";
const delete_department = "Delete A Department";
const delete_employee = "Delete An Employee";
const delete_role = "Delete A Role";
const quit = "Quit";

const inquirer = require("inquirer");
const con = require("./db/connection");

function show(query, cb) {
  con
    .promise()
    .query(query)
    .then(([rows, fields]) => {
      console.table(rows);
      cb();
    })
    .catch((err) => console.log(err));
  //.then(() => con.end());
}

function showAllDepartments(cb) {
  show(`SELECT * from departments`, cb);
}
function showAllEmployees(cb) {
  show(
    `SELECT e.id, e.first_name, e.last_name, r.title AS job_title, r.salary,d.name AS department, m.first_name AS manager FROM employees AS e
    LEFT JOIN roles AS r
    ON e.role_id=r.id
    LEFT JOIN departments AS d
    ON r.department_id=d.id
    LEFT JOIN employees AS m
    ON e.manager_id=m.id
    `,
    cb
  );
}
function showAllRoles(cb) {
  show(
    `SELECT r.id, r.title, r.salary,d.name AS department
    FROM roles AS r 
    LEFT JOIN departments AS d 
    ON r.department_id=d.id`,
    cb
  );
}

function showEmployeesByDepartment(callbackQuestionFunc) {
  con
    .promise()
    .query("SELECT name FROM departments")
    .then(([rows, fields]) => {
      const departments = rows.map((r) => r.name);
      inquirer
        .prompt({
          name: "department",
          message: "Choose a department to see employees in:",
          type: "list",
          choices: departments,
        })
        .then(({ department }) => {
          const query = `SELECT e.id, e.first_name, e.last_name, r.title AS job_title, r.salary,d.name AS department, m.first_name AS manager
           FROM employees AS e
            LEFT JOIN roles AS r
            ON e.role_id=r.id
            LEFT JOIN departments AS d
            ON r.department_id=d.id
            LEFT JOIN employees AS m
            ON e.manager_id=m.id`;

          con
            .promise()
            .query(query)
            .then(([rows, fields]) => {
              const emp = rows.filter((e) => e.department === department);
              console.table(emp);

              callbackQuestionFunc();
            })
            .catch((err) => console.log(err));
        });
    })
    .catch((err) => console.log(err));
  // chose department
  // get employees from department
}
function showEmployeesByManager(callbackQuestionFunc) {
  con
    .promise()
    .query(
      `SELECT e.id, e.first_name, e.last_name, m.first_name AS manager_firstName, m.last_name AS manager_lastName, m.id AS manager_id
           FROM employees AS e
            LEFT JOIN employees AS m
            ON e.manager_id=m.id`
    )
    .then(([rows, fields]) => {
      const managers = rows.filter((r) => r.manager_id);
      const manDisplay = managers.map(
        (m) => m.manager_firstName + " " + m.manager_lastName
      );
      inquirer
        .prompt({
          name: "manager",
          message: "Choose a manager to see employees:",
          type: "list",
          choices: manDisplay,
        })
        .then(({ manager }) => {
          const emp = rows.filter(
            (m) =>
              m.manager_firstName == manager.split(" ")[0] &&
              m.manager_lastName == manager.split(" ")[1]
          );

          console.table(emp);

          callbackQuestionFunc();
        });
    })
    .catch((err) => console.log(err));
}

function addADepartment(cb) {
  inquirer
    .prompt([
      {
        name: "name",
        message: "What is the department name?",
      },
    ])
    .then((data) => {
      if (data.name) {
        con
          .promise()
          .query("INSERT INTO departments SET ?", data)
          .then(() => {
            console.log("Department added");
            cb();
          });
      }
    });
}
function addAnEmployee(cb) {
  inquirer
    .prompt([
      {
        name: "firstName",
        message: "What is the employees first name?",
      },
      {
        name: "lastName",
        message: "What is the employees last name?",
      },
    ])
    .then((res) => {
      let data = {
        first_name: res.firstName,
        last_name: res.lastName,
      };
      con
        .promise()
        .query(
          "SELECT r.id, r.title, r.salary,d.name AS department FROM roles AS r LEFT JOIN departments AS d ON r.department_id=d.id"
        )
        .then(([row]) => {
          const roleChoices = row.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt({
              name: "role",
              message: "What is this employee`s role?",
              type: "list",
              choices: roleChoices,
            })
            .then((res) => {
              data.role_id = res.role;
              con
                .promise()
                .query("SELECT * FROM employees")
                .then(([row]) => {
                  const managerChoices = row.map(
                    ({ first_name, last_name, id }) => ({
                      name: `${first_name} ${last_name}`,
                      value: id,
                    })
                  );
                  managerChoices.push({ name: "None", value: null });
                  inquirer
                    .prompt({
                      name: "manager",
                      message: "Who is this employee`s manager?",
                      type: "list",
                      choices: managerChoices,
                    })
                    .then((res) => {
                      data.manager_id = res.manager;
                      con
                        .promise()
                        .query("INSERT INTO employees SET ?", data)
                        .then(() => {
                          console.log("Employee added");
                          cb();
                        });
                    });
                });
            });
        });
    });
}
function addARole(cb) {
  inquirer
    .prompt([
      {
        name: "title",
        message: "What is the title of the role?",
      },
      {
        name: "salary",
        message: "What is the salary of the role?",
      },
    ])
    .then((titleAndSalary) => {
      con
        .promise()
        .query("SELECT * FROM departments")
        .then(([departments]) => {
          const roleChoices = departments.map((r) => r.name);
          inquirer
            .prompt({
              name: "department",
              message: "What is the department for this role?",
              type: "list",
              choices: roleChoices,
            })
            .then((res) => {
              const department = departments.find(
                (d) => d.name == res.department
              );
              const data = { ...titleAndSalary, department_id: department.id };
              con
                .promise()
                .query("INSERT INTO roles SET ?", data)
                .then(() => {
                  console.log("Role added");
                  cb();
                });
            });
        });
    });
}
function updateEmployeeRole() {
  console.log("update employee role");
}
function updateEmployeeManager() {
  console.log("update employee manager");
}
function deleteDepartment() {
  console.log(delete_department);
}
function deleteEmployee() {
  console.log(delete_employee);
}
function deleteRole() {
  console.log(delete_role);
}
function stop() {
  console.log("Quiting...");
  console.log("Application stopped!");
}

function answerQuestion(question, callbackQuestionFunc) {
  switch (question) {
    case view_all_departments:
      showAllDepartments(callbackQuestionFunc);
      break;
    case view_all_employees:
      showAllEmployees(callbackQuestionFunc);
      break;
    case view_all_roles:
      showAllRoles(callbackQuestionFunc);
      break;
    case view_employees_by_department:
      return showEmployeesByDepartment(callbackQuestionFunc);
    case view_employees_by_manager:
      return showEmployeesByManager(callbackQuestionFunc);
    case add_a_department:
      return addADepartment(callbackQuestionFunc);
      break;
    case add_an_employee:
      return addAnEmployee(callbackQuestionFunc);

    case add_a_role:
      return addARole(callbackQuestionFunc);
    case update_an_employee_role:
      updateEmployeeRole(callbackQuestionFunc);
      break;
    case update_an_employee_manager:
      updateEmployeeManager(callbackQuestionFunc);
      break;
    case delete_department:
      deleteDepartment(callbackQuestionFunc);
      break;
    case delete_employee:
      deleteEmployee(callbackQuestionFunc);
      break;
    case delete_role:
      deleteRole(callbackQuestionFunc);
      break;
    case quit:
      return stop();
    default:
      return stop();
  }
  // delay a sec before calling the questions again so that we can finish printing the table
  // setTimeout(() => {
  //   return callbackQuestionFunc();
  // }, 1000);
}

module.exports = {
  answerQuestion,
  view_all_departments,
  view_all_employees,
  view_all_roles,
  view_employees_by_department,
  view_employees_by_manager,
  add_a_department,
  add_an_employee,
  add_a_role,
  update_an_employee_role,
  update_an_employee_manager,
  delete_department,
  delete_employee,
  delete_role,
  quit,
};
