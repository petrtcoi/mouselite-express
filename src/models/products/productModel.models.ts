import mongoose from "mongoose"
import ProductSchema, { ProductType } from "./product.model"

type ProductModelType = {
    prefix?: string
    colorGroup?: string
    connectionGroup?: string
    
    width: number
    height: number

    dt50?: number
    dt60?: number
    dt70?: number

    lengthBase?: number
    lengthSection?: number
    priceSection?: number

    sections?: number
} & ProductType



const schema = new mongoose.Schema<ProductModelType>({
    ...ProductSchema.obj,
    prefix: {
        type: String,
        required: false,
    },
    colorGroup: {
        type: String,
        required: false,
    },
    connectionGroup: {
        type: String,
        required: false,
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    dt50: {
        type: Number,
        required: false
    },
    dt60: {
        type: Number,
        required: false
    },
    dt70: {
        type: Number,
        required: false
    },
    lengthBase: {
        type: Number,
        required: false
    },
    lengthSection: {
        type: Number,
        required: false
    },
    priceSection: {
        type: Number,
        required: false
    },
    sections: {
        type: Number,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
})

schema.index({ group: 1, code: 1 }, { unique: true })

const ProductModel = mongoose.model('ProductModel', schema)

export default ProductModel
export type { ProductModelType }