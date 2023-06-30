import atolHttp from './atolHttp'
import getAtolConfigs, {type Company} from '../../../config/atol.config'

const atolGetDocInfo = async (
    { token, uuid, company }: { token: string, uuid: string, company: Company }
    ): Promise<{ data?: any, error?: boolean}> => {


        const {atolConfig} = getAtolConfigs(company)

    const result = await atolHttp.get(`/${atolConfig.group_code}/report/${uuid}`, {
        headers: { "Token": token }
    })

    if (result.status !== 200) return { error: true }

    return { data: result.data }

}


export default atolGetDocInfo