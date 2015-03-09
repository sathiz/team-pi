var mysql  = require('mysql');

var connection = mysql.createConnection({
    host     : '',
	database : '',
    user     : '',
    password : ''
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

var dateTime;
var winner;

getCurrentTime();

var sql = "SELECT * FROM actionlog WHERE ACTION = 113010900 AND created > ?"
var inserts = [dateTime];

function getActionLog() {
	connection.query("SELECT * FROM actionlog WHERE ACTION = 113010900 AND created > ?", [dateTime], function (err, results) {
		if(err)
			return console.error('error connecting: ' + err.stack);

		if (results.length > 0) {
			winner = results;
			setTimeout(doSomething, 30000);
			dateTime = results[0].Created;
			console.log(dateTime);
		}
		else
			setTimeout(getActionLog, 1000);
	});
}

function doSomething(){
	console.log('** Doing something **');
	console.log(winner);
	setTimeout(getActionLog, 1000);
}

function getCurrentTime() {
	connection.query('SELECT UTC_TIMESTAMP() currentTime', function (err, result) {
		if(err)
			return console.error('error connecting: ' + err.stack);

		if(result) {
			dateTime = result[0].currentTime;
			//dateTime = '2015-03-09 17:00:00';
			console.log(dateTime);
			setTimeout(getActionLog, 1000);
		}
	});
}

//connection.end();
