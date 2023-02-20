import { Request, Response } from "express";

import { checkSupplierEmail } from "./utils/checkSupplierEmail";
import { setAttachments } from "./utils/setAttachments";
import { setMainInfo } from "./utils/setMainInfo";

const addData = async (req: Request, res: Response): Promise<void> => {

    if (!req.body.SECRET_KEY || req.body.SECRET_KEY !== 'some_secret_key') {
        res.status(401).send('Unauthorized');
        return;
    }

    try {
        const { emailId, text, subject, emailTo, emailFrom, attachments } = req.body;
        if (!emailId) {
            res.status(400).send({ error: 'no Email ID' });
            return;
        }

        const checkEmail = await checkSupplierEmail(emailId);
        if (!checkEmail) {
            res.status(500).send({ ok: true });
            return;
        }
        if (emailId && text && subject && emailTo && emailFrom) {
            await setMainInfo({ emailId, text, subject, emailTo, emailFrom });
        }
        if (attachments) {
            await setAttachments({ emailId, attachments });
        }






        res.status(200).send({ ok: true });
        return;
    } catch (err) {
        console.log('ERROR: ', err);
        res.status(400).send({ error: 'Some Error' });
    }
};

export default addData;
