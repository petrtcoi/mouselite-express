import { Request, Response } from "express"

import Project from '../../models/project.models'


const getList = async (_req: Request, res: Response): Promise<void> => {

    const LIMIT = 200

    try {
        const projects = await Project
            .find({}, { title: 1, createdAt: 1, manager: 1 })
            .sort({ 'createdAt': -1 })
            .limit(LIMIT).lean()
        res.status(200).send({ projects })
        return
    } catch {
        res.status(200).send({ projects: [] })
    }
}

export default getList
