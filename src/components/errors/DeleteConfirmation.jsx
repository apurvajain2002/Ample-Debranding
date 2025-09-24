import React from "react";

const DeleteConfirmation = () => {
  return (
    <div class="row ">
      <aside class="col xl6 l6 m6 s12">
        <div class="errorme-wr">
          <div class="error-img">
            <img src="images/error-img/login-faliur.svg" alt="" />
          </div>
          <h3>DELETE CONFIRMATION</h3>
          <p>
            Just double-checking, Are we saying goodbye to this ? If yes, hit
            'Confirm'
          </p>
          <button class="btn waves-effect waves-light btn-success btn-defult">
            No
          </button>
          <button class="btn waves-effect waves-light btn-success btn-defult">
            Yes
          </button>
        </div>
      </aside>
    </div>
  );
};

export default DeleteConfirmation;
