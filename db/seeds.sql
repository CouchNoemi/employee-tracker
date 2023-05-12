USE employee_tracker;

INSERT INTO departments (name)
VALUES ("Engineering"),
       ("Sales"),
       ("Finance"),
       ("Marketing");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 2),
       ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Marketing Lead", 135000, 4),
       ("Salesperson", 95000, 2),
       ("Brand Manager", 145000, 4);

 INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Mike", "Chan", 7, 1),
       ("Kelvin", "Turpit", 2, NULL),
       ("Ashley", "Noemi", 3, 3),
       ("Desmond", "Oben", 8, NULL),
       ("Sarah", "Lourd", 6, 5),
       ("Tom", "Allen", 4, NULL),
       ("Malia", "Gosten", 5, 7);
       
