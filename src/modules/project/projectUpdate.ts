import { Request, Response } from "express"
import Currency from "../../models/currency.models"

import Project from "../../models/project.models"

const projectUpdate = async (req: Request, res: Response): Promise<void> => {

    if (!req.body.updates.currencies.eur || !req.body.updates.currencies.varmann) {
        res.status(400).send({ error: 'currencies_some_missed' })
        return
    }


    const allowUpdates = ['title', 'description', 'currencies', 'manager', 'store']
    const updates = Object.fromEntries(
        Object.entries(req.body.updates)
            .filter(([key, _value]) => allowUpdates.includes(key))
    )


    const project = await Project.findOne({ _id: req.body.id })
    if (!project) {
        res.status(500).send({ error: 'project_cant_find' })
        return
    }

    try {
        const response = await Project.findOneAndUpdate({ _id: req.body.id }, updates, { new: true })
        if (req.body.updates.currencies.eur !== project.currencies.eur) {
            await Currency.findOneAndUpdate({name: 'DEFAULT_PROJECT_EURO'}, {rate: req.body.updates.currencies.eur})
        }
        res.status(200).send({ project: response })
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: '' })
    }
}

export default projectUpdate