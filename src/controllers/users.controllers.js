import { userManager } from "../services/factory.js"
import { useLogger } from "../config/logger.config.js";
import { UserViewDTO } from "../services/dao/dto/user.dto.js";
import envConfig from "../config/enviroment.config.js";

const usersControllers = async (req, res) => {
    const uid = req.params.uid;
    try {
        const user = await userManager.getUserById(uid);
        res.setHeader('Content-Type', 'application/json');
        if (user.role === 'Admin') {
            res.status(200).send({ status: 'failed', message: 'User is already admin, this operation cannot be done' });
        } else if (user.role === 'Usuario') {
            user.role = 'Premium';
            await userManager.updateUser(user._id, user);
            res.status(200).send({ status: 'ok', message: 'Perfil actualizado. ' + user.first_name + ' ahora tiene el perfil PREMIUM' });
        } else if (user.role === 'Premium') {
            user.role = 'Usuario';
            await userManager.updateUser(user._id, user);
            res.status(200).send({ status: 'ok', message: 'Perfil actualizado. ' + user.first_name + ' ahora tiene el perfil USUARIO' });
        } else {
            res.status(400).send({ status: 'failed', message: 'Unexpected user type' });
        }
    }
    catch (error) {
        const log = useLogger();
        log.error(`${new Date().toLocaleString()}: ${error.message}`);
    }
}

const getUserDocuments = async (req, res) => {
    res.render('uploader', { uid: req.params.uid });
}

const userViewController = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const users = await userManager.getUsers();
    let usersList = [];
    if (!users) {
        res.status(404).send({ status: 'failed', message: 'Users not found' });
    } else {
        for (const user in users) {
            usersList.push(new UserViewDTO(users[user]));
        }
        res.status(200).send(usersList);
    }
}

const deleteTimedOutUsers = async (req, res) => {
    const timeOutDays = 2;
    const timeout = 86400 * timeOutDays;
    const users = await userManager.getUsers();
    const now = new Date();
    const nowInSeconds = now.getTime() / 1000;
    let deletedUsers = 0;
    for (const user in users) {
        const userDate = new Date(users[user].last_connection);
        const userDateInSeconds = userDate.getTime() / 1000;
        const diff = nowInSeconds - userDateInSeconds;
        if (diff >= timeout) {
            await userManager.deleteUser(users[user]._id);
            deletedUsers++;
            const emailBody = {
                to: users[user].email,
                subject: "Cuenta eliminada",                
                html: "<h1>Hola " + users[user].first_name + "</h1><br/><h2>Tu cuenta ha sido eliminada por inactividad</h2><br/><p>Si lo deseas, puedes volver a registrarse en cualquier momento</p>"
            }
            try {
                fetch("https://backend-gm-production.up.railway.app" + envConfig.port + "/mail/send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(emailBody)
                });
            } catch (error) {
                const log = useLogger();
                log.error(`${new Date().toLocaleString()}: Error al enviar el correo: ${error}`);
            }
        }
    }
res.status(200).send('{"status": "ok", "message": "User cleanup executed", "deletedUsers": ' + deletedUsers + '}');
}

const deleteUserController = async (req, res) => {
    const uid = req.params.uid;
    try {
        await userManager.deleteUser(uid);
        res.status(200).send({ status: 'ok', message: 'Usuario eliminado con éxito' });
    }
    catch (error) {
        const log = useLogger();
        log.error(`${new Date().toLocaleString()}: ${error.message}`);
    }

}

export { usersControllers, getUserDocuments, userViewController, deleteTimedOutUsers, deleteUserController }