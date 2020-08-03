const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'liaorio@gmail.com',
    subject: 'Welcome to our taks manager app',
    text: `Welcome ${name}! Let us know how you feel today!`
  })
};

module.exports = {
  sendWelcomEmail
};