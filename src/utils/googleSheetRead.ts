import axios from 'axios'
import googleSheetParse from './googleSheetParse'


const googleSheetRead = async (docLink: string): Promise<{[key: string]: string}[]> => {

    try {
        const csvDocId = docLink.split('d/')[1].split('/')[0]
        if (csvDocId.length < 10) return []

        const csvLink = `https://docs.google.com/spreadsheets/d/${csvDocId}/export?format=csv`
        const csvFile = await axios.get(csvLink)
        const data = googleSheetParse(csvFile.data)
       
        return data
    } catch {
        return []
    }
}

export default googleSheetRead