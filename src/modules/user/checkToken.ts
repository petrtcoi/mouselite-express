import { Request, Response } from 'express'

const checkToken = async (req: Request & {user?: {name?: string}}, res: Response) => {

    if (req?.user?.name) {
        res.status(200).send(req.user.name)
        return
    }
    res.status(401).send('Authentication error')
    
}

export default checkToken