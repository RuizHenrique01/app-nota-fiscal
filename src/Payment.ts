export default class Payment {
    constructor(
        readonly idPayment: string,
        readonly amount: number,
        readonly date: Date
    ){}
}