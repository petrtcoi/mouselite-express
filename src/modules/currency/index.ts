import updateCurrency from './updateCurrency';
import getCurrency from './getCurrency';
import updateCurrencyCustom from '../../currency/updateCustom';
import updateArboniaRateCbr from './updateArboniaRateCbr';

const currencyFuncs = {
  update: updateCurrency,
  updateCustom: updateCurrencyCustom,
  get: getCurrency,
  arbonia: updateArboniaRateCbr,
};

export default currencyFuncs;
