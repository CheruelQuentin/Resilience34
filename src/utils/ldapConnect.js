var ldap = require('ldapjs')

const authenticateDN = (username, password) => {
  var client = ldap.createClient({
    url: 'ldap://169.254.220.155:5839',
  })
  client.bind(username,password,function(err){
    if(err){
      console.log("Error in new connection " +err + err.code);
    } else {
      console.log("success")
      return true
    }
  })
}


//authenticateDN("uid=quentin,ou=ourldap","")
module.exports = authenticateDN