export class DialogMessage {
    message: string;
    responseType: string;

    /**
     *
     */
    constructor(message: string, responseType: string) {
        this.message = message;
        this.responseType = responseType;
    }
}
