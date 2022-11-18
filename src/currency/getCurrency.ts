import mongoose from "mongoose"
import { Request, Response } from 'express'




const getCurrency = async (_req: Request, res: Response) => {

    res.status(200).send({ name: 'EURO', rate: 89 })

}


export default getCurrency