const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require ('mysql');

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'wjstks*001',
    port:3306,
    database:'test'
});

const app = express();

app.use(session({
    HttpOnly: true,
    secure: false,
    secret: 'sseeccrreett'
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is working : Port - ', port);
});

app.use(express.static('css'));
app.use(express.static('js'));


app.get('/', function (req,res) {
	if (req.session.uid === undefined)
    	res.render('login.html');
	else
		res.redirect('/register');
});

app.get('/login', function (req,res) {
	if (req.session.uid !== undefined)
		res.redirect('/register');
	else
		res.render('login.html');
});

app.get('/fail', function (req,res) {
    res.render('retry.html');
})

app.post('/loginProcess', function (req,res) {
    console.log(req.body)
    conn.query('SELECT * FROM users WHERE id = ? AND password = ?', [req.body.username, req.body.password] , (err,result) => {
		console.log('user logined:' + result)
        req.session.uid = result[0].id
        res.redirect('/register')
    });

});

app.post('/registerProcess', function (req, res) {
	console.log('register on :' + req.session.uid);
	console.log(req.body);
	conn.query('INSERT INTO register VALUES(?, ?, ?);', [req.session.uid, req.body.y1, new Date()])
	conn.query('INSERT INTO register VALUES(?, ?, ?);', [req.session.uid, req.body.y2, new Date()])
	conn.query('INSERT INTO register VALUES(?, ?, ?);', [req.session.uid, req.body.j1, new Date()])
	conn.query('INSERT INTO register VALUES(?, ?, ?);', [req.session.uid, req.body.j2, new Date()])
});

app.get('/register', function (req,res){
    if (req.session.uid === undefined) res.redirect('/login')
	else
		res.render('register.html');
	
	
})


app.get('/management', function (req,res) {
    res.render('retry.html');
})
