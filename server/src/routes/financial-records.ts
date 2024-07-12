import express, {Request, Response} from "express";
import FinancialRecordModel from "../schema/financial-record";

const router = express.Router(); 

router.get('/getAllByUserID/:userId', async(req: Request, res: Response) => {
    try{
        const userId = req.params.userId;
        const records = await FinancialRecordModel.find({userId});
        if(records.length === 0){
            return res.status(404).json({message: "No records found"});
        }
        return res.status(200).send(records);
    }
    catch(err){
        return res.status(500).send(err);
    }
})

router.post("/", async(req: Request, res: Response) => {
    try{
        const newRecordBody = req.body;
        const newRecord = await FinancialRecordModel.create(newRecordBody);
        return res.status(201).send(newRecord);
    }
    catch(err){
        res.status(400).send(err);
    }
})

router.put("/:id", async(req: Request, res: Response) => {
    try{
        const id = req.params.id; 
        const newRecordBody = req.body; 
        const record = await FinancialRecordModel.findByIdAndUpdate(id, newRecordBody, {new: true}); 
        if(!record){
            return res.status(404).send(record);
        }
        res.status(200).send(record);
    }
    catch(err){
        res.status(500).send(err);
    }
});

router.delete("/:id", async(req: Request, res: Response) => {
    try{
        const id = req.params.id; 
        const record = await FinancialRecordModel.findByIdAndDelete(id);
        if(!record){
            return res.status(404).send(record);
        }
        res.status(200).send(record);
    }
    catch(err){
        res.status(500).send(err);
    }
});
export default router;