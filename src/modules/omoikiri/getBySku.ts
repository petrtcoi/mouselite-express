import { Request, Response } from "express"
import OmoikiriItem from "./models/omoikiriItem.model"

const getBySku = async (req: Request, res: Response): Promise<void> => {
    const sku = req.params.sku
    const result = await OmoikiriItem.findOne({sku: sku})
    res.status(200).send(result)
}

export default getBySku