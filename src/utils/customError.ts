export class AppError extends Error{
    errorCode: any;
    statusCode: any;
    constructor(message:any,statusCode:any){
        super(message)
        this.statusCode=statusCode
    }
}
