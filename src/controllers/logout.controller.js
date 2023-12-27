import { userManager } from "../services/factory.js"

const getLogoutController = async (req, res) => {
    if (req.session.user) {
        await userManager.setConnectionTime(req.session.user.id);
    }
    req.session.destroy();
    res.redirect('/users/login');
}

export { getLogoutController }