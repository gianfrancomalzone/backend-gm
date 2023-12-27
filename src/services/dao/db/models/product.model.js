import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const productsCollection = 'products';

const stringRequired = {
    type: String,
    required: true
}
const numberRequired = {
    type: Number,
    required: true
}

const productsSchema = new mongoose.Schema({
    title: stringRequired,
    description: stringRequired,
    price: numberRequired,
    code: stringRequired,
    thumbnails: String,
    stock: { type: Number },
    status: { type: Boolean },
    category: stringRequired,
    owner: { type: String, default: "admin" }
});
productsSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(productsCollection, productsSchema);