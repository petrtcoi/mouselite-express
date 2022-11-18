import { Request, Response } from "express"

import Project, { ProjectType } from "../../models/project.models"
import Store from '../../models/store.model'
import Currency from '../../models/currency.models'

const projectCreate = async (req: Request, res: Response): Promise<void> => {
    const projectTitle = req.body.title

    const store = await Store.findOne({})
    if (!store) {
        res.status(400).send({error: 'store_cant_find'})
        return
    }
    const oldProject = await Project.findOne({title: projectTitle})   
    if (oldProject) {
        res.status(400).send({error: 'title_duplicated'})
        return
    }

    const defaultEuroRate = (await Currency.findOne({ name: 'DEFAULT_PROJECT_EURO' }))?.rate || 100
    const defaultVarmannRate = (await Currency.findOne({ name: 'VARMANN' }))?.rate || 100

    const project: ProjectType = {
        title: projectTitle,
        description: '',
        manager: req.user._id,
        store: store._id,
        currencies: {
            eur: defaultEuroRate,
            varmann: defaultVarmannRate
        }
    }

    try {
        const newProject = new Project(project)
        await newProject.save()
        res.status(200).send({ project: newProject })
    } catch (err: any) {
        if (err.code && err.code === 11000) {
            res.status(400).send({error: 'validation_error'})
            return
        }
        console.log(err)
        res.status(500).send({error: ''})
    }



}

export default projectCreate