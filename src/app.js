const path= require('path')
const express = require("express")
const hbs = require('hbs')
const app = express()
var bodyParser = require("body-parser")
const mysql = require("mysql")
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(path.join(__dirname, '../public'))
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
const connectUser = require('./utils/connectUser.js')
const ipIssue = require('./utils/nodemailer.js')
const browserIssue = require('./utils/BrowserError.js')
const res = require('express/lib/response')
const messagebird = require('messagebird')('O6AY9zf14UWwgl0YKcJ1rEyzY');
var ldap = require('ldapjs')
var useragent = require('express-useragent');
var geoip = require('geoip-lite');

// Setup handlebars engine and views location 
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(useragent.express());

const https = require('https');
const fs = require('fs');


const options = {
  key: fs.readFileSync(process.cwd() + '/utils/ssl/key.pem'),
  cert: fs.readFileSync(process.cwd() + '/utils/ssl/cert.pem')
};


const db = mysql.createConnection({ 
  host :'localhost',
  user : 'root',
  password : 'password',
  database : 'resilience34'
})


function addTracker(userId ,username, ip , browser, port  ) {
  let tracker = {userId : userId, loginBrowser : browser, loginIpAddress : ip, loginConnectionPort : port}
        let sql = "INSERT INTO LoginInfo SET ?";
        let query = db.query(sql, tracker, (err, result) => {
          if(err) throw err;
          console.log(result);
        });
}

function userId(username) {
  let sql = `SELECT id FROM UserProfile where name = '${username}'`;
  let query = db.query(sql,(err, result) => {
    if(err) throw err;
    console.log(result);
	return result;
  });
  
}

function recoveryIp(username) {
        let sql = `SELECT ipAddress FROM UserProfile where name = '${username}'`;
        let query = db.query(sql,(err, result) => {
          if(err) throw err;
          console.log(result);
		  return result;
		});
        
}

function recoveryBrowser(username) {
        let sql = `SELECT defaultBrowser FROM UserProfile where name = '${username}'`;
        let query = db.query(sql,(err, result) => {
          if(err) throw err;
          console.log(result);
          return result;
		});
        
		
}

function connexion(username,res,request) {
    var params = {
      originator: '',
      type: 'sms'
    }
    messagebird.verify.create('+33786366373', params, function (error, response) {
      if (error) {      
        console.log(error);
        res.render('index');
       } else {
        console.log(response);
          ip = request.connection.remoteAddress
          var userIdInfo = userId(username);
          addTracker(userIdInfo,username,ip,"chrome",request.connection.remotePort);

           var geo = geoip.lookup(ip);
           //if(geo.country == "FR"){
              if(recoveryIp(username) == ip) {
                if(recoveryBrowser(username) == "chrome" ) {
                   res.render('waitingPage', { id : response.id })
                } else {
                  console.log("different browser")
                }
              } else {
                ipIssue("resilience34@outlook.fr")
                res.render('waitingPage', { id : response.id })
              }
          // } else {
           //  res.render('error')
           //}
      }
   });
}

function authenticateDN(username, password,res,req) {
  var client = ldap.createClient({
    url: 'ldap://192.168.1.18:5389'
  })
  client.bind(username,password,function(err){
    if(err){
      console.log("Error in new connection "+ err.code +err);
      res.render('error')
    } else {
      console.log("success")
      connexion(username,res, req)
    }
  })
}





app.get('/', function (req, res) {
  res.render('index');
});

app.post('/waitingPage',function (req, res) {
  const username = req.body.username
  const password = req.body.password
  if (password == undefined || username == undefined) { 
    return res.send({  error : "you must enter a username"  })
  } else {
    if(connectUser(username, password) == false) { 
      res.render('error')
    } else {
	   var userAgentBrowser = req.useragent.browser
		if(userAgentBrowser != recoveryBrowser(username)){
		  browserIssue("resilience34@outlook.fr")
		} 
		authenticateDN("uid="+username+",ou=ourldap","",res,req)
})

app.post('/connexion', function(req, res){
  var id = req.body.id;
  var token = req.body.token;
  messagebird.verify.verify(id, token, function(err, response){
    if (err) {
      res.render('waitingPage');
    } else {
      res.render('connexion')
    }
  })  
})


https.createServer(options,app).listen(port,()=>{
  console.log('Server listening on port' + port)
})