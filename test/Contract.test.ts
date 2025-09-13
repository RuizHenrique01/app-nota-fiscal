import Contract from "../src/Contract";

test("Deve gerar as faturas de um contrato", function () {
    const contract = new Contract("","", 6000, 12, new Date("2022-01-01T10:00:00"));
    const invoices = contract.generateInvoices(1, 2022, "accrual");
    expect(invoices.at(0)?.date).toEqual(new Date("2022-01-01T14:00:00.000Z"));
    expect(invoices.at(0)?.amount).toBe(500);
});