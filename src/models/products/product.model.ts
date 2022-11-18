import mongoose from "mongoose"
import { ProjectType } from "../project.models"

type ProductType = {
    group: string
    code: string
    title: string
    priceBase?: number
    deprecated?: boolean
    currency?: 'eur' | 'rub' | 'varmann'
    project?: (ProjectType & mongoose.Document)['_id']
}

const ProductSchema = new mongoose.Schema<ProductType>({
    group: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value: string) => value && value.length > 0
        }
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    priceBase: {
        type: Number,
        required: false
    },
    deprecated: {
        type: Boolean,
        required: false
    },
    currency: {
        type: String,
        required: false,
        trim: true,
        default: '',
        validate: {
            validator: (value: string) => value === 'eur' || value === 'rub' || value === 'varmann' || value === ''
        }
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Project'
    }
})


export default ProductSchema
export type { ProductType }