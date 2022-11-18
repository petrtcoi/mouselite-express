import { Request, Response } from "express";
import TubogConnection from "./models/tubogConnection.model"

const getConnection = async (req:Request, res: Response) => {

    const connectionId = req.params.connection
    const data = await TubogConnection.findOne({id: connectionId}).lean()
    res.status(200).send(data)
}

export default getConnection