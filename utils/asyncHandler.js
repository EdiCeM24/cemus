import asyncWrapper from "express-async-handler";

const asyncHandler = (fn) => {
  return asyncWrapper(async (req, res, next) => {
    // Promise.resolve(fn(req, res, next)).catch(next);
    try {
      await fn(req, res, next);
    } catch (error) {
      next();
    }
  });
};

export default asyncHandler;
