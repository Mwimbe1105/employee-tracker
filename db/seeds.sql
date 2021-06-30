INSERT INTO departments (name)
    VALUES
        ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO roles (title, salary, department_id)
    VALUES
        ('Sales Lead', 120000, 1),
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 140000, 2),
        ('Software Engineer', 120000, 2),
        ('Accountant', 130000, 3),
        ('Legal Team Lead', 225000, 4),
        ('Lawyer', 200000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES
        ('LeeRoy', 'Jenkins', 1, NULL),
        ('Dr Lupo', 'Twitch', 2, 1),
        ('Luka', 'TheDON', 2, 1),
        ('Charles', 'Barkley', 3, NULL),
        ('Scarlet', 'Johansen', 4, 4),
        ('Dora', 'TheExplorer', 4, 4),
        ('Mike', 'Bibby', 4, 4),
        ('Mark', 'Wallburgh', 5, NULL),
        ('Oscar', 'Delahoya', 6, NULL),
        ('Dwayne', 'Johnson', 7, 9);