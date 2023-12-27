import { Router } from 'express';
import { getCartByIdController, postCreateCartController, postAddProductToCartController, putUpdateProductOnCartController, putUpdateProductQuantityController, deleteProductFromCartController, deleteEmptyCartController } from '../controllers/cart.controller.js';
import { canAddProductToCart } from '../controllers/sessions.controller.js';

const router = Router();

//GET
router.get("/:cid", getCartByIdController);

//POST
router.post("/", postCreateCartController);
router.post('/:cid/product/:pid', canAddProductToCart, postAddProductToCartController);

//PUT
router.put('/:cid', putUpdateProductOnCartController);
router.put('/:cid/products/:pid', putUpdateProductQuantityController);


//DELETE
router.delete('/:cid/product/:pid', deleteProductFromCartController);
router.delete('/:cid', deleteEmptyCartController);

export default router;