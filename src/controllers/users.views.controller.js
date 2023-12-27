import { userManager } from "../services/factory.js";
import { UserViewDTO } from "../services/dao/dto/user.dto.js";

const getLoginController = (req, res) => {
    if (req.session.user) {
        res.redirect('/products');
    } else {
        res.render('login');
    }
}

const getRegisterController = (req, res) => {
    res.render('register');
}

const getProfileController = (req, res) => {
    res.render('profile', { user: req.session.user });
}

const viewUsersController = async (req, res) => {
    const users = await userManager.getUsers();
    let usersList = [];
    if (!users) {
        res.status(404).send({ status: 'failed', message: 'Users not found' });
    } else {
        for (const user in users) {
            usersList.push(new UserViewDTO(users[user]));
        }
        res.render('viewusers', { users: usersList });
    }
}

export { getLoginController, getRegisterController, getProfileController, viewUsersController }