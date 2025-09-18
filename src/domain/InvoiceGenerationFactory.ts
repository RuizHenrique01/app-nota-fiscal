import AccrualBasisStrategy from "./AccrualBasisStrategy";
import CashBasisStrategy from "./CashBasisStrategy";
import InvoiceGenerationStrategy from "./InvoiceGenerationStrategy";

export default class InvoiceGenerationFactory {
    static create(type: string): InvoiceGenerationStrategy {
        if (type === "accrual") {
            return new AccrualBasisStrategy();
        } else if (type === "cash") {
            return new CashBasisStrategy();
        }
        throw new Error(`Unknown invoice generation type: ${type}`);
    }
}