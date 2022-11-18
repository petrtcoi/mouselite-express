import axios from 'axios'
import { parseString } from 'xml2js'

const getEuroRate = async (): Promise<number> => {

    const date = new Date(Date.now())
    date.setDate(date.getDate() + 1)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    try {
        const requestString = `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`
        const xml = await axios.get(requestString)

        let rates = undefined
        parseString(xml.data, (err, result) => {
            rates = result.ValCurs.Valute
        })

        if (rates === undefined) return 0

        const rateEur: number = rates
            /* @ts-ignore */
            .find((x: { $: { ID: string } }) => x.$.ID === 'R01239')
            .Value[0]
            .replace(',', '.')

        return rateEur
    } catch (err) {
        console.log(err)
        return 0
    }
}

export { getEuroRate }