import moment from "moment";
import Contract from "./Contract";
import Invoice from "./Invoice";
import InvoiceGenerationStrategy from "./InvoiceGenerationStrategy";

export default class AccrualBasisStrategy implements InvoiceGenerationStrategy {
    generate(contract: Contract, month: number, year: number): Invoice[] {
        const invoices: Invoice[] = [];
        let period = 0;
        while (period <= contract.periods) {
            const date = moment(contract.date).add(period++, 'months').toDate();
            if (date.getMonth() + 1 !== month || date.getFullYear() !== year)
                continue;
            const invoice = new Invoice(
                date,
                contract.amount / contract.periods);
            invoices.push(invoice);
        }
        return invoices;
    }
}