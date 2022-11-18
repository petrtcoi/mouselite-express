import { Request, Response, NextFunction } from 'express'

const checkPresence = (fields: string[]) => {

    return (

        async (req: Request, res: Response, next: NextFunction) => {

            let errors: string[] = []
            fields.forEach(field => {
                if (!req.body[field]) {
                    errors.push('field')
                }
            })
            if (errors.length > 0) {
                res.status(400).send({error: `not_provided_${errors.join('_')}`})
                return
            }
            next()
        }

    )
}

export default checkPresence
