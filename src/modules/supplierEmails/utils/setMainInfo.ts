import SupplierEmail from '../../../models/supplierEmail';

export async function setMainInfo(props: {
  emailId: string,
  text: string,
  subject: string,
  emailTo: string;
  emailFrom: string;
}): Promise<boolean> {


  const orderId = extractOrderId(props.subject);
  if (!orderId) return false;
  try {
    await SupplierEmail.updateOne(
      { emailId: props.emailId },
      { orderId, text: props.text, emailTo: extractEmailAddress(props.emailTo), emailFrom: props.emailFrom, subject: props.subject });
    return true;
  } catch (error) {
    console.log('setMainInfo ERROR: ', error);
    return false;
  }


}

function extractEmailAddress(email: string): string {
  if (email.split('<').length > 1 && email.split('<')[1].split('>').length > 1) {
    return email.split('<')[1].split('>')[0];
  }
  return email;
}


function extractOrderId(subject: string): string {
  try {
    return subject.split('[ЗАПРОС:')[1].split(']')[0].trim();
  } catch (error) {
    return '';
  }
}