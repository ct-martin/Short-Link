"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  hideError();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Error: Username or password is empty");
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  hideError();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Error: All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Error: Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    "form",
    { id: "loginForm", name: "loginForm",
      onSubmit: handleLogin,
      action: "/admin/login",
      method: "POST",
      className: "ui form"
    },
    React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        { htmlFor: "username" },
        "Username: "
      ),
      React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" })
    ),
    React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        { htmlFor: "pass" },
        "Password: "
      ),
      React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "placeholder" })
    ),
    React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
    React.createElement("input", { className: "ui button", type: "submit", value: "Sign in" })
  );
};

var SignupWindow = function SignupWindow(props) {
  return React.createElement(
    "form",
    { id: "signupForm",
      name: "signupForm",
      onSubmit: handleSignup,
      action: "/admin/signup",
      method: "POST",
      className: "ui form"
    },
    React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        { htmlFor: "username" },
        "Username: "
      ),
      React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" })
    ),
    React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        { htmlFor: "pass" },
        "Password: "
      ),
      React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" })
    ),
    React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        { htmlFor: "pass2" },
        "Password: "
      ),
      React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" })
    ),
    React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
    React.createElement("input", { className: "ui button", type: "submit", value: "Sign Up" })
  );
};

var createLoginWindow = function createLoginWindow() {
  $("nav a").removeClass("active");
  $("#loginButton").addClass("active");
  ReactDOM.render(React.createElement(LoginWindow, null), document.querySelector("main"));
};

var createSignupWindow = function createSignupWindow() {
  $("nav a").removeClass("active");
  $("#signupButton").addClass("active");
  ReactDOM.render(React.createElement(SignupWindow, null), document.querySelector("main"));
};

var createUI = function createUI() {
  ReactDOM.render(React.createElement(
    "div",
    null,
    React.createElement(
      "nav",
      { className: "ui top fixed menu" },
      React.createElement(
        "div",
        { className: "header item" },
        "S",
        React.createElement(
          "small",
          null,
          "hort"
        ),
        "-Link Page"
      ),
      React.createElement(
        "a",
        { id: "loginButton", className: "active item", onClick: createLoginWindow },
        "Login"
      ),
      React.createElement(
        "a",
        { id: "signupButton", className: "item", onClick: createSignupWindow },
        "Sign up"
      )
    ),
    React.createElement(
      "div",
      { className: "ui container" },
      React.createElement("div", { id: "error" }),
      React.createElement(
        "main",
        null,
        React.createElement(LoginWindow, null)
      )
    )
  ), document.querySelector("#content"));
};

var setup = function setup(csrfToken) {
  csrf = csrfToken;
  createUI(csrf); // default view
};

var getToken = function getToken() {
  sendAjax('GET', '/admin/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
var csrf = void 0;
"use strict";

var handleError = function handleError(message) {
  ReactDOM.render(React.createElement(
    "div",
    { className: "ui negative message" },
    React.createElement("i", { className: "close icon", onClick: hideError }),
    React.createElement(
      "div",
      { className: "header" },
      "Oops!"
    ),
    React.createElement(
      "p",
      null,
      message
    )
  ), document.querySelector("#error"));
  console.log("Error: " + message);
};

var handleForm = function handleForm(e, callback) {
  e.preventDefault();
  hideError();
  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), callback);
  return false;
};

var hideError = function hideError() {
  $("#error").empty();
};

var redirect = function redirect(response) {
  $("#error div").hide();
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
