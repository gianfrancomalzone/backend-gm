import { ticketManager } from '../services/factory.js';
import { useLogger } from '../config/logger.config.js';
import config from '../config/enviroment.config.js';
const ticketController = async (req, res) => {
    const tid = req.params.tid;
    const ticketData = await ticketManager.loadTicket(tid);
    if (!ticketData.mail_enviado) {
        const asunto = "Muchas gracias por tu Compra!";
        let cuerpo = "<html><body><h1>Gracias por tu compra!</h1>";
        if (ticketData.products.length > 0) {
            cuerpo += "<p>Estos son los productos que compraste:</p><ul>";
            ticketData.products.forEach(product => {
                cuerpo += "<li>" + product.product.title + " - " + product.quantity + " unidades</li>";
            });
        }
        if (ticketData.notAvailableProducts.length > 0) {
            cuerpo += "</ul><p>Estos son los productos que no pudimos enviarte:</p><ul>";
            ticketData.notAvailableProducts.forEach(product => {
                cuerpo += "<li>" + product.notAvailableProduct.title + " - " + product.quantity + " unidades</li>";
            });
        }
        cuerpo += "</ul><p>El total de tu compra es: $" + ticketData.amount + "</p></body></html>";
        try {
            fetch('https://backend-gm-production.up.railway.app' + config.port + '/mail/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: ticketData.purchaser,
                    subject: asunto,
                    html: cuerpo
                })
            })
            ticketManager.markAsMailSent(tid);
        }
        catch (error) {
            const log = useLogger();
            log.error(`${new Date().toLocaleString()}: Error al enviar el mail: ${error}`);
        }
    }
    res.render('ticket', { ticket: ticketData });
}

export { ticketController }