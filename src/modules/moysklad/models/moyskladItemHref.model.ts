import mongoose from "mongoose"
import { ProductAccessoryType } from "../../../models/products/productAccessory.models"
import { ProductColorType } from "../../../models/products/productColor.models"
import { ProductConnectionType } from "../../../models/products/productConnection.models"
import { ProductModelType } from "../../../models/products/productModel.models"


type MoyskladItemHrefType = {
    accessory: (ProductAccessoryType & mongoose.Document)['_id']
    model: (ProductModelType & mongoose.Document)['_id']
    color: (ProductColorType & mongoose.Document)['_id']
    connection: (ProductConnectionType & mongoose.Document)['_id']
    sections: number
    moyskladHref: string
}

const schema = new mongoose.Schema<MoyskladItemHrefType>({
    moyskladHref: {
        type: String,
        required: true
    },
    accessory: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'ProductAccessory'
    },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'ProductModel'
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'ProductColor'
    },
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ProductConnection'
    },
    sections: {
        type: Number,
        required: false
    }
})

const MoyskladItemHref = mongoose.model('MoyskladItemHref', schema)


export default MoyskladItemHref
export { MoyskladItemHrefType }