import { Request, Response } from "express";

import SupplierEmail from "../../models/supplierEmail";


const getByOrderId = async (req: Request, res: Response): Promise<void> => {


  try {
    const emails = await SupplierEmail
      .find({ orderId: req.params.orderId })
      .lean();
    res.status(200).send(emails);
    return;
  } catch {
    res.status(400).send({ error: 'error' });
  }
};

export default getByOrderId;
