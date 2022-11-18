import { Request, Response } from 'express'
import validateSupplierCode from '../../utils/validateSupplierCode'

import StockBrandItem from '../../models/stockBrandItem.models'

const stockBrandUpdate = async (req: Request, res: Response): Promise<void> => {
    
    if (!req?.body.items) {
        res.status(400).send('no items')
        return
    }

    const items = req.body.items

    if (items.length === 0) {
        res.status(200).send({ removed: 0, errors: 0, saved: 0 })
        return
    }

    if (!items[0] || !items[0].supplierCode) {
        res.status(400).send({error: 'no_supplierCode_in_first_row'})
        return
    }
    if (!items[0].modelType) {
        res.status(400).send({error: 'no_modelId_in_first_row'})
        return
    }

    const supplierCode = items[0].supplierCode
    const validatedSupplierCode = await validateSupplierCode({ supplierCode })
    if (validatedSupplierCode === false) {
        res.status(400).send({error: 'wrong_supplierCode'})
        return
    }

    const { deletedCount } = await StockBrandItem.deleteMany({ "supplierCode": supplierCode })
    let saved = 0
    let errors = 0
    await Promise.all(items.map(async (item: any) => {
        try {
            const newItem = new StockBrandItem(item)
            await newItem.save()
            saved += 1
        } catch {
            errors += 1
        }
    }))
    res.status(200).send({ removed: deletedCount, errors, saved })

}


export default stockBrandUpdate