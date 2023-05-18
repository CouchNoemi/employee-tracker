const inquirer = require("inquirer");
const express = require("express");
const con = require("./db/connection");
const {
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
  quit,
} = require("./utils");

// include connection
con.connect((err) => {
  if (err) console.log(err);
  console.log("Connected to Database successfully!");
});

const PORT = 3001;
const app = express();

const questions = [
  {
    name: "question",
    message: "What would you like to do?",
    type: "list",
    choices: [
      view_all_departments,
      view_all_employees,
      view_all_roles,
      view_employees_by_department,
      view_employees_by_manager,
      add_a_department,
      add_an_employee,
      add_a_role,
      update_an_employee_role,
      quit,
    ],
  },
];

function askQuestion() {
  return inquirer
    .prompt(questions)
    .then(({ question }) => {
      answerQuestion(question, askQuestion);
    })
    .catch((err) => console.log(err));
}

askQuestion();

app.listen(PORT, () => {
  //console.log(`Server running on Port ${PORT}`);
});
