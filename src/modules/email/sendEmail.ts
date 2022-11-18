import sgMail from '@sendgrid/mail'
import { Request, Response } from "express"
import apiKey from '../../config/sendgrid.config'

sgMail.setApiKey(apiKey)

const sendEmail = async (req: Request, res: Response) => {


    try {
        const msg = req.body
        sgMail
            .send(msg)
            .then((response) => {
                res.status(200).send("ok")
            })
            .catch((error) => {
                console.log(error)
                res.status(500).send(error)
            })

    } catch (error) {
        res.status(500).send('error')
    }

}

export default sendEmail