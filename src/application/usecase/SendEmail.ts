import Usecase from "./Usecase";

export default class SendEmail implements Usecase {
    async execute(input: any): Promise<any> {
        console.log("Sending email: " + JSON.stringify(input));
    }
}