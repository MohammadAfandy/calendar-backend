class HttpError extends Error {
  code: number;
  data: any;
  constructor(message: string, errData: any = {}, code: number) {
    super(message);
    this.code = code;
    this.data = errData;
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Not Found', errData: any = {}) {
    super(message, errData, 404);
  }
}

class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', errData: any = {}) {
    super(message, errData, 400);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', errData: any = {}) {
    super(message, errData, 401);
  }
}

class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', errData: any = {}) {
    super(message, errData, 403);
  }
}

class ValidationError extends HttpError {
  constructor(message = 'Validation Fail', errData: any = {}) {
    super(message, errData, 422);
  }
}

export {
  HttpError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
};
