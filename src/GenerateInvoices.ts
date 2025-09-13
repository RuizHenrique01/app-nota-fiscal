import moment from 'moment';
import ContractDatabaseRepository from './ContractDatabaseRepository';

export default class GenerateInvoices {

    constructor(readonly contractRepository: ContractDatabaseRepository) {}

    async execute(input: Input): Promise<Output[]> {
        const outputs: Output[] = [];
        const contracts = await this.contractRepository.list();
        for (const contract of contracts) {
            const invoices = contract.generateInvoices(input.month, input.year, input.type);
            for (const invoice of invoices) {
                outputs.push({
                    date: moment(invoice.date).format("YYYY-MM-DD"),
                    amount: invoice.amount
                });
            }
        }
        return outputs;
    }
}

type Input = {
    month: number,
    year: number,
    type: string
}

type Output = {
    date: string,
    amount: number
}