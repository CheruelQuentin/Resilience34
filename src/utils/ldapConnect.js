var ldap = require('ldapjs')

const authenticateDN = (username, password) => {
  
  const client = ldap.createClient({
    url: 'ldap://192.168.1.18:5839',
  })
  client.bind(username,password,function(err){
    if(err){
      console.log("Error in new connection " +err + err.code);
      return false
    } else {
      console.log("success")
      return true
    }
  })
}


//authenticateDN("uid=quentin,ou=ourldap","")
module.exports = authenticateDN