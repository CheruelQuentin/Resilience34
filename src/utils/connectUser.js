const connectUser = (username, password) => {
  username = username.trim().toLowerCase()
  password = password.trim().toLowerCase()
  
  if(password != "toto"){
    return false
  } else {
    return true
  }
}


module.exports =  connectUser 
