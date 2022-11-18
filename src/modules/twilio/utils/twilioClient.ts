import twilio from 'twilio'
import twilioConf from '../../../config/twilio.config'

const client = twilio(twilioConf.accountSid, twilioConf.authToken)

export default client