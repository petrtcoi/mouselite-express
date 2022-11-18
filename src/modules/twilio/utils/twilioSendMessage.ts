import twilioClient from './twilioClient'


type TwilioSendMessageProps = {
    body: string
    from: string
    to: string
}

const twilioSendMessage = ({ body, from, to }: TwilioSendMessageProps) => {
    return new Promise((resolve, reject) => {
        twilioClient.messages
            .create({
                body,
                from,
                to
            })
            .then(message => resolve(message))
            .catch(err => reject(err))
    })
} 

export  {twilioSendMessage}