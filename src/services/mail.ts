const nodemailer = require('nodemailer');
export default async function sendmail (to:string,subject:string,text:string){
    try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'sujancolab@gmail.com',
            pass: 'peqb yels zluh edtl',
          },
        });
        // const transporter = nodemailer.createTransport({
        //     host: 'live.smtp.mailtrap.io',
        //     port: 2525,
        //     auth: {
        //       user: 'api',
        //       pass: '841b15fb9a18deb2478a86d576d397e9',
        //     },
        //   });

         
    
        const mailOptions = {
          from: 'sujancolab@gmail.com',
          to: to,
          subject: subject,
          text: text,
        };
    
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.error('Error:', error);
      }
}