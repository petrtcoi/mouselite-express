import axios from 'axios'
import googleSheetParse from './googleSheetParse'

const getGoogleSheetData = async (docId: string, sheetId?: string): Promise<{ [key: string]: string }[]> => {

    try {
        const csvLink = sheetId === undefined ?
            `https://docs.google.com/spreadsheets/d/${docId}/export?format=csv` :
            `https://docs.google.com/spreadsheets/d/${docId}/export?format=csv&gid=${sheetId}`

        const csvFile = await axios.get(csvLink)
        const data = googleSheetParse(csvFile.data)
        return data
    } catch (err) {
        console.log(err)
        return []
    }
}

export default getGoogleSheetData