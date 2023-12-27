const getRealTimeProductsController = async (req, res) => {
        res.render('realTimeProducts', { user: req.session.user });
}

export { getRealTimeProductsController }