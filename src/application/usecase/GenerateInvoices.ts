import JsonPresenter from '../../infra/presenter/JsonPresenter';
import Presenter from '../presenter/Presenter';
import ContractRepository from '../repository/ContractRepository';
import Usecase from './Usecase';

export default class GenerateInvoices implements Usecase {

    constructor(
        readonly contractRepository: ContractRepository,
        readonly presenter: Presenter = new JsonPresenter()
    ) { }

    async execute(input: Input): Promise<any> {
        const outputs: Output[] = [];
        const contracts = await this.contractRepository.list();
        for (const contract of contracts) {
            const invoices = contract.generateInvoices(input.month, input.year, input.type);
            for (const invoice of invoices) {
                outputs.push({
                    date: invoice.date,
                    amount: invoice.amount
                });
            }
        }
        return this.presenter.present(outputs);
    }
}

type Input = {
    month: number,
    year: number,
    type: string,
    format?: string,
    userAgent?: string,
    host?: string
}

export type Output = {
    date: Date,
    amount: number
}