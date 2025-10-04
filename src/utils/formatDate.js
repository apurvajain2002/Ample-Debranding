export function formatDate(dateString) {
  // Parse the date
  const date = new Date(dateString);

  // Extract day, month, and year from the date
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-based
  const year = date.getFullYear();

  // Construct the formatted date string in DD-MM-YYYY format
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}
