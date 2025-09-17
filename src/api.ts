import express from "express";
import PgPromiseAdapter from "./PgPromiseAdapter";
import ContractDatabaseRepository from "./ContractDatabaseRepository";
import GenerateInvoices from "./GenerateInvoices";
import LoggerDecorator from "./LoggerDecorator";

const app = express();

const connection = new PgPromiseAdapter();
const contractRepository = new ContractDatabaseRepository(connection);
const generateInvoices = new LoggerDecorator(new GenerateInvoices(contractRepository));

app.use(express.json());

app.post("/generate_invoices", async (req, res) => {
    const input = req.body;
    input.userAgent = req.headers['user-agent'];
    input.host = req.headers['host'];
    const output = await generateInvoices.execute(input);
    res.json(output);
});

app.listen(3000);