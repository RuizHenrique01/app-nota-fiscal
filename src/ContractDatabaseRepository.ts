import Contract from "./Contract";
import ContractRepository from "./ContractRepository";
import DatabaseConnection from "./DatabaseConnection";
import Payment from "./Payment";

export default class ContractDatabaseRepository implements ContractRepository {

    constructor(readonly connection: DatabaseConnection) {}

    async list(): Promise<Contract[]> {
        const contracts: Contract[] = [];
        const contractsData = await this.connection.query('SELECT * FROM branas.contract', []);
        for(const contractData of contractsData) {
            const contract = new Contract(
                contractData.id_contract,
                contractData.description,
                parseFloat(contractData.amount),
                contractData.periods,
                contractData.date
            );
            const paymentsData = await this.connection.query("select * from branas.payment where id_contract = $1", [contractData.id_contract]);
            for(const paymentData of paymentsData) {
                const payment = new Payment(
                    paymentData.id_payment,
                    parseFloat(paymentData.amount),
                    paymentData.date
                );
                contract.addPayment(payment);
            }
            contracts.push(contract);
        }
        return contracts;
    }
}

