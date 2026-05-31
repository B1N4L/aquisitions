import logger from '#config/logger.js';
import {signupSchema, format} from "#validations/auth.validation.js";

export const signUp = async (req, res, next) => {
  try{
      const validationResult = signupSchema.safeParse(req.body);
      if(!validationResult.success){
          return res.status(400).json({
              error: 'Validation failed',
              details: formatValidationError
          })
      }
  } catch(e){
    logger.error('SignUp error', e);
    if(e.message === 'User with this email already exists'){
      return res.status(409).json({error: 'Email already exists'});
    }

    next(e);
  }
};