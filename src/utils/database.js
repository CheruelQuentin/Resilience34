const db = mysql.createConnection({ 
  host :'localhost',
  user : 'root',
  password : '',
  database : 'resilience34'
  
})

// connect
db.connect((err, db) => {
  if(err) {
    throw err;
  }
  console.log('My sql connected successfull')
})

const addUser = (username, email) => {
  let user = {user_id : 1,  user_name : username, user_email : email}
        let sql = "INSERT INTO user SET ?";
        let query = db.query(sql, user, (err, result) => {
          if(err) throw err;
          console.log(result);
        });
}



module.exports = {

}