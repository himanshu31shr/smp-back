module.exports.emailValidator = (email) => {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$/.test(email);
}

module.exports.generateRandomCode = (len = 10) => {
  let code = '';
  const digits = '0123456789';

  // Generate 10 random digits
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    code += digits.charAt(randomIndex);
  }

  return code;
}
