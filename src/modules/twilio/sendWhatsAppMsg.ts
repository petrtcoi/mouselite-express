import { Request, Response } from 'express'
import Store from '../../models/store.model'

import { twilioSendMessage } from './utils/twilioSendMessage'

const sendWhatsAppMsg = async (req: Request, res: Response): Promise<void> => {
 
    const toPhoneNumber: string = req.body.phoneTo
    if (toPhoneNumber.length !== 12 || toPhoneNumber[0] !== '+') {
        res.status(400).send({error: 'wrong_phoneTo_format'})
        return
    }


    const store = await Store.findOne({ code: req.body.storeCode }).populate('whatsappPhone').exec()
    if (!store) {
        res.status(400).send({error: 'wrong_storeCode'})
        return
    }

    if (store.whatsappPhone.phone === undefined) {
        res.status(500).send({error: 'senderPhone_cant_find'})
        return
    }
    const senderPhoneNumber = store.whatsappPhone.phone
    

    

    try {
        await twilioSendMessage({
            body: req.body.message,
            from: `whatsapp:${senderPhoneNumber as string}`,
            to: `whatsapp:${toPhoneNumber}`
        })
            .then((message: any) => res.status(200).send({ sid: message.sid }))
    } catch (err) {
        res.status(500).send()
    }

}





export default sendWhatsAppMsg
