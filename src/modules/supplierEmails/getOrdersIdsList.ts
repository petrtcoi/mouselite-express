import { Request, Response } from "express";

import SupplierEmail from "../../models/supplierEmail";

const LIMIT_COUNT = 50;



const getByOrderIdsList = async (req: Request, res: Response): Promise<void> => {


  try {
    const ordersWithEmails = await SupplierEmail
      .aggregate([
        { $project: { orderId: 1, createdAt: 1 } },
        { $group: { _id: "$orderId", lastEmailCreatedAt: { $last: "$createdAt" }, count: { $sum: 1 } } },
        { $limit: LIMIT_COUNT },
      ]);
    res.status(200).send(ordersWithEmails);
    return;
  } catch {
    res.status(400).send({ error: 'error' });
  }
};

export default getByOrderIdsList;

