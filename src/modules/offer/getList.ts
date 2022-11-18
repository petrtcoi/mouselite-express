import { Request, Response } from "express"

import Offer from "../../models/offer.model"



const getList = async (req: Request, res: Response): Promise<void> => {
    try {
        const offerList = await Offer.find({ project: req.params.projectId }, {_id: 1, createdAt: 1}).lean()
        res.status(200).send({ offerList })
    } catch {
        res.status(500)
    }
}

export default getList