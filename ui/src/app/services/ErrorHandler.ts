interface Error {
    message: string;
}

export default class ErrorHandler {
    errorMessage: string = "";
    constructor(error: Error) {
        this.errorMessage = error.message;
    }
    get message():string {
        return this.errorMessage;
    }
}
