import { Request, Response } from 'express'
import { TwilioLogsMsg } from '../../models/twilioLogsMsg.model'
import twilioClient from './utils/twilioClient'

const MSG_QNTY = 100

const getLastMsgList = async (req: Request, res: Response): Promise<void> => {

    await twilioClient.messages
        .list({ limit: MSG_QNTY })
        .then((result) => {
            const msgList: TwilioLogsMsg[] = result.map(x => {
                try {
                    return {
                        date: x.dateSent?.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
                        phoneFrom: x.from,
                        phoneTo: x.to,
                        status: x.status,
                        message: x.body
                    }
                } catch (err) {
                    console.log(err)
                    return null
                }
            }).filter( x => x) as TwilioLogsMsg[]
            res.status(200).send({ messages: msgList })
        })
        .catch((err) => {
            console.log('X: ',err)
            res.status(500).send(err)
        })

}

export default getLastMsgList
