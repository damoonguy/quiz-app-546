import bcrypt from 'bcrypt';

export const validateEmail = (email) => {
  if (!email.includes('@')) return false;
  
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return false;
  if (!domain.includes('.')) return false;
  
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  if (parts[0].includes(' ') || parts[1].includes(' ')) return false;
  
  return true;
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateName = (name) => {
  const trimmedName = name.trim();
  if (trimmedName.length < 2) return false;
  
  const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ- ';
  for (const char of trimmedName) {
    if (!validChars.includes(char)) return false;
  }
  
  return true;
};

export const validateUsername = (username) => {
  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3) return false;
  
  const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
  for (const char of trimmedUsername) {
    if (!validChars.includes(char)) return false;
  }
  
  return true;
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
