export const cookies = {

  getOptions: () => ({ //paranthesis(instead of curly braces) means we return this object using this method
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15*60*1000, //set to 15 minutes (in miliseconds)
  }),

  set: (res, name, value, options={}) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },

  clear: (res, name, options={}) => {
    res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },

  get: (req, name) => {
    return req.cookies[name];
  }
    
    
};