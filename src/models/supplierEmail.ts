import mongoose from 'mongoose';


type SupplierEmailType = {
    emailId: string;
    orderId: string;
    text: string;
    subject: string;
    html: string;
    emailFrom: string;
    emailTo: string;
    attachments: [
        { name: string, webViewLink: string, webContentLink: string; }
    ];
};

const schema = new mongoose.Schema<SupplierEmailType>({
    emailId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: false,
    },
    text: {
        type: String,
        required: false,
    },
    subject: {
        type: String,
        required: false,
    },
    emailFrom: {
        type: String,
        required: false,
    },
    emailTo: {
        type: String,
        required: false,
    },
    attachments: {
        type: [{
            name: String,
            webViewLink: String,
            webContentLink: String
        }]
    },
}, {
    timestamps: true,
    versionKey: false
});

const SupplierEmail = mongoose.model('supplierEmail', schema);

export default SupplierEmail;
export type { SupplierEmailType };