import { Request, Response } from "express"

import Project from "../../models/project.models"
import Version, { VersionType } from "../../models/version.model"




const versionCreate = async (req: Request, res: Response): Promise<void> => {

  
    const project = await Project.findOne({ _id: req.body.projectId })
    if (project === null) {
        res.status(400).send({error: 'project_cant_find'})
        return
    }

    const version: VersionType = {
        title:  req.body.title,
        project: req.body.projectId
    }

    try {
        const newVersion = new Version(version)
        await newVersion.save()
        res.status(200).send({ version: newVersion })
        return
    } catch (err: any) {
        if (err.code && err.code === 11000) {
            res.status(400).send({error: 'validation_error'})
            return
        }
        res.status(500).send()
        return
    }



}

export default versionCreate
