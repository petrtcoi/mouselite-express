import { Request, Response } from 'express'

import { getEuroRate } from "./utils/getEuroRate"
import Currency from '../../models/currency.models'

const updateCurrency = async (_req: Request, res: Response): Promise<void> => {
    const newRate = await getEuroRate()

    if (newRate === 0) res.status(500).send('Cant update EURO rate')

    const oldCurrency = await Currency.findOne({ name: 'EURO' })

    if (oldCurrency) {
        const rateDiff = (newRate - oldCurrency.rate) / oldCurrency.rate * 100

        if (rateDiff < 3 && rateDiff >= 0) {
            res.status(200).send(oldCurrency)
            return
        }

        try {
            oldCurrency.rate = newRate
            await oldCurrency.save()
            res.status(200).send(oldCurrency)
            return
        } catch (err) {
            res.status(500).send(err)
            return
        }
    }

    const currency = new Currency({
        rate: newRate,
        name: "EURO"
    })

    try {
        await currency.save()
        res.status(200).send(currency)
    } catch (err) {
        res.status(500).send(err)
    }

}


export default updateCurrency