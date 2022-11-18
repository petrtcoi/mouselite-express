import { Request, Response } from 'express'
import validateSupplierCode from '../../utils/validateSupplierCode'

import StockAllItem from '../../models/stockAllItem.models'


const stockAllUpdate = async (req: Request, res: Response): Promise<void> => {

    if (!req?.body?.items) {
        res.status(400).send('no items array')
        return
    }
    const items = req.body.items

    if (items.length === 0) {
        res.status(200).send({ removed: 0, errors: 0, saved: 0 })
        return
    }

    if (!items[0] || !items[0].supplierCode) {
        res.status(400).send('no supplierCode in first row')
        return
    }
    const supplierCode = items[0].supplierCode
    const validatedSupplierCode = await validateSupplierCode({ supplierCode })
    if (validatedSupplierCode === false) {
        res.status(400).send({error: 'wrong_supplier_code'})
        return
    }


    const { deletedCount } = await StockAllItem.deleteMany({ "supplierCode": supplierCode })
    let saved = 0
    let errors = 0
    // await StockAllItem.create(items)
    await Promise.all(items.map(async (item: any) => {
        try {
            const newItem = new StockAllItem(item)
            await newItem.save()
            saved += 1
        } catch {
            errors += 1
        }
    }))
    // const result = await StockAllItem.create(items)
    res.status(200).send({ removed: deletedCount, errors, saved })





}

export default stockAllUpdate