const mongoose = require("mongoose");

// Invoice Schema
const invoiceSchema = mongoose.Schema(
  {
    InvoiceDate: {
      type: Date,
      required: true,
    },
    InvoiceNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    InvoiceAmount: {
      type: Number,
      required: true,
    },
    
  },
  { versionKey: false 
});

const InvoiceModel = mongoose.model("Invoice", invoiceSchema);

module.exports = { InvoiceModel };
