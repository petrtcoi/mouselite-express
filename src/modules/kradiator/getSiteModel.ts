import { Request, Response } from 'express'
import KradSiteModel from './models/kradSiteModel.model'

const getSiteModel = async (req: Request, res: Response) => {
	const modelId = req.params.model
	const data = await KradSiteModel.findOne({ name: modelId }).populate('radiators').lean()
	res.status(200).send(data)
}

export default getSiteModel
