import { Request, Response } from "express"

import Offer, { OfferType } from "../../models/offer.model"
import Project from "../../models/project.models"

const create = async (req: Request, res: Response): Promise<void> => {

    const project = await Project.findOne({ _id: req.body.projectId })
    if (project === null) {
        res.status(400).send({ error: 'project_cant_find' })
        return
    }



    try {
        const newOffer: OfferType = {
            jsonString: req.body.jsonString,
            project: req.body.projectId
        }
        const offer = new Offer(newOffer)
        await offer.save()
        res.status(200).send({ offer })
    } catch (err: any) {
        if (err.code && err.code === 11000) {
            res.status(400).send({ error: 'validation_error' })
            return
        }
        res.status(500).send()
        return
    }

}

export default create