import nodemailer from 'nodemailer';
import { mailSettings } from '../config/nodemailer.config.js';
import { useLogger } from "../config/logger.config.js";

const transport = nodemailer.createTransport(mailSettings);
const postSendEmail = async (req, res) => {
    try {
        let result = await transport.sendMail({
            from: 'Project BackEnd <' + mailSettings.auth.user + '>',
            to: req.body.to,
            subject: req.body.subject,
            html: req.body.html,
            attachments: []
        });
        res.send(result);
    } catch (error) {
        const log = useLogger();
        log.error(`${new Date().toLocaleString()}: Error sending email: ${error}`);
    }
}

export { postSendEmail }