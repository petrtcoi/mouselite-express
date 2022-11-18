import { Request, Response } from "express";
import TubogConnection from "./models/tubogConnection.model"

const getAllConnections = async (_req:Request, res: Response) => {

    const data = await TubogConnection.find().lean()
    res.status(200).send(data)
}

export default getAllConnections