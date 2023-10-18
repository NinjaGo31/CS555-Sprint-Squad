import nodemailer from 'nodemailer';

const sendEmail = async (option) =>{
    //create a transporter//that will send mail
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    //define email options
    const emailOptions ={
        from:'DigitalScavenger Support<support@digitalscavenger.com',
        to: option.email,
        subject:option.subject,
        text:option.message

    }
    //send email
    await transporter.sendMail(emailOptions);
} 

export{sendEmail};