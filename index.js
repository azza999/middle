const express = require('express');
const session = require('express-session');
const mysql = require ('mysql');

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'wjstks*001',
    port:3306,
    database:'test'
});

const app = express();
app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use(session({
    HttpOnly: true,
    secure: false,
    secret: 'sseeccrreett'
}));

var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is working : Port - ', port);
});

app.use(express.static('css'));
app.use(express.static('js'));


app.get('/', function (req,res) {
    res.render('login.html');
});

app.get('/login', function (req,res) {
    res.render('login.html');
});

app.get('/fail', function (req,res) {
    res.render('retry.html');
})

app.post('/loginProcess', function (req,res) {
    conn.query('SELECT * FROM users WHERE id = ? AND password = ?', (err,result) => {
        req.session.uid = result[0].uid
    });
    res.send('result[0].uid');

});

app.get('/management', function (req,res) {
    res.render('retry.html');
})