import { Router } from 'express';
import { getRecoveryLink, resetPassword, validRecoveryAttemptMiddleWare, renderForgottenPassword, postResetPassword } from '../controllers/passwordrecovery.controllers.js';

const router = Router();

//GET
router.get('/reset-password/:requestId', validRecoveryAttemptMiddleWare, resetPassword);
router.get('/password/:userEmail', getRecoveryLink);
router.get('/forgot-password', renderForgottenPassword)

//POST
router.post('/password', postResetPassword);
export default router;