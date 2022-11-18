import { Request, Response } from "express"

import Version from "../../models/version.model"

const versionUpdate = async (req: Request, res: Response): Promise<void> => {


    const allowUpdates = ['title', 'description', 'images']
    const updates = Object.fromEntries(
        Object.entries(req.body.updates)
            .filter(([key, _value]) => allowUpdates.includes(key))
    )


    const version = await Version.findOne({ _id: req.body.id })
    if (!version) {
        res.status(500).send({ error: 'version_cant_find' })
        return
    }

    try {
        const response = await Version.findOneAndUpdate({ _id: req.body.id }, updates, { new: true })
        res.status(200).send({ version: response })
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
}

export default versionUpdate