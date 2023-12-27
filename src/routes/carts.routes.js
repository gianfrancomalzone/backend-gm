import { Router } from 'express';
import { getCartByIdController, getPurchaseCart } from '../controllers/carts.controller.js';
import { isUserMiddleware } from '../controllers/sessions.controller.js';
import { ticketManager } from '../services/factory.js';
const router = Router();

//GET
router.get('/:cid', isUserMiddleware, getCartByIdController);
router.get('/:cid/purchase', getPurchaseCart);

router.get("/:cid/ver", async (req, res) => {
    const ticketId = req.params.cid;
    const ticket = await ticketManager.loadTicket(ticketId);
    res.send(ticket);
});


export default router;