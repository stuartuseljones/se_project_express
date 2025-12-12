const errorHandler = (err, req, res, next) => {
  console.error(err);
  let error = {
    message: err.message || "Internal Server Error",
    status: err.statusCode || 500,
  };

  // Handle specific error types
  if (err.name === "ValidationError") {
    error.message = "Invalid data provided";
    error.status = 400;
  }

  if (err.name === "CastError") {
    error.message = "Invalid ID format";
    error.status = 400;
  }

  if (err.code === 11000) {
    error.message = "Email already exists";
    error.status = 409;
  }

  // Send error response
  res.status(error.status).json({
    message: error.message,
  });
};

module.exports = errorHandler;
