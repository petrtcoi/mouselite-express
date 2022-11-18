import updateCurrency from "./updateCurrency"
import getCurrency from './getCurrency'
import updateCurrencyCustom from "../../currency/updateCustom"

const currencyFuncs = {
    update: updateCurrency,
    updateCustom: updateCurrencyCustom,
    get: getCurrency
}

export default currencyFuncs