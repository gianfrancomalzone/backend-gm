import mongoose from "mongoose";

const collection = "users";

const stringRequired = {
    type: String,
    required: true
}

const stringUnique = {
    type: String,
    required: true,
    unique: true
}

const schema = new mongoose.Schema({
    first_name: stringRequired,
    last_name: stringRequired,
    fullname: stringRequired,
    email: stringUnique,
    age: Number,
    password: String,
    registerMethod: String,
    cartId: String,
    role: { type: String, default: "Usuario", enum: ["Usuario", "Premium", "Admin"] },
    documents: { type: [
        {
            name: String,
            reference: String
        }
    ]},
    last_connection: Date
});

const userModel = mongoose.model(collection, schema);

export default userModel;