import mongoose from "mongoose"
import ProductSchema, { ProductType } from "./product.model"

type ProductAccessoryType = ProductType

const schema = new mongoose.Schema<ProductAccessoryType>({
    ...ProductSchema.obj
}, {
    timestamps: true,
    versionKey: false
})

schema.index({group: 1, code: 1}, {unique: true})

const ProductAccessory = mongoose.model('ProductAccessory', schema)

export default ProductAccessory
export type { ProductAccessoryType }