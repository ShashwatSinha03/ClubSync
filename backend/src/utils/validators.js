export const validateSignup = ({ name, email, password }) => {
  if (!name || !email || !password) return false;
  if (password.length < 6) return false;
  return true;
};

export const validateLogin = ({ email, password }) => {
  if (!email || !password) return false;
  return true;
};
