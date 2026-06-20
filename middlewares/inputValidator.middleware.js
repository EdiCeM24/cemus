import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  username: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  profile: Joi.string().required(),
});

const validateUser = async (req, res, next) => {
  const { error } = await userSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,

      error: error.details[0].message,
    });
  next();
};

export default validateUser;
