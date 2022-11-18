import mongoose from "mongoose"



type WebasystMoyskladItemHrefType = {
    productId: string
    skuId: string
    moyskladHref: string
}

const schema = new mongoose.Schema<WebasystMoyskladItemHrefType>({
    productId: {
        type: String,
        required: true
    },
    skuId: {
        type: String,
        required: true
    },
    moyskladHref: {
        type: String,
        required: true
    }
})

const WebasystMoyskladItemHref = mongoose.model('WebasystMoyskladItemHref', schema)


export default WebasystMoyskladItemHref
export { WebasystMoyskladItemHrefType }