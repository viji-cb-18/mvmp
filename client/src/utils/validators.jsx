export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const validatePassword = (password) =>
  password.length >= 6 && /\d/.test(password);

export const passwordsMatch = (pass1, pass2) => pass1 === pass2;
