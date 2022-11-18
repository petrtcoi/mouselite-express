import { Request, Response } from "express"

import Version from "../../models/version.model"




const versionDelete = async (req: Request, res: Response): Promise<void> => {


    const version = await Version.findOne({ _id: req.body.id })
    if (version === null) {
        res.status(400).send({ error: 'version_cant_find' })
        return
    }

    const allVersions = await Version.find({ project: version.project })
    if (allVersions.length <= 1) {
        res.status(406).send({ error: 'cant_delete_last_version' })
        return
    }

    try {
        await Version.findOneAndDelete({ _id: version._id })
        res.status(200).send({ version: version })
        return
    } catch {
        res.status(500).send()
        return
    }
}

export default versionDelete
