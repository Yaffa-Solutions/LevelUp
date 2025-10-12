class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const errorHandler = (error, req, res, next) => {
  console.debug(error)
  res.status(error.status || 500).json({ error: error.message || "something went wrong"});
};

module.exports = { errorHandler, CustomError };