export type TubogCsvModelType = {
    id: string
    type: string
    code: string
    name: string
    description: string | null
    interAxle: string
    width: string
    height: string
    lengthSection: string | null
    lengthBase: string | null
    dt70: string
    dt60: string
    dt50: string
    priceBase: string  | null
    priceSection: string | null
    imageMain: string
    imagesList: string | null
    inStock: 'true' | null
    colorId: string | null
    connectionId: string | null
    inStockSections: string | null
    volume: string
    weightSection: string
    sectionsMax: string | null
}