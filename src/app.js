const path= require('path')
const express = require("express")
const hbs = require('hbs')
const app = express()
var bodyParser = require("body-parser")


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(path.join(__dirname, '../public'))
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

const connectUser = require('./utils/connectUser.js')
const authenticateDN = require('./utils/ldapConnect.js')
const ipIssue = require('./utils/nodemailer.js')
const validateConnecting  = require('./utils/2FA.js')

// Setup handlebars engine and views location 
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/waitingPage',function (req, res) {
  const username = req.body.username
  const password = req.body.password

  if (password == undefined || username == undefined) { 
    
    return res.send({ 
      error : "you must a username"
    })

  } else {

    if(connectUser(username, password) == false) { 
      return res.send({ 
        error : "username or password errors"
      })

    } else {

      res.render('waitingPage')
      detect = require('./utils/browserDetect.js')
      
      console.log('ip '+ req.connection.remoteAddress)
      console.log('port '+ req.connection.remotePort)
      console.log('user is connect')
      ipIssue("resilience34@outlook.fr")
      validateConnecting("resilience34@outlook.fr")
     // authenticateDN("uid=quentin,ou=ourldap","")
     
    }   
  }
})

app.get('/connexion', function(req, res){
  res.render('connexion')
})

app.listen(port,()=>{
  console.log('Server listening on port' + port)
})