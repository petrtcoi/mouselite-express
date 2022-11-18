import { Request, Response } from "express"

import Version from '../../models/version.model'


const get = async (req: Request, res: Response): Promise<void> => {

    if (!req.params.id) {
        res.status(400).send({ error: 'no_versionId' })
    }

    try {
        const version = await Version.findOne({ _id: req.params.id }).populate('rooms', {_id: 1, type: 1, createdAt: 1, updatedAt: 1}).lean()
        res.status(200).send({ version })
        return
    } catch {
        res.status(400).send({ error: 'version_cant_find' })
    }
}

export default get
