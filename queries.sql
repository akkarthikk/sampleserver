create table users(
    name varchar(50),
    email varchar(50)not null primary key,
    password varchar(255),
    security_question varchar(50),
    security_answer varchar(50),
    role varchar(50));