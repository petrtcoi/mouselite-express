import { Request, Response } from 'express';
import moyskladGetOrderInfo from './../moysklad/utils/moyskladGetOrderInfo';

const getOrder = async (req: Request, res: Response) => {
  const { orderName } = req.params;

  const { order } = await moyskladGetOrderInfo({ orderName });
  if (!order) {
    res.status(500).send('cant find order');
    return;
  }

  res.status(200).send({ order: order });
};

export default getOrder;
