import { Request, Response } from 'express'
import Currency from '../../models/currency.models'



const getCurrency = async (req: Request, res: Response) => {

    if (!req.params.name) res.status(400).send('no currency NAME')

    try {
        let data = await Currency.findOne({ "name": req.params.name }, { _id: 0 })
        if (!data) throw new Error()
        if (data.rate <= 0) {
            data = await Currency.findOne({ "name": "EURO" }, { _id: 0 })
            if (!data) throw new Error()
        }
        res.status(200).send(data)
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }

}


export default getCurrency