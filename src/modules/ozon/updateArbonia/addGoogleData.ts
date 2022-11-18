import { googleSheets } from "../../../config/ozon.config"
import Currency from "../../../models/currency.models"
import { OzonGoogleItem } from "../../../models/ozon/ozonGoogleItem.models"
import { OzonItem } from "../../../models/ozon/ozonItem.models"
import { OzonUpdatePriceItem } from '../../../models/ozon/ozonUpdateItem';
import googleSheetRead from "../../../utils/googleSheetRead"



export type OzonItemWithGoogle = OzonItem & { discount: string, priceEur: string }

const addGoogleData = async (items: OzonItem[]): Promise<OzonUpdatePriceItem[]> => {
    const googleItems = (await googleSheetRead(googleSheets.ozonArbonia)) as OzonGoogleItem[]

    const arboniaShopRate = (await Currency.findOne({ 'name': 'ARBONIASHOP' }))?.rate
    if (!arboniaShopRate) return []

    return items
        .map(item => {
            const googleSheetItem = googleItems.find(x => x.sku === item.offer_id)
            return {
                ...item,
                discount: googleSheetItem?.discount || '',
                priceEur: googleSheetItem?.priceEur || ''
            }
        })
        .filter(x => x.priceEur !== '' && x.discount !== '')
        .map(ozonItem => {
            return {
                offer_id: ozonItem.offer_id,
                old_price: Math.round(arboniaShopRate * +ozonItem.priceEur).toString(),
                price: Math.round(arboniaShopRate * +ozonItem.priceEur * (100 - +ozonItem.discount) / 100).toString()
            }
        })
}

export default addGoogleData