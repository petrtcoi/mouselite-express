import { Request, Response } from "express";
import TubogModel from "./models/tubogModel.model"

const getAllModels = async (_req:Request, res: Response) => {

    const data = await TubogModel.find({}).lean()
    res.status(200).send(data)
}

export default getAllModels