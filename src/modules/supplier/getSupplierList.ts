import { Request, Response } from "express"
import Supplier from '../../models/supplier.model'

const getSupplierList = async(_req: Request, res: Response): Promise<void> => {
    const supplierList = await Supplier.find({},{_id: 0}).lean()
    res.status(200).send({supplierList})
}

export default getSupplierList