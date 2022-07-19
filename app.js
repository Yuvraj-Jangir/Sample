const mysql = require('mysql');
const session = require('express-session');
const express = require('express');
const path = require('path');
const hostname = "localhost";
const port = 80;

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'yuvraj',
	database: 'contactformdata'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static('public'));

app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/home', function (request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/index.html'));
});
// app.get('/localhost/reg', function (request, response) {
// 	// Render login template
// 	response.sendFile(path.join(__dirname + './static/index.html'));
// });

app.post('/reg', function (request, response) {
	// Capture the input fields
	let name = request.body.name;
	let email = request.body.email;
	let message = request.body.message;

	connection.connect(function (err) {
		if (err) throw err;
		console.log("Connected!");
		var sql = "INSERT INTO data (name, email, message) VALUES (?, ?, ?)";
		connection.query(sql, [name, email, message], function (error, results) {
			// If there is an issue with the query, output the error
            
            // Authenticate the user
			request.session.registerd = true;
			request.session.username = name;
			request.session.message = message;

			// Redirect to home page
			response.redirect('/home');
            // response.redirect(path.join(__dirname + '/index.html'));
            
			response.end();
			console.log(name);
			console.log(message);
		});
	});
});


//Start the server----------------------------------------------------
app.listen(port, () => {
	// console.log(`The application started successfully on port ${port}`);
	console.log(`The application started successfully on port http://${hostname}:${port}`);
});