import { Request, Response } from "express"

import ProductModel from "../../models/products/productModel.models"
import ProductAccessory from "../../models/products/productAccessory.models"
import ProductColor from '../../models/products/productColor.models'
import ProductConnection from "../../models/products/productConnection.models"


const get = async (req: Request, res: Response): Promise<void> => {
    const projectId = req.params.projectid

    try {
        const result = { models: [], colors: [], connections: [], accessories: [] }
        await Promise.all([
            result.models = await ProductModel.find({ project: projectId }).lean(),
            result.colors = projectId ? [] : await ProductColor.find({}).lean(),
            result.connections = projectId ? [] : await ProductConnection.find({}).lean(),
            result.accessories = await ProductAccessory.find({ project: projectId }).lean()
        ])
        res.status(200).send(result)
    } catch {
        res.status(500)
    }
}

export default get