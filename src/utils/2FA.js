const nodemailer = require('nodemailer');

const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user : "resilience3456@gmail.com",
    pass : "secretPassword"
  }
};

const transporter = nodemailer.createTransport(smtpConfig);
const validateConnecting = (MAIL) => {

  const options = {
    from: "resilience3456@gmail.com",
    to: MAIL,
    subject: "Mspr connecting",
    text: "yo ",
    html : "Veuillez cliquer sur le lien de confirmation : <br><a href='http://localhost:3000/connexion'>Lien de connexion</a>."
  };

  transporter.sendMail(options, function (err,info){
    if(err){
      console.log(err);
      return
    }
    console.log("Sent: " + info.response);
  })
}


module.exports = validateConnecting