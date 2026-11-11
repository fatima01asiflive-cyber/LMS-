class ErrorHandler extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        (Error as ErrorConstructor & {
            captureStackTrace: (targetObject: object, constructor?: Function) => void;
        }).captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;