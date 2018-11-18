const handleError = (message) => {
  ReactDOM.render(
    <div className="ui negative message">
      <i className="close icon" onClick={hideError}></i>
      <div className="header">
        Oops!
      </div>
      <p>{message}</p>
    </div>,
    document.querySelector("#error")
  );
  console.log(`Error: ${message}`);
};

const handleForm = (e, callback) => {
  e.preventDefault();
  hideError();
  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), callback);
  return false;
};

const hideError = () => {
  $("#error").empty();
}

const redirect = (response) => {
  $("#error div").hide();
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
