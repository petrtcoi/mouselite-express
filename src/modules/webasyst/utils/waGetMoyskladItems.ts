import moyskaldProductCreate from '../../moysklad/utils/moyskladProductCreate'
import WebasystMoyskladItemHref from '../models/webasystMoyskladItemhref.model'
import { WaMoyskaldItem } from '../types/waMoyskaldItem.type'
import { WaOrderItem } from '../types/waOrderItem.type'

const waGetMoyskladItem = async (waItem: WaOrderItem): Promise<WaMoyskaldItem> => {

    const dbItem = await WebasystMoyskladItemHref.findOne({ productId: waItem.productId, skuId: waItem.skuId })
    let moyskladHref = ''
    if (dbItem !== null) {
        moyskladHref = dbItem.moyskladHref
    } else {
        const newItem = await moyskaldProductCreate(waItem)
        if (newItem) {
            moyskladHref = newItem.href
        }
        await WebasystMoyskladItemHref.findOneAndUpdate(
            { productId: waItem.productId, skuId: waItem.skuId },
            { moyskladHref: moyskladHref },
            { upsert: true }
        )
    }
    const price = Math.floor(waItem.price - waItem.totalDiscount / waItem.quantity) * 100
    return {
        price,
        quantity: waItem.quantity,
        moyskladHref
    }
}

export default waGetMoyskladItem