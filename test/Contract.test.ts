import Contract from "../src/Contract";
import Payment from "../src/Payment";

test("Deve calcular o saldo de um contrato", function () {
    const contract = new Contract("","", 6000, 12, new Date("2022-01-01T10:00:00"));
    contract.addPayment(new Payment("", 2000, new Date("2022-01-01T10:00:00")));
    expect(contract.getBalance()).toBe(4000);
});

test("Deve gerar as faturas de um contrato", function () {
    const contract = new Contract("","", 6000, 12, new Date("2022-01-01T10:00:00"));
    const invoices = contract.generateInvoices(1, 2022, "accrual");
    expect(invoices.at(0)?.date).toEqual(new Date("2022-01-01T14:00:00.000Z"));
    expect(invoices.at(0)?.amount).toBe(500);
});