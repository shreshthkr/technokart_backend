const express=require("express");
const invoiceRouter = express.Router();
const {InvoiceModel} = require("../models/invoice.model");


invoiceRouter.post("/add", async(req,res)=>{
    const {InvoiceDate,InvoiceNumber,InvoiceAmount}= req.body;
    try {
        const data = await InvoiceModel.findOne({InvoiceNumber:InvoiceNumber});
        if(data){
            res.status(401).send({"msg":"Invoice is already generated"});  
        }else{
            const invoice = new InvoiceModel({InvoiceDate,InvoiceNumber,InvoiceAmount});
       await invoice.save();
       res.status(200).send({"msg":"A new Invoice has been added"}); 
        }

      
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
});


invoiceRouter.get('/invoices', async (req,res) => {
    const {invoiceNumber, startDate, EndDate,startYear, endYear } = req.query;
    try {
        if(invoiceNumber){
          const invoicenumData =  await InvoiceModel.findOne({InvoiceNumber:invoiceNumber});
          res.status(200).send(invoicenumData);
        }
        else if(startDate && EndDate){
      
            const dateInvoice = await InvoiceModel.find({InvoiceDate: {
                $gte: new Date(startDate),
                $lte: new Date(EndDate)
            }})
                res.status(200).send(dateInvoice);
        }else if(startYear && endYear){
            const financialYear = await InvoiceModel.find({ $gte: new Date(`${startYear}-04-01`),
            $lte: new Date(`${endYear + 1}-03-31`),})
        }else{
            const allInvoices = await InvoiceModel.find();
            res.status(200).send({msg:"All invoices retrieved", allInvoices});
        }
     
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
})

invoiceRouter.put('/invoice/:id/', async (req, res) => {
    const invoiceId = req.params.id;
    const { newInvoiceNumber } = req.body;
  
    try {
      const existingInvoice = await InvoiceModel.findById(invoiceId);
  
      if (!existingInvoice) {
        return res.status(400).send({ msg: 'Invoice not found' });
      }
  
      existingInvoice.InvoiceNumber = newInvoiceNumber;
      await existingInvoice.save();
  
      res.status(200).send({ msg: 'Invoice number updated successfully', updatedInvoice: existingInvoice });
    } catch (error) {
      res.status(400).send({ msg: 'Error updating invoice number', error: error.message });
    }
  });

invoiceRouter.delete("/invoice/:id", async (req,res) => {
    const invoiceId = req.params.id;
    try {
        const deleteInvoice = await InvoiceModel.findByIdAndDelete(invoiceId);
        res.status(200).send({ msg: "Invoice deleted successfully", deleteInvoice });
    } catch (error) {
        res.status(400).send({ msg: "Error deleting Invoice", error: error.message });
    }
})







module.exports = {invoiceRouter};