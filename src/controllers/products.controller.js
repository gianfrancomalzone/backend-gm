import { productManager, userManager } from "../services/factory.js";
import envConfig from "../config/enviroment.config.js";
const getProductsPipelineController = async (req, res) => {
    const { limit, page, query, sort } = req.query;
    res.set('Content-Type', 'application/json');
    const productos = await productManager.getProductsPipeline(parseInt(limit), parseInt(page), query, sort);
    res.status(200);
    res.send(productos);
}

const getProductByIdController = async (req, res) => {
    const productId = req.params.pid;
    const productoBuscado = await productManager.getProductById(productId);
    res.set('Content-Type', 'application/json');
    if (productoBuscado !== false) {
        res.status(200);
        res.send(productoBuscado);
    } else {
        res.status(404);
        res.send('{"status": "failed", "message": "Product not found"}');
    }
}

const postAddProductController = async (req, res) => {
    res.set('Content-Type', 'application/json');
    try {
        const nuevoProducto = JSON.parse(await productManager.addProduct(req.body));
        if (nuevoProducto.status === "ok") {
            res.status(200).send(`{"status": "ok", "_id": "${nuevoProducto._id}"}`);
        } else {
            res.status(403).send(`{"status": "failed", "message": "${nuevoProducto.message}" }`);
        }
    } catch (error) {
        console.error(error);
        res.status(403).send(`{"status": "failed", "message": "${error.message}" }`);
    }
}

const putUpdateProductController = async (req, res) => {
    const productId = req.params.pid;
    res.set('Content-Type', 'application/json');
    const actualizarProducto = JSON.parse(await productManager.updateProduct(productId, req.body));
    if (actualizarProducto.status === "ok") {
        res.status(201);
        res.send(`{"status": "ok", "payload": "${actualizarProducto.payload}"}`);
    } else {
        res.status(400);
        res.send(`{"status": "failed", "message": "${actualizarProducto.message}" }`);
    }

}

const deleteProductController = async (req, res) => {
    const productId = req.params.pid;
    res.set('Content-Type', 'application/json');
    const productData = await productManager.getProductById(productId);
    const eliminarProducto = JSON.parse(await productManager.deleteProduct(productId));
    if (eliminarProducto.status === "ok") {
        if (productData.owner !== null) {
            const userData = await userManager.getUserById(productData.owner);
            if (userData !== null && userData.email) {
                const emailBody = {
                    to: userData.email,
                    subject: "Producto eliminado",
                    html: "<h1>Hola " + userData.first_name + "</h1><br/><h2>A Product for which you were the Owner has been deleted: " + productData.title + "</h2>"
                }
                try {
                    fetch("http://localhost:" + envConfig.port + "/mail/send", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(emailBody)
                    });
                } catch (error) {
                    const log = useLogger();
                    log.error(`${new Date().toLocaleString()}: Error sending email: ${error}`);
                }
            }
        }
        res.status(200).send(`{"status": "ok"}`);
    } else {
        res.status(400).send(`{"status": "failed", "message": "${eliminarProducto.message}" }`);
    }
}

const deleteMiddleWare = async (req, res, next) => {
    if (!req.session.user) {
        res.status(401).send({ status: 'failed', message: 'Cannot delete. You are not logged in' });
    } else {
        if (req.session.user.role === 'Admin') {
            next();
        } else if (req.session.user.role === 'Premium') {
            const pid = req.params.pid;
            const producto = await productManager.getProductById(pid);
            if (producto.owner === req.session.user.id) {
                next();
            } else {
                res.status(401).send({ status: 'failed', message: "Cannot delete. You're not owner of this product..." });
            }
        } else {
            res.status(401).send({ status: 'failed', message: 'Cannot delete. No permission allowed...' });
        }
    }
}


export { getProductsPipelineController, getProductByIdController, postAddProductController, putUpdateProductController, deleteProductController, deleteMiddleWare }
