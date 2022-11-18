import googleSheetRead from "../../../utils/googleSheetRead"
import ozonHttp from "../utils/ozonHttp"
import StockAllItem from "../../../models/stockAllItem.models"
import { OzonItem } from "../../../models/ozon/ozonItem.models"
import { OzonUpdateStockItem, OzonUpdatePriceItem } from '../../../models/ozon/ozonUpdateItem'

const OZON_LIMIT = 100


type UpdateStockProps = {
    updateStockItems: OzonUpdateStockItem[]
    updatePriceItems: OzonUpdatePriceItem[]
}
type Return = {
    results: {
        stock: { errors: number, updated: number }
        prices: { errors: number, updated: number }
    }
}

export const updateStocks = async ({ updateStockItems, updatePriceItems }: UpdateStockProps): Promise<Return> => {

    let updatedStock = 0
    let errorsStock = 0
    let updatedPrice = 0
    let errorsPrice = 0


    const stockChunks = [...Array(Math.ceil(updateStockItems.length / OZON_LIMIT))].map((_, i) => updateStockItems.slice(i * OZON_LIMIT, (i + 1) * OZON_LIMIT))

    for (const stocks of stockChunks) {
        const result = await ozonHttp.post('/v2/products/stocks', { stocks })
        if (result.status === 200) {
            result.data.result.forEach((x: { updated: boolean }) => {
                if (x.updated) updatedStock += 1
                if (!x.updated) errorsStock += 1
            })
        }
    }


    const priceChunks = [...Array(Math.ceil(updatePriceItems.length / OZON_LIMIT))].map((_, i) => updatePriceItems.slice(i * OZON_LIMIT, (i + 1) * OZON_LIMIT))
    for (const prices of priceChunks) {
        const result = await ozonHttp.post('/v1/product/import/prices', { prices })
        if (result.status === 200) {
            result.data.result.forEach((x: { updated: boolean }) => {
                if (x.updated) updatedPrice += 1
                if (!x.updated) errorsPrice += 1
            })
        }
    }

    return ({
        results: {
            stock: { updated: updatedStock, errors: errorsStock },
            prices: { updated: updatedPrice, errors: errorsPrice }
        }
    })


}
