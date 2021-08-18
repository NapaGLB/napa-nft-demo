const formatNumber = (number: string, digits: number) => {
  if (number !== null && number !== undefined && digits) {
    const value = Number(number).toFixed(digits);
    if (value.includes('.00')) return Number(number).toFixed(0);
    return value;
  }
  return '';
};

export default formatNumber;
