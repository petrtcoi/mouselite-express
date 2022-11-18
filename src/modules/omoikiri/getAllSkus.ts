import { Request, Response } from "express"
import OmoikiriItem from "./models/omoikiriItem.model"

const getAllSkus = async (_req: Request, res: Response): Promise<void> => {
    const result = await OmoikiriItem.find({}).select({sku: 1, group: 1, name: 1}).lean()
    res.status(200).send(result)
}

export default getAllSkus