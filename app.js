var mysql  = require('mysql');
var fs = require('fs');
var exec = require('child_process').exec;

var connection = mysql.createConnection(require('./conn'));

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

var dateTime;

getCurrentTime();

var sql = "SELECT * FROM actionlog WHERE ACTION = 113010900 AND created > ?"
var inserts = [dateTime];

function getActionLog() {
	connection.query("SELECT * FROM actionlog WHERE ACTION = 113010900 AND created > ?", [dateTime], function (err, results) {
		if(err)
			return console.error('error connecting: ' + err.stack);

		if (results.length > 0) {
			fs.writeFileSync('/sys/class/gpio/gpio14/value', '1');
			setTimeout(gongDone, 5000);
			fs.writeFileSync('/sys/class/gpio/gpio18/value', '1');
			exec('mpg123 -k 1000 -n 2200 "Kool & The Gang - Celebration.mp3"');
			setTimeout(lightsDone, 30000);
			dateTime = results[0].Created;
			console.log(dateTime);
		}
		else
			setTimeout(getActionLog, 1000);
	});
}

function lightsDone(){
	console.log('** Doing something **');
	fs.writeFileSync('/sys/class/gpio/gpio18/value', '0');
	setTimeout(getActionLog, 1000);
}

function gongDone(){
	fs.writeFileSync('/sys/class/gpio/gpio14/value', '0');
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
