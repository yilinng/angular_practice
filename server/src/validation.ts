import * as joi from "joi";

//Signup Valiation
const signupValidation = (data: any) => {
  const schema = joi.object({
    name: joi.string().min(6).required(),

    email:  joi.string().required().email(),

    password:  joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data: any) => {
  const schema = joi.object({
    email:  joi.string().required().email(),

    password:  joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const _signupValidation = signupValidation;
export { _signupValidation as signupValidation };
const _loginValidation = loginValidation;
export { _loginValidation as loginValidation };
