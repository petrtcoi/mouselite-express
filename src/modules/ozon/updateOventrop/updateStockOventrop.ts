import { Request, Response } from "express"
import { ozonSuppliers, googleSheets } from '../../../config/ozon.config'
import { OzonItem } from "../../../models/ozon/ozonItem.models"
import StockAllItem from "../../../models/stockAllItem.models"
import googleSheetRead from "../../../utils/googleSheetRead"
import ozonHttp from "../utils/ozonHttp"

import { updateStocks } from "../utils/updateStocks"
import { OzonUpdateStockItem } from '../../../models/ozon/ozonUpdateItem'
import { OzonGoogleItem } from '../../../models/ozon/ozonGoogleItem.models'



const updateStockOventrop = async (_req: Request, res: Response) => {


    let skus: string[] = []
    let ozonGoogleSkus: string[] = []

    try {
        const result = await ozonHttp.post('/v2/product/list')
        ozonGoogleSkus = (await googleSheetRead(googleSheets.ozonOventrop)).map(x => x.sku)
        skus = result.data.result.items
            .map((x: OzonItem) => x.offer_id)
            .filter((offer_id: string) => ozonGoogleSkus.includes(offer_id))

    } catch (err) {
        res.status(500).send('cant upload initial data')
    }

    //@ts-ignore
    const dbItems: OzonUpdateStockItem[] = await [ozonSuppliers.hogartSpb, ozonSuppliers.hogartMsk].reduce(async (acc, supplier: any) => {

        const items: OzonUpdateStockItem[] = await acc
        const supplierDbItems = await StockAllItem
            .find({ sku: { $in: skus }, supplier: supplier.code }, { sku: 1, quantity: 1 })
            .lean()
        const supplierItems: OzonUpdateStockItem[] = ozonGoogleSkus.map(sku => {
            const dbSupplierItem = supplierDbItems.find((x: OzonGoogleItem) => x.sku === sku)
            return {
                offer_id: sku,
                warehouse_id: supplier.warehouseId,
                stock: dbSupplierItem ? +dbSupplierItem?.quantity || 0 : 0
            }
        })
        return [...items, ...supplierItems]
    }, [])


    const resultUpdate = await updateStocks({ updateStockItems: dbItems, updatePriceItems: [] })

    res.status(200).send(resultUpdate)

}


export default updateStockOventrop