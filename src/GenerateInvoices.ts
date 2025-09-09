import moment from 'moment';
import ContractDatabaseRepository from './ContractDatabaseRepository';

export default class GenerateInvoices {

    constructor(readonly contractRepository: ContractDatabaseRepository) {}

    async execute(input: Input): Promise<Output[]> {
        const outputs: Output[] = [];
        const contracts = await this.contractRepository.list();
        for (const contract of contracts) {
            if (input.type === "cash") {
                for (const payment of contract.payments) {
                    if (payment.date.getMonth() + 1 !== input.month || payment.date.getFullYear() !== input.year)
                        continue;
                    outputs.push({
                        date: moment(payment.date).format("YYYY-MM-DD"),
                        amount: parseFloat(payment.amount)
                    });
                }
            }

            if (input.type === "accrual") {
                let period = 0;
                while (period <= contract.periods) {
                    const date = moment(contract.date).add(period++, 'months').toDate();
                    if (date.getMonth() + 1 !== input.month || date.getFullYear() !== input.year)
                        continue;
                    outputs.push({
                        date: moment(date).format("YYYY-MM-DD"),
                        amount: parseFloat(contract.amount) / contract.periods
                    });
                }
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