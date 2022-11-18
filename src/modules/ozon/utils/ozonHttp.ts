import axios from 'axios'
import { apiKey, clientId, host } from "../../../config/ozon.config"


const ozonHttp = axios.create({
    baseURL: host,
    headers: {
        'Client-Id': clientId,
        'Api-Key': apiKey
    },
    validateStatus: () => true
})

export default ozonHttp