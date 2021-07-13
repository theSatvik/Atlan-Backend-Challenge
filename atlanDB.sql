CREATE DATABASE atlan;

CREATE TABLE clientincomedata(
    client_id SERIAL PRIMARY KEY,
    client_email VARCHAR(255),
    client_name VARCHAR(255), 
    incomePerAnnum FLOAT,
    savingsPerAnnum FLOAT
);