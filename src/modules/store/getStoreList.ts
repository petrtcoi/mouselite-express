import { Request, Response } from "express"
import Store from '../../models/store.model'

const getStoreList = async(_req: Request, res: Response): Promise<void> => {
    const storeList = await Store.find({}, {whatsappPhone: 0}).populate('whatsappTemplates', {_id: 0}).lean()
    res.status(200).send({storeList})
}

export default getStoreList