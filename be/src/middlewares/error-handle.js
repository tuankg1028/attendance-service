import { CustomError } from "../utils/errors";

function errorHandler(err, req, res, next) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal Server Error" });
}

module.exports = { errorHandler };
