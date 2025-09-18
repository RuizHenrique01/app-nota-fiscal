import Usecase from "./Usecase";

export default class LoggerDecorator implements Usecase {
    constructor(
        readonly usecase: Usecase
    ) { }
    async execute(input: any): Promise<any> {
        console.log("User Aggent: " + input.userAgent);
        console.log("Host: " + input.host);
        return this.usecase.execute(input);
    }
}