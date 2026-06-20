
const errorHandling = ((err, req, res, next) => {
  console.error(err.stack);
  err.statusCode = err.statusCode || 500;
  res.status(500).json({
    status: 500,
     message: "Page not found or template error", 
     error: err.message 
  });
  next();
});

export default errorHandling;