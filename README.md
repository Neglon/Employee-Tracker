
































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