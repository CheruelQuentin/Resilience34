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
const authenticateDN = require('./utils/ldapConnect.js')
const ipIssue = require('./utils/nodemailer.js')
const validateConnecting  = require('./utils/2FA.js')
const res = require('express/lib/response')
const messagebird = require('messagebird')('Hyn3Cut3NcJK0UXnB2K6EYZG0');

// Setup handlebars engine and views location 
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: true }))

const db = mysql.createConnection({ 
  host :'localhost',
  user : 'root',
  password : '',
  database : 'resilience34'
  
})




function authenticateDN(username, password){
  var client = ldap.createClient({
    url: 'ldap://192.168.1.18:5389'
  })
  client.bind(username,password,function(err){
    if(err){
      console.log("Error in new connection "+ err.code +err);
    } else {
      console.log("success")
	//  addUser();
		var authenticateldap = true
		connexion(authenticateldap)
    }
  })
}


function connexion(authenticateldap) {
  if(authenticateldap == true) {
    var params = {
      originator: '',
      type: 'sms'
    }
    messagebird.verify.create('+33651266267', params, function (error, response) {
                    if (error) {
                      //request has failed
                      console.log(error);
                      res.render('index');
                    } else {
                    // Request was successfull
                      console.log(response);

                      let sql = `SELECT tracker_ip FROM user, tracker WHERE user_id = tracker_user and user_name = '${username}'`;
                      let query = db.query(sql, (err, result) => {
                        if(err) throw err;
                        console.log(result);

                      if(result == req.connection.remoteAddress) {
                        
                        detect = require('./utils/browserDetect.js')
                        validateConnecting("resilience34@outlook.fr")
                        res.render('waitingPage', { id : response.id })

                        console.log('ip '+ req.connection.remoteAddress)
                        console.log('port '+ req.connection.remotePort)
                        console.log('user is connect')  

                      } else {
                        validateConnecting("resilience34@outlook.fr")
                        ipIssue("resilience34@outlook.fr")
                        res.render('waitingPage', { id : response.id })
                      }
                    })

                  }
            })         
  } else {
    res.render('index')
  }
}



app.get('/', function (req, res) {
  res.render('index');
});


app.post('/waitingPage',function (req, res) {
  const username = req.body.username
  const password = req.body.password
  if (password == undefined || username == undefined) { 
    return res.send({ 
      error : "you must enter a username"
    })
  } else {
    if(connectUser(username, password) == false) { 
      res.render('error')
    } else {
      authenticateDN("uid="+username+",ou=ourldap","")
    }   
  }
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

app.listen(port,()=>{
  console.log('Server listening on port' + port)
})