import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useState, useEffect } from "react";

export interface FinancialRecord {
    _id?: string;
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
 }

interface FinancialRecordsContextType{
    records: FinancialRecord[];
    addRecord: (record: FinancialRecord) => void; 
    updateRecord: (id: string, newRecord: FinancialRecord) => void;
    deleteRecord: (id: string) => void;
}

export const FinancialRecordContext = createContext<FinancialRecordsContextType | undefined>(undefined);

export const FinancialRecordsProvider = ({children}: {children: React.ReactNode}) => {

    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const { user } = useUser();


    const fetchRecords = async () => {
        const response = await fetch(`http://localhost:3000/financial-records/getAllByUserID/${user?.id}`);
        if(response.ok){
            const records = await response.json();
            setRecords(records);
        }
        else{
            console.error('Failed to fetch records');
        }
    }

    useEffect(() => {
        fetchRecords();
    }, [user]);


    const addRecord = async (record: FinancialRecord) => {
       const repsonse  = await fetch('http://localhost:3000/financial-records',{
            method: "POST", 
            body: JSON.stringify(record), 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(repsonse.ok){
            const newRecord = await repsonse.json();
            setRecords([...records, newRecord]);
        }
        else{
            console.error('Failed to add record');
        }
    }

    const updateRecord = async (id: string, newRecord: FinancialRecord) => {
        const response = await fetch(`http://localhost:3000/financial-records/${id}`, {
            method: "PUT", 
            body: JSON.stringify(newRecord),
            headers: {
                "Content-Type": "application/json",
            },
        })

        try{
            if(response.ok){
                const newRecord = await response.json();
                setRecords((prev) => prev.map((record) => {
                    if(record._id === id){
                        return newRecord;
                    }
                    else{
                        return record;
                    }
                }))
            }
        }catch(err){
            throw new Error('Invalid Update');
        }
    }

    const deleteRecord = async(id: string) => {
        const response = await fetch(
            `http://localhost:3000/financial-records/${id}`,
         {
            method:'DELETE',
        });
        try{
            if(response.ok){
                const deleteRecord = await response.json();
                setRecords((prev) => prev.filter((record) => record._id !== deleteRecord._id));
            }
        }
        catch(err){
            throw new Error('Not able to delete');
        }
    }
 
    return <FinancialRecordContext.Provider value={{records, addRecord, updateRecord, deleteRecord}}>
        {children}
    </FinancialRecordContext.Provider>
}


export const useFinancialRecords = () => {
    const context = useContext<FinancialRecordsContextType | undefined>(FinancialRecordContext);
    if(!context){
        throw new Error('useFinancialRecords must be used within a FinancialRecordsProvider');
    }
    return context;
}