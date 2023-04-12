class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

module.exports = {
  CustomError,
  BadRequestError,
};
