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
   		res.redirect('/login');	
	else
		res.redirect('/register');
});

app.get('/login', function (req,res) {
	if (req.session.uid !== undefined)
		res.redirect('/register');
	else {
		let _alert = false;
		if (req.session.alert === true) {
			req.session.alert = null;
			_alert = true;
		}
		res.render('login.ejs',{_alert : _alert});
	}
});

app.get('/fail', function (req,res) {
    res.render('retry.html');
})

app.post('/loginProcess', function (req,res) {
    console.log(req.body)
    conn.query('SELECT * FROM users WHERE id = ? AND password = ?', [req.body.username, req.body.password] , (err,result) => {
		if (result.length === 0) {
			req.session.alert = true;
			res.redirect('/login');
			
			return;
		}
		console.log('user logined:' + result)
        req.session.uid = result[0].id
        res.redirect('/register')
    });

});

function alertDirect(res, url, text) {
	res.send('<script>alert("'+ text +'"); location.href="'+url+'"</script>');
}

app.post('/registerProcess', function (req, res) {
	console.log('register on :' + req.session.uid);
	conn.query('SELECT sid, COUNT(*) as cnt FROM register GROUP BY sid ORDER BY sid', [req.body.j2], (e,result) =>{ 
		console.log(result);
		let arr = []
		for (let i = 0; i < 20; i++) {
			arr[i] = 0;
		}
		for (let i = 0; i < result.length; i++) {
			arr[result[i].sid] = result[i].cnt;
		}

		if (arr[req.body.y1] >= 21 || arr[req.body.y2] >= 21 || arr[req.body.j1] >= 21 || arr[req.body.j2] >= 21) {alertDirect(res, '/login','이미 가득 찬 강의입니다!'); return;}

		conn.query('INSERT INTO register VALUES(?, ?, ?);', [req.session.uid, req.body.y1, new Date()])
		conn.query('INSERT INTO register VALUES(?, ?, ?);', [req.session.uid, req.body.y2, new Date()])
		conn.query('INSERT INTO register VALUES(?, ?, ?);', [req.session.uid, req.body.j1, new Date()])
		conn.query('INSERT INTO register VALUES(?, ?, ?);', [req.session.uid, req.body.j2, new Date()])
		res.redirect('/register')
	});
});

app.get('/register', function (req,res){
    if (req.session.uid === undefined) {
		res.redirect('/login')
		return;
	} else {
		let data
		conn.query("SELECT COUNT(*) as cnt FROM register WHERE sid = ?", [req.session.uid], (e, r) =>{
			if (r[0].cnt > 1) alertDirect(res, '/alert','강의신청이 이미 완료되었습니다!');
			conn.query("SELECT * FROM register", (err,result) => {
				data = result
			
				let subs = [];
				for (let i = 0; i < 20; i++) subs[i] = 0;

				for (let i = 0; i < data.length; i++) {
					subs[data[i].sid]++;
				}

				console.log(subs)
				res.render('register.ejs', {'data' : data, 'subs' : subs});
			})
		});
	}
})
	

app.get('/manage', function (req,res) {
	if(req.session.uid !== 'master') { res.redirect('/'); return; }
	conn.query("SELECT * FROM users", (er,users)=>{
		conn.query("SELECT * FROM register", (e,registers)=>{
			console.log(users,registers);
    		res.render('management.ejs', {users: users, registers: registers});
		})
	})
})

app.get('/alert', function (req,res) {
	res.render('alert.ejs');

})
