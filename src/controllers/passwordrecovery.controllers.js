import { PasswordRecoveryManager } from "../services/dao/db/passRecoveryManager.db.js"
import config from "../config/enviroment.config.js";
import { useLogger } from "../config/logger.config.js";
import validator from 'email-validator';
const getRecoveryLink = async (req, res) => {
    const userEmail = req.params.userEmail;
    const isValidEmail = validator.validate(userEmail);
    if (!isValidEmail) {
        res.status(403).send('{"status":"failed", "message": "Invalid email"}')
    } else {

        try {
            const passRecoveryManager = new PasswordRecoveryManager();
            const response = await passRecoveryManager.createRecoveryId(userEmail);
            const responseJson = JSON.parse(response);
            if (responseJson.status === "ok") {
                const bodyData = {
                    "to": responseJson.userEmail,
                    "subject": "Password recovery",
                    "html": "<html><h1>Password recovery</h1><br/><p>Click on the following link to recover your password: " + config.baseUrl + "recovery/reset-password/" + responseJson.createdRecoveryId + "</p></html>"
                }
                const status = await fetch('https://backend-gm-production.up.railway.app:' + config.port + '/mail/send', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyData)
                }).then(result => {
                    res.send('{"status":"ok"}');
                });
            } else {
                const log = useLogger();
                log.error(`${new Date().toLocaleString()}: Error creating recovery link`);
                res.status(400).send('{"status":"failed", "message": "Error when creating recovery link"}');
            }
        } catch (error) {
            const log = useLogger();
            log.error(`${new Date().toLocaleString()}: Error creating recovery link: ${error}`);
            res.status(400).send('{"status":"failed", "message": "Error when creating recovery link"}');
        }
    }
}
const resetPassword = async (req, res) => {
    const requestId = req.params.requestId;
    const passRecoveryManager = new PasswordRecoveryManager();
    const response = await passRecoveryManager.getRecoveryId(requestId);
    res.render('newpasswordform', { userId: response.userId });
}

const validRecoveryAttemptMiddleWare = async (req, res, next) => {
    const requestId = req.params.requestId;
    const passRecoveryManager = new PasswordRecoveryManager();
    try {
        const response = await passRecoveryManager.isRecoveryAttemptValid(requestId);
        const responseParsed = JSON.parse(response);
        if (responseParsed.status === "ok") {
            next();
        } else {
            res.redirect('/recovery/forgot-password');
        }
    } catch (error) {
        res.redirect('/recovery/forgot-password');
    }
}

const renderForgottenPassword = async (req, res) => {
    res.render('passwordrecoveryform');
}

const postResetPassword = async (req, res) => {
    const passRecoveryManager = new PasswordRecoveryManager();
    const response = await passRecoveryManager.updatePassword(req.body.userId, req.body.password);
    const responseParsed = JSON.parse(response);
    if (responseParsed.status === "ok") {
        res.status(200).send('{"status":"ok"}');
    } else if (responseParsed.status === "duplicated") {
        res.status(403).send('{"status":"failed", "message": "' + responseParsed.message + '"}');
    } else {
        res.status(400).send('{"status":"failed", "message": "' + responseParsed.message + '"}');
    }
}

export { getRecoveryLink, resetPassword, validRecoveryAttemptMiddleWare, renderForgottenPassword, postResetPassword }