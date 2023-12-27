import mongoose from 'mongoose';

const passwordRecoveryCollection = 'passwordrecoverycollection';

const passwordRecoverySchema = new mongoose.Schema({
    userId: String,
},{timestamps: true});

export const passwordRecoveryModel = mongoose.model(passwordRecoveryCollection, passwordRecoverySchema);