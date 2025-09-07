import pgp from 'pg-promise';
import moment from 'moment';

export default class GenerateInvoices {
    async execute(input: Input): Promise<Output[]> {
        const connection = pgp()('postgres://postgres:root@localhost:5432/app');
        const contracts = await connection.any('SELECT * FROM branas.contract');
        const outputs: Output[] = [];
        for(const contract of contracts) {
            const payments = await connection.query("select * from branas.payment where id_contract = $1", [contract.id_contract]);
            for(const payment of payments) {
                if(input.type === "cash") {
                    if(payment.date.getMonth() + 1 !== input.month || payment.date.getFullYear() !== input.year) 
                        continue;
                    outputs.push({
                        date: moment(payment.date).format("YYYY-MM-DD"),
                        amount: parseFloat(payment.amount)
                    });
                }

                if(input.type === "accrual") {
                    let period = 0;
                    while(period <= contract.periods) {
                        const date = moment(contract.date).add(period++, 'months').toDate();
                        if(date.getMonth() + 1 !== input.month || date.getFullYear() !== input.year) 
                            continue;
                        outputs.push({
                            date: moment(date).format("YYYY-MM-DD"),
                            amount: parseFloat(contract.amount) / contract.periods
                        });
                    }
                }
            }
        }
        await connection.$pool.end();
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