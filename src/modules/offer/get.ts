import { Request, Response } from "express"

import Offer from "../../models/offer.model"



const get = async (req: Request, res: Response): Promise<void> => {

    try {
        const offer = await Offer.findOne({ _id: req.params.id })
        res.status(200).send({ offer })
    } catch {
        res.status(500)
    }
}

export default get