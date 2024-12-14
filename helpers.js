import bcrypt from 'bcrypt';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateName = (name) => {
  return name.trim().length >= 2 && /^[a-zA-Z\s-]+$/.test(name);
};

export const validateUsername = (username) => {
  return username.trim().length >= 3 && /^[a-zA-Z0-9_-]+$/.test(username);
};

export const validateRole = (role) => {
  return ['user', 'admin'].includes(role);
};

export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
