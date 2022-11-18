import Credential from '../../../models/credential.models'
import atolConfig from '../../../config/atol.config'
import atolGetDocInfo from './atolGetDocInfo'
import atolHttp from './atolHttp'


const atolGetToken = async (): Promise<{ token?: string, error?: boolean }> => {

    const doc = await Credential.findOne({ key: 'atolToken' })


    const validatedToken: boolean = !doc ? false
        : (await atolGetDocInfo({ token: doc.value, uuid: atolConfig.some_uuid })).error ? false : true
    if (validatedToken && doc) return { token: doc.value }


    const result = await atolHttp.post('/getToken', {
        login: atolConfig.login,
        pass: atolConfig.password
    })
    
    if (result.data.token) {
        await Credential.findOneAndUpdate(
            { key: 'atolToken' },
            { value: result.data.token },
            { upsert: true }
        )
        return { token: result.data.token }
    }

    return { error: true }

}

export default atolGetToken