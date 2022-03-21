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
const ipIssue = (MAIL) => {

  const options = {
    from: "resilience3456@gmail.com",
    to: MAIL,
    subject: "Mspr issues",
    text: "your ip connection is different"
  };

  transporter.sendMail(options, function (err,info){
    if(err){
      console.log(err);
      return
    }
    console.log("Sent: " + info.response);
  })
}


module.exports = ipIssue 