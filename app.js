var express = require('express');
var app = express();
var ldap = require('ldapjs')


app.listen(3000, function(){
  console.log("server started on port 3000");
})

function authenticateDN(username, password){
  var client = ldap.createClient({
    url: 'ldap://127.0.01:10389'
  })

  client.bind(username,password,function(err){
    if(err){
      console.log("Error in new connection " +err);
    } else {
      console.log("success")
    }
  })
}


authenticateDN("uid=quentin,ou=system","N3wusers")