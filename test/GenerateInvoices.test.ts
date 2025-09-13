import ContractDatabaseRepository from "../src/ContractDatabaseRepository";
import ContractRepository from "../src/ContractRepository";
import DatabaseConnection from "../src/DatabaseConnection";
import GenerateInvoices from "../src/GenerateInvoices";
import PgPromiseAdapter from "../src/PgPromiseAdapter";

let generateInvoices: GenerateInvoices;
let connection: DatabaseConnection;

beforeEach(() => {
    // const contractRepository : ContractRepository = {
    //     async list(): Promise<any[]> {
    //         return [{
    //             id_contract: 1,
    //             date: new Date("2022-01-01T10:00:00"),
    //             amount: 6000,
    //             periods: 12,
    //             payments: [
    //                 { id_payment: 1, id_contract: 1, date: new Date("2022-01-05T10:00:00"), amount: 6000 }
    //             ]
    //         }];
    //     }
    // };

    connection = new PgPromiseAdapter();
    const contractRepository = new ContractDatabaseRepository(connection);
    generateInvoices = new GenerateInvoices(contractRepository);
});

test("Deve gerar as notas fiscais por regime de caixa", async function () {
    const input = {
        month: 1,
        year: 2022,
        type: "cash"
    } 
    const output = await generateInvoices.execute(input);
    expect(output.at(0)?.date).toBe("2022-01-05");
    expect(output.at(0)?.amount).toBe(6000);
});

test("Deve gerar as notas fiscais por regime de competência", async function () {
    const input = {
        month: 1,
        year: 2022,
        type: "accrual"
    } 
    const output = await generateInvoices.execute(input);
    expect(output.at(0)?.date).toBe("2022-01-01");
    expect(output.at(0)?.amount).toBe(500);
});

afterEach(async () => {
    await connection.close();
});