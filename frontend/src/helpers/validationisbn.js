const isValidISBN = (isbn) => {
  // Remove any hyphens or spaces from the input
  const cleanedISBN = isbn.replace(/[-\s]/g, '');

  // Check if the cleaned ISBN matches the pattern for either 10-digit or 13-digit ISBN
  const isbnPattern = /^(?:\d{9}[\dXx]|\d{13})$/;

  // Test the ISBN against the pattern
  return isbnPattern.test(cleanedISBN);
};

export default { isValidISBN };
