import axios from 'axios'
import { parseString } from 'xml2js'

const getEuroRate = async (): Promise<number> => {

    const date = new Date(Date.now())
    date.setDate(date.getDate() + 1)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()


    const requestString = `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`
    const xml = await axios.get(requestString)

    let res = 0
    parseString(xml.data, (_err: any, result: { ValCurs: { Valute: any } }) => {
        const rateEur = result.ValCurs.Valute
            .find((x: { $: { ID: string } }) => x.$.ID === 'R01239')
            .Value[0]
            .replace(',', '.')
        res = rateEur
    })

    return res
}

export { getEuroRate }