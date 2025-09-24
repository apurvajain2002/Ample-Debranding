const handleTime = (name, callback, defaultTime) => {
  const timepicker = document.getElementById(name);

  const options = {
    defaultTime: defaultTime,
    twelveHour: false, // Set to true for 12-hour format
    onCloseEnd: function () {
      const selectedTime = timepicker.value;
      callback({ name: name, time: selectedTime });
      // You can store the selected time in state or perform any other actions here
      instance.destroy();
    },
  };

  // Initialize the Materialize CSS timepicker with the options
  const instance = window.M.Timepicker.init(timepicker, options);
  instance.open();
};

export default handleTime;
