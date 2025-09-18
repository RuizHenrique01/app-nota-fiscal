import ContractDatabaseRepository from "../src/infra/repository/ContractDatabaseRepository";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import GenerateInvoices from "../src/application/usecase/GenerateInvoices";
import ContractRepository from "../src/application/repository/ContractRepository";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import CsvPresenter from "../src/infra/presenter/CsvPresenter";


let generateInvoices: GenerateInvoices;
let connection: DatabaseConnection;
let contractRepository: ContractRepository;

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
    contractRepository = new ContractDatabaseRepository(connection);
    generateInvoices = new GenerateInvoices(contractRepository);
});

test("Deve gerar as notas fiscais por regime de caixa", async function () {
    const input = {
        month: 1,
        year: 2022,
        type: "cash"
    } 
    const output = await generateInvoices.execute(input);
    expect(output.at(0)?.date).toEqual(new Date("2022-01-05T14:00:00.000Z"));
    expect(output.at(0)?.amount).toBe(6000);
});

test("Deve gear as notas fiscais por regime de competência por csv", async function () {
    const input = {
        month: 1,
        year: 2022,
        type: "accrual",
        format: "csv"
    } 
    const presenter = new CsvPresenter();
    generateInvoices = new GenerateInvoices(contractRepository, presenter);
    const output = await generateInvoices.execute(input);
    expect(output).toBe("2022-01-01;500");
});

test("Deve gerar as notas fiscais por regime de competência", async function () {
    const input = {
        month: 1,
        year: 2022,
        type: "accrual"
    } 
    const output = await generateInvoices.execute(input);
    expect(output.at(0)?.date).toEqual(new Date("2022-01-01T14:00:00.000Z"));
    expect(output.at(0)?.amount).toBe(500);
});

afterEach(async () => {
    await connection.close();
});