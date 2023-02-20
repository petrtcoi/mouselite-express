import SupplierEmail, { SupplierEmailType } from '../../../models/supplierEmail';

export async function setAttachments(props: {
  emailId: string,
  attachments: SupplierEmailType['attachments'],
}): Promise<boolean> {

  console.log(props);
  try {
    await SupplierEmail.updateOne(
      { emailId: props.emailId },
      { $addToSet: { attachments: { $each: props.attachments } } }, { upsert: true }
    );
    return true;
  } catch (error) {
    return false;
  }


}


