-- PostgreSQL version of Oracle's classic SCOTT sample schema.
-- Run this script in a database where you can create the scott schema.
-- PostgreSQL folds these unquoted table and column names to lowercase.

CREATE SCHEMA IF NOT EXISTS scott;
SET search_path TO scott;

DROP TABLE IF EXISTS emp, dept, bonus, salgrade CASCADE;

CREATE TABLE dept (
  deptno SMALLINT PRIMARY KEY,
  dname VARCHAR(14),
  loc VARCHAR(13)
);

CREATE TABLE emp (
  empno SMALLINT PRIMARY KEY,
  ename VARCHAR(10),
  job VARCHAR(9),
  mgr SMALLINT,
  hiredate DATE,
  sal NUMERIC(7, 2),
  comm NUMERIC(7, 2),
  deptno SMALLINT REFERENCES dept (deptno)
);

CREATE TABLE bonus (
  ename VARCHAR(10),
  job VARCHAR(9),
  sal NUMERIC,
  comm NUMERIC
);

CREATE TABLE salgrade (
  grade SMALLINT,
  losal NUMERIC,
  hisal NUMERIC
);

INSERT INTO dept (deptno, dname, loc) VALUES
  (10, 'ACCOUNTING', 'NEW YORK'),
  (20, 'RESEARCH', 'DALLAS'),
  (30, 'SALES', 'CHICAGO'),
  (40, 'OPERATIONS', 'BOSTON');

INSERT INTO emp (empno, ename, job, mgr, hiredate, sal, comm, deptno) VALUES
  (7369, 'SMITH', 'CLERK', 7902, DATE '1980-12-17', 800, NULL, 20),
  (7499, 'ALLEN', 'SALESMAN', 7698, DATE '1981-02-20', 1600, 300, 30),
  (7521, 'WARD', 'SALESMAN', 7698, DATE '1981-02-22', 1250, 500, 30),
  (7566, 'JONES', 'MANAGER', 7839, DATE '1981-04-02', 2975, NULL, 20),
  (7654, 'MARTIN', 'SALESMAN', 7698, DATE '1981-09-28', 1250, 1400, 30),
  (7698, 'BLAKE', 'MANAGER', 7839, DATE '1981-05-01', 2850, NULL, 30),
  (7782, 'CLARK', 'MANAGER', 7839, DATE '1981-06-09', 2450, NULL, 10),
  (7788, 'SCOTT', 'ANALYST', 7566, DATE '1987-04-19', 3000, NULL, 20),
  (7839, 'KING', 'PRESIDENT', NULL, DATE '1981-11-17', 5000, NULL, 10),
  (7844, 'TURNER', 'SALESMAN', 7698, DATE '1981-09-08', 1500, 0, 30),
  (7876, 'ADAMS', 'CLERK', 7788, DATE '1987-05-23', 1100, NULL, 20),
  (7900, 'JAMES', 'CLERK', 7698, DATE '1981-12-03', 950, NULL, 30),
  (7902, 'FORD', 'ANALYST', 7566, DATE '1981-12-03', 3000, NULL, 20),
  (7934, 'MILLER', 'CLERK', 7782, DATE '1982-01-23', 1300, NULL, 10);

INSERT INTO salgrade (grade, losal, hisal) VALUES
  (1, 700, 1200),
  (2, 1201, 1400),
  (3, 1401, 2000),
  (4, 2001, 3000),
  (5, 3001, 9999);

COMMIT;
