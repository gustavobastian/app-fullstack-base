//=======[ Settings, Imports & Data ]==========================================

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'mysql-server',
    port     : '3306',
    user     : 'root',
    password : 'userpass',
    database : 'smart_home'
});
let retry=0;
//=======[ Main module code ]==================================================

while(retry==0){
connection.connect(function(err) {
    if (err) {
        console.error('Error while connect to DB: ' + err.stack);
        await new Promise(resolve => setTimeout(resolve, 10000));


        connection.end();        
    }
   else{ 
       console.log('Connected to DB under thread ID: ' + connection.threadId);retry=1;
    }
});
}

module.exports = connection;

//=======[ End of file ]=======================================================
