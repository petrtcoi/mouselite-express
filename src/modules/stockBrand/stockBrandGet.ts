import { Request, Response } from 'express'
import StockBrandItem from '../../models/stockBrandItem.models'

const stockBrandGet = async (_req: Request, res: Response): Promise<void> => {

    try {
        const items = await StockBrandItem.find({}, {_id: 0, __v: 0}).lean()
        res.status(200).send({items})
    } catch {
        res.status(500).send()
    }
}

export default stockBrandGet