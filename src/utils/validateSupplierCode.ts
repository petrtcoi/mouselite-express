import Supplier from '../models/supplier.model'

type ValidateSupplierCodeProps = { supplierCode: string }
const validateSupplierCode = async({ supplierCode }: ValidateSupplierCodeProps): Promise<boolean> => {
    const supplier = await Supplier.findOne({code: supplierCode})
    return supplier === null ? false : true
}

export default validateSupplierCode