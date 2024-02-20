
































include user needs to make a connection.js file with this and their info
```
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'employee_tracker'
});

connection.connect(err => {
  if (err) throw err;
});

module.exports = connection;
```

console.table
https://www.syncfusion.com/blogs/post/11-console-methods-in-javascript-for-effective-debugging.aspx

concat 2 colums to a new one mySQL
https://stackoverflow.com/questions/3251600/how-do-i-get-first-name-and-last-name-as-whole-name-in-a-mysql-query

combine multiple columns from multiple tables
https://stackoverflow.com/questions/8303275/select-multiple-columns-from-multiple-tables

from "the table name ex. tableName" "a one or 2 character prefix for dot notation ex. t "
    FROM tableName t
https://stackoverflow.com/questions/8303275/select-multiple-columns-from-multiple-tables

object array for choices inquirer
https://stackoverflow.com/questions/46210279/pass-objects-in-array-into-inquirer-list-choices