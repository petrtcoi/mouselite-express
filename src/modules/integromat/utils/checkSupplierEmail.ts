import SupplierEmail from "../../../models/supplierEmail";

export async function checkSupplierEmail(emailId: string): Promise<boolean> {

  try {
    const supplierEmailEntity = await SupplierEmail.findOne({ emailId: emailId });
    if (supplierEmailEntity) return true;
    await SupplierEmail.create({ emailId: emailId, attachments: [] });
    return true;
  } catch (error) {
    return false;
  }
}