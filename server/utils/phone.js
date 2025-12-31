function normalizePhone(phone) {
  if (!phone) {
    return phone;
  }

  if (phone.length > 7 && phone.startsWith('+')) {
    return phone.substring(1);
  }

  if (phone.length === 9) {
    return '998' + phone;
  }

  return phone;
}

module.exports = {
  normalizePhone,
};
