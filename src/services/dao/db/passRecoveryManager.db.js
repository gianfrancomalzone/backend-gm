import { passwordRecoveryModel } from "./models/passwordrecovery.model.js";
import userModel from "./models/user.model.js";
import { useLogger } from "../../../config/logger.config.js";
import { createHash, isValidPassword } from '../../../utils.js';

export class PasswordRecoveryManager {
    createRecoveryId = async (userEmail) => {
        try {
            const user = await userModel.findOne({ email: userEmail });
            if (user) {
            const insert = await passwordRecoveryModel.create({ userId: user._id });
                return '{"status": "ok", "message": "Recovery link created successfully", "createdRecoveryId": "' + insert._id + '", "userEmail":"' + user.email + '"}';
            } else {
                return '{"status": "failed", "message": "User not found"}';
            }
        } catch (error) {
            const log = useLogger();
            log.error(`${new Date().toLocaleString()}: Error al crear el link de recuperación: ${error}`);
            return '{"status": "failed", "message": "Error when creating recovery link: ' + error + '"}';
        }
    }

    updatePassword = async (id, newPassword) => {
        try {
            const hashedPassword = createHash(newPassword);
            const pruebaClave = await userModel.findOne({ _id: id });
            const claveActual = isValidPassword(pruebaClave, newPassword);
            if (claveActual) {
                return '{"status": "duplicated", "message": "You cannot use the same password"}';
            } else {
                await userModel.updateOne({ _id: id }, { password: hashedPassword });
                return '{"status": "ok", "message": "Password updated successfully"}';
            }
        } catch (error) {
            const log = useLogger();
            log.error(`${new Date().toLocaleString()}: Error al actualizar la contraseña: ${error}`);
            return '{"status": "failed", "message": "Error when updating password: ' + error + '"}';
        }
    }

    getRecoveryId = async (id) => {
        try {
            const recoveryId = await passwordRecoveryModel.findOne({ _id: id });
            return recoveryId;
        } catch (error) {
            const log = useLogger();
            log.error(`${new Date().toLocaleString()}: Error al obtener el link de recuperación: ${error}`);
            return '{"status": "failed", "message": "Error when getting recovery link: ' + error + '"}';
        }
    }

    isRecoveryAttemptValid = async (id) => {
        const maxTime = 3600;
        try {
            const recoveryId = await this.getRecoveryId(id);
            const now = new Date();
            const recoveryIdDate = new Date(recoveryId.createdAt);
            const diff = (now.getTime() - recoveryIdDate.getTime()) / 1000;
            if (isNaN(diff)) {
                return '{"status": "failed", "message": "Recovery link expired"}';
            } else {
            if (diff > maxTime) {
                return '{"status": "failed", "message": "Recovery link expired"}';
            } else {
                return '{"status": "ok", "message": "Recovery link is valid"}'
            }
        }
        } catch (error) {
            const log = useLogger();
            log.error(`${new Date().toLocaleString()}: Error al validar el tiempo: ${error}`);
            return '{"status": "failed", "message": "Error when validating time: ' + error + '"}';
        }
    }
}