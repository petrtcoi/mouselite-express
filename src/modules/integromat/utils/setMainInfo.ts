import SupplierEmail from '../../../models/supplierEmail';

export async function setMainInfo(props: {
  emailId: string,
  text: string,
  subject: string,
  emailTo: string;
  emailFrom: string;
}): Promise<boolean> {

  const orderId = extractOrderId(props.subject);
  console.log(props);
  if (!orderId) return false;
  try {
    await SupplierEmail.updateOne(
      { emailId: props.emailId },
      { orderId, text: props.text, emailTo: props.emailTo.split('<')[1].split('>')[0], emailFrom: props.emailFrom, subject: props.subject });
    return true;
  } catch (error) {
    return false;
  }


}


function extractOrderId(subject: string): string {
  try {
    return subject.split('[ЗАПРОС:')[1].split(']')[0].trim();
  } catch (error) {
    return '';
  }
}