import { Request, Response } from "express"
import ProductAccessory from "../../models/products/productAccessory.models"
import ProductModel from "../../models/products/productModel.models"
import Project from "../../models/project.models"


const createCustom = async (req: Request, res: Response): Promise<void> => {

    const { type, title, currency, priceBase, projectId } = req.body

    const project = await Project.findOne({ _id: projectId })
    if (!project) {
        res.status(400).send({ error: 'project_cant_find' })
        return
    }

    try {
        if (type === 'accessory') {
            const newProduct = new ProductAccessory({
                group: 'custom',
                code: 'custom',
                project: project._id,
                title,
                priceBase,
                currency
            })
            await newProduct.save()
            res.status(200).send({ product: newProduct })
            return
        }

        if (type === 'model') {

            if (!req.body.width || !req.body.height || !req.body.length) {
                res.status(400).send('no_dimensions_data')
                return
            }
            if(!req.body.dt50 && !req.body.dt60 && !req.body.dt70) {
                res.status(400).send('no_power_data')
                return
            }

            const newProduct = new ProductModel({
                group: 'custom',
                code: 'custom',
                project: project._id,
                prefix: '',
                colorGroup: undefined,
                connectionGroup: undefined,
                title,
                priceBase,
                currency,

                width: req.body.width,
                height: req.body.height,
                lengthBase: req.body.length,

                dt50: req.body.dt50,
                dt60: req.body.dt60,
                dt70: req.body.dt70
            })
            await newProduct.save()
            res.status(200).send({ product: newProduct })
            return
        }
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }

    res.status(400).send('wrong_type')
    return
}

export default createCustom