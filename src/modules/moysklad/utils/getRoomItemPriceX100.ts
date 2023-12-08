import { ProjectCurrencies } from '../types/currencies.type';
import { RoomItem } from '../types/roomItem.type';
import ProductAccessory from '../../../models/products/productAccessory.models';
import ProductModel from '../../../models/products/productModel.models';
import ProductConnection from '../../../models/products/productConnection.models';
import ProductColor from '../../../models/products/productColor.models';

type Props = {
  item: RoomItem;
  currencies: ProjectCurrencies;
};

const getRoomItemPriceX100 = async (props: Props): Promise<number> => {
  const dbItem = props.item.accessory
    ? await ProductAccessory.findOne({ _id: props.item.accessory })
    : await ProductModel.findOne({ _id: props.item.model });
  if (!dbItem) return 0;

  const currencyRate =
    dbItem.currency === 'rub'
      ? 1
      : dbItem.currency === 'eur'
      ? props.currencies.eur
      : dbItem.currency === 'varmann'
      ? props.currencies.varmann
      : 0;

  let price =
    ((dbItem.priceBase || 0) +
      //@ts-ignore
      (dbItem.priceSection || 0) * +(props.item.sections || 0)) *
    currencyRate;

  let connectionPrice = 0;
  if (props.item.connection) {
    const dbConnection = await ProductConnection.findOne({
      _id: props.item.connection,
    });
    if (!!dbConnection) {
      const connCurrencyRate =
        dbConnection.currency === 'rub'
          ? 1
          : dbConnection.currency === 'eur'
          ? props.currencies.eur
          : dbConnection.currency === 'varmann'
          ? props.currencies.varmann
          : 0;
      connectionPrice = dbConnection.priceBase * connCurrencyRate;
    }
  }

  if (props.item.color) {
    const dbColor = await ProductColor.findOne({ _id: props.item.color });

    const colorCurrencyRate = dbColor
      ? dbColor.currency === 'rub'
        ? 1
        : dbColor.currency === 'eur'
        ? props.currencies.eur
        : dbColor.currency === 'varmann'
        ? props.currencies.varmann
        : 0
      : 0;

    if (dbColor?.priceBase) {
      price = price + dbColor.priceBase * colorCurrencyRate;
    }

    if (dbColor?.priceSection) {
      price =
        price +
        dbColor.priceSection * colorCurrencyRate * +(props.item.sections || 0);
    }

    if (dbColor?.rateBase) {
      price = price * dbColor.rateBase;
    }

    if (dbColor?.rateConnection) {
      connectionPrice = connectionPrice * dbColor.rateConnection;
    }
  }

  return (
    Math.floor(
      ((price + connectionPrice) * (100 - (props.item.discount || 0))) / 100
    ) * 100
  );
};

export default getRoomItemPriceX100;
