import atolHttp from './atolHttp'
import atolConfig from '../../../config/atol.config'

const atolGetDocInfo = async ({ token, uuid }: { token: string, uuid: string }): Promise<{ data?: any, error?: boolean}> => {

    const result = await atolHttp.get(`/${atolConfig.group_code}/report/${uuid}`, {
        headers: { "Token": token }
    })

    if (result.status !== 200) return { error: true }

    return { data: result.data }

}


export default atolGetDocInfo