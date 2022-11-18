import { Request, Response } from "express"
import mongoose from "mongoose"

import Project from '../../models/project.models'


const get = async (req: Request, res: Response): Promise<void> => {

    if (!req.params.id) {
        res.status(400).send({ error: 'no_projectId' })
    }

    try {
        const project = await Project.findOne({ _id: req.params.id }).populate('versions', {_id: 1}).lean()
        res.status(200).send({ project})
        return
    } catch (err) {
        res.status(400).send({ error: 'project_cant_find' })
    }
}

export default get
