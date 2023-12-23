import { Request, Response } from 'express';

import { getEuroRate } from './utils/getEuroRate';
import Currency from '../../models/currency.models';

const updateArboniaRateCbr = async (
  _req: Request,
  res: Response
): Promise<void> => {
  console.log('START');

  const newRate = await getEuroRate();

  if (newRate === 0) {
    res.status(500).send('Cant update EURO rate');
    return;
  }

  const oldArboniaCurrency = await Currency.findOne({ name: 'ARBONIASHOP' });

  if (!oldArboniaCurrency) {
    res.status(500).send('Cant find EURO currency');
    return;
  }

  const newArboniaRate = Math.round(100 * newRate) / 100;

  try {
    oldArboniaCurrency.rate = newArboniaRate;
    await oldArboniaCurrency.save();
    res.status(200).send(oldArboniaCurrency);
    return;
  } catch (err) {
    res.status(500).send(err);
    return;
  }
};

export default updateArboniaRateCbr;
