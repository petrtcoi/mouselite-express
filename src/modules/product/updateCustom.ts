import { Request, Response } from "express"
import ProductAccessory from "../../models/products/productAccessory.models"
import ProductModel from "../../models/products/productModel.models"


const updateCustom = async (req: Request, res: Response): Promise<void> => {

    const { type, title, currency, priceBase, id } = req.body


    const product = type === 'accesory' ?
        await ProductAccessory.findOne({ _id: id })
        : await ProductModel.findOne({ _id: id })
    if (!product) {
        res.status(400).send({ error: 'product_cant_find' })
        return
    }
    if (!product.project) {
        res.status(400).send({ error: 'cant_update_general_product' })
        return
    }


    try {
        if (type === 'accessory') {

            const updates = {
                title,
                priceBase,
                currency
            }
            const result = await ProductAccessory.findOneAndUpdate({ _id: req.body.id }, updates, { new: true })
            res.status(200).send({ product: result })
            return
        }

        if (type === 'model') {

            if (!req.body.width || !req.body.height || !req.body.length) {
                res.status(400).send('no_dimensions_data')
                return
            }
            if (!req.body.dt50 && !req.body.dt60 && !req.body.dt70) {
                res.status(400).send('no_power_data')
                return
            }

            const updates = {
                title,
                priceBase,
                currency,

                width: req.body.width,
                height: req.body.height,
                lengthBase: req.body.length,

                dt50: req.body.dt50,
                dt60: req.body.dt60,
                dt70: req.body.dt70
            }

            const result = await ProductModel.findOneAndUpdate({ _id: id }, updates, { new: true })
            res.status(200).send({ product: result })
            return
        }
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }

    res.status(400).send('wrong_type')
    return
}

export default updateCustom