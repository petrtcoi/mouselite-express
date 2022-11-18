import axios from 'axios'


const atolHttp = axios.create({
    baseURL: 'https://online.atol.ru/possystem/v4',
    validateStatus: () => true
})

export default atolHttp