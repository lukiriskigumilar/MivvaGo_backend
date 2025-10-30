import express from "express";

const validateContentType = (req, res, next) => {
  const method = req.method;
  const contentType = req.headers["content-type"];
  const methodsToCheck = ["POST", "PUT", "PATCH"];
  const contentLength = parseInt(req.headers["content-length"], 10) || 0;

  if (methodsToCheck.includes(method) && contentLength > 0) {
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(415).json({
        statusCode: 415,
        status: "error",
        message:
          "Unsupported Media Type. Content-Type must be application/json",
      });
    }
  }
  next();
};

// Tambahkan express.json() di awal pipeline
const jsonParser = express.json();

// Middleware error handler untuk JSON parsing
const jsonErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      statusCode: 400,
      status: "error",
      message: "Invalid JSON format. Please check your request body.",
    });
  }
  next(err);
};

export { validateContentType, jsonParser, jsonErrorHandler };
