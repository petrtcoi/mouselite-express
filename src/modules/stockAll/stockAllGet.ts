import { Request, Response } from 'express'
import StockAllItem from '../../models/stockAllItem.models'

const stockAllGet = async (_req: Request, res: Response): Promise<void> => {

    try {
        const items = await StockAllItem.find({}, {_id: 0, __v: 0}).lean()
        res.status(200).send({items})
    } catch {
        res.status(500).send()
    }
}

export default stockAllGet