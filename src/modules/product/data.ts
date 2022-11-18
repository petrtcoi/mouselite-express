import mongoose from "mongoose"
import ProductAccessory from "../../models/products/productAccessory.models"
import ProductColor from "../../models/products/productColor.models"
import ProductConnection from "../../models/products/productConnection.models"
import ProductModel from '../../models/products/productModel.models'

const GOOGLE_SHEETS: {
    title: string,
    model: mongoose.Model<any, {}, {}, {}>,
    link: string
}[] = [
        {
            title: 'Аксессуары',
            model: ProductAccessory,
            link: 'https://docs.google.com/spreadsheets/d/11DCTOxZtYBM1d1wvc-tUz4Rl0SOKbLreFaOmjf4PLJU/edit#gid=0'
        },
        {
            title: 'Цвета',
            model: ProductColor,
            link: 'https://docs.google.com/spreadsheets/d/1ojQfuVgjulF79zq6wMjbVp3kNBqiKU93cMprvdQR-74/edit#gid=0'
        },
        {
            title: 'Подключения',
            model: ProductConnection,
            link: 'https://docs.google.com/spreadsheets/d/14YjgvwlK4yTFdr82MzX8_Ic06XGH8TbbL-0g-3ztgpg/edit#gid=0'
        },
        {
            title: 'Модели',
            model: ProductModel,
            link: 'https://docs.google.com/spreadsheets/d/1-NI5PrZADz3OOGNjlGwqsn-ZYOB9jNKGPh6lPf-8HIw/edit#gid=0'
        }
    ]


export default GOOGLE_SHEETS