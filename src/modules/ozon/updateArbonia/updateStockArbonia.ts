import { Request, Response } from "express"


import ozonHttp from "../utils/ozonHttp"
import addDbQuantity from "./addDbQuantity"
import addGoogleData from "./addGoogleData"

import { OzonItem } from "../../../models/ozon/ozonItem.models"
import { updateStocks } from '../utils/updateStocks'



const updateStockArbonia = async (_req: Request, res: Response) => {


    const result = await ozonHttp.post('/v2/product/list')
    const rawOzonItems = result.data.result.items as OzonItem[]
    const [ozonUpdateStockItems, ozonUpdatePriceItems] = await Promise.all([
        addDbQuantity(rawOzonItems),
        addGoogleData(rawOzonItems)
    ])
    const updateResult = await updateStocks({ updateStockItems: ozonUpdateStockItems, updatePriceItems: ozonUpdatePriceItems })

    res.status(200).send(updateResult)
}


export default updateStockArbonia