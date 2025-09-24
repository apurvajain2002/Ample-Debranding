const handleDate = (name, callback, selectedDate, { minDate, maxDate } = {}) => {
  const datepicker = document.getElementById(name);
  // Helper function to format Date objects as "yyyy-mm-dd"
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Options for the date picker initialization
  const options = {
    minDate: minDate || null,  // Use minDate directly without parsing
    maxDate: maxDate || null,
    defaultDate: selectedDate, 
    setDefaultDate: !!selectedDate,
    format: "yyyy-mm-dd",
    showClearBtn: true,
    onClose: function () {
      const instance = window.M.Datepicker.getInstance(datepicker); 
      const selectedDateObj = instance.date;  // Retrieve the selected date from the instance

      if (selectedDateObj) {
        const formattedDate = formatDate(selectedDateObj); // Format the selected date
        datepicker.value = formattedDate; 
        callback({ name: name, date: formattedDate });
      }
      // Destroy the instance after the date has been selected and handled
      instance.destroy();
    },
  };

  const instance = window.M.Datepicker.init(datepicker, options);
  instance.open();
};


export default handleDate;
