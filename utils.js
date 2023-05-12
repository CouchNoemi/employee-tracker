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

const con = require("./db/connection");

function show(table) {
  con
    .promise()
    .query(`SELECT * from ${table}`)
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .catch((err) => console.log(err));
  //.then(() => con.end());
}

function showAllDepartments() {
  show("departments");
}
function showAllEmployees() {
  show("employees");
}
function showAllRoles() {
  show("roles");
}

function showEmployeesByDepartment() {
  console.log(view_employees_by_department);
}
function showEmployeesByManager() {
  console.log(view_employees_by_manager);
}
function addADepartment() {
  console.log("add a department");
}
function addAnEmployee() {
  console.log("add an employee");
}
function addARole() {
  console.log("add a role");
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
      showAllDepartments();
      break;
    case view_all_employees:
      showAllEmployees();
      break;
    case view_all_roles:
      showAllRoles();
      break;
    case view_employees_by_department:
      showEmployeesByDepartment();
      break;
    case view_employees_by_manager:
      showEmployeesByManager();
      break;
    case add_a_department:
      addADepartment();
      break;
    case add_an_employee:
      addAnEmployee();
      break;
    case add_a_role:
      addARole();
      break;
    case update_an_employee_role:
      updateEmployeeRole();
      break;
    case update_an_employee_manager:
      updateEmployeeManager();
      break;
    case delete_department:
      deleteDepartment();
      break;
    case delete_employee:
      deleteEmployee();
      break;
    case delete_role:
      deleteRole();
      break;
    case quit:
      return stop();
    default:
      return stop();
  }
  return callbackQuestionFunc();
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
