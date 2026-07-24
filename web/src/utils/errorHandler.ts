export default class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Maintains proper stack trace for where the error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}