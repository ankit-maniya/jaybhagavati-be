import helper from "./helper"
import { config } from '../../config'
import nodemailer from 'nodemailer'

let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD
    }
})

const forgotPasswordByMail = async (userEmailId, Otp) => {
    return new Promise(async (resolve, reject) => {
        if (Otp) {
            const message = {
                from: 'priyankmaniyatest@gmail.com',
                to: userEmailId,
                subject: 'For Forgot Password',
                html: `<h1>Have a Greate Day</h1> <p> Here is Your OTP ${Otp} !</p>`,
                attachments: [
                    { // Use a URL as an attachment
                    filename: 'forgotPassword.png',
                    path: 'https://image.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg'
                    }
                ]
            }
        
            transport.sendMail(message, function(err, info) {
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        }  
    })   
}

export default forgotPasswordByMail