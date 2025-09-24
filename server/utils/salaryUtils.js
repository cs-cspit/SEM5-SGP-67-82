/**
 * Utility functions for salary calculations and formatting
 */

/**
 * Rounds salary values using custom logic:
 * - If decimal >= 0.5, round up to next whole number
 * - If decimal < 0.5, round down to current whole number
 * @param {number} amount - The salary amount to round
 * @returns {number} - The rounded salary amount as a whole number
 */
export const roundSalary = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 0;
  }
  
  const integerPart = Math.floor(amount);
  const decimalPart = amount - integerPart;
  
  if (decimalPart >= 0.5) {
    return integerPart + 1; // Round up
  } else {
    return integerPart; // Round down
  }
};

/**
 * Formats salary for display with currency symbol
 * @param {number} amount - The salary amount
 * @param {string} currency - Currency symbol (default: '₹')
 * @returns {string} - Formatted salary string
 */
export const formatSalary = (amount, currency = '₹') => {
  const rounded = roundSalary(amount);
  return `${currency}${rounded}`;
};

/**
 * Calculates total salary from an array of salary amounts with proper rounding
 * @param {Array<number>} salaryArray - Array of individual salary amounts
 * @returns {number} - Total rounded salary
 */
export const calculateTotalSalary = (salaryArray) => {
  if (!Array.isArray(salaryArray)) {
    return 0;
  }
  
  const total = salaryArray.reduce((sum, salary) => {
    return sum + (typeof salary === 'number' ? salary : 0);
  }, 0);
  
  return roundSalary(total);
};