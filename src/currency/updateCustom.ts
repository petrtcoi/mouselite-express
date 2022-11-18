import { Request, Response } from 'express'
import Currency from './../models/currency.models'

const updateCurrencyCustom = async (req: Request, res: Response): Promise<void> => {
    try {
        await Currency.findOneAndUpdate({ name: req.body.name }, { rate: req.body.rate })
        res.status(200).send('done')
    } catch {
        res.status(500).send()
    }
}


export default updateCurrencyCustom