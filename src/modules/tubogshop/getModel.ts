import { Request, Response } from "express";
import TubogModel from "./models/tubogModel.model"

const getModel = async (req:Request, res: Response) => {

    const modelId = req.params.model
    const data = await TubogModel.findOne({id: modelId}).lean()
    res.status(200).send(data)
}

export default getModel