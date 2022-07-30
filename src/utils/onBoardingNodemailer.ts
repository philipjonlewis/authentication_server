import nodemailer from "nodemailer";

//Add some conditional regarding which type of role the user has
const onboardingNodemailer = async (user: any) => {
  const transporter = nodemailer.createTransport({
    service: "smtp.mailtrap.io",
    secure: false, // use SSL
    port: 2525, // port for secure SMTP
    auth: {
      user: process.env.RESET_EMAIL,
      pass: process.env.RESET_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.RESET_EMAIL,
    to: user.email,
    subject: "Welcome to taptaptask!",
    text: `Thank you for choosing taptaptask for your task management needs`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    //maybe this should be error logged as well
    if (error) {
      console.log(error);
    } else {
      // log this to the reset email db thing
      console.log("Email sent: " + info.response);
    }
  });
};

export { onboardingNodemailer };
