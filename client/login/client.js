const handleLogin = (e) => {
  e.preventDefault();

  hideError();

  if($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Error: Username or password is empty");
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  hideError();

  if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Error: All fields are required");
    return false;
  }

  if($("#pass").val() !== $("#pass2").val()) {
    handleError("Error: Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

const LoginWindow = (props) => {
  return (
    <form id="loginForm" name="loginForm"
      onSubmit={handleLogin}
      action="/admin/login"
      method="POST"
      className="ui form"
    >
      <div className="field">
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username" />
      </div>
      <div className="field">
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="placeholder" />
      </div>
      <input type="hidden" name="_csrf" value={csrf} />
      <input className="ui button" type="submit" value="Sign in" />
    </form>
  );
};

const SignupWindow = (props) => {
  return (
    <form id="signupForm"
      name="signupForm"
      onSubmit={handleSignup}
      action="/admin/signup"
      method="POST"
      className="ui form"
    >
      <div className="field">
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username" />
      </div>
      <div className="field">
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" />
      </div>
      <div className="field">
        <label htmlFor="pass2">Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      </div>
      <input type="hidden" name="_csrf" value={csrf} />
      <input className="ui button" type="submit" value="Sign Up" />
    </form>
  );
};

const createLoginWindow = () => {
  $("nav a").removeClass("active");
  $("#loginButton").addClass("active");
  ReactDOM.render(
    <LoginWindow />,
    document.querySelector("main")
  );
};

const createSignupWindow = () => {
  $("nav a").removeClass("active");
  $("#signupButton").addClass("active");
  ReactDOM.render(
    <SignupWindow />,
    document.querySelector("main")
  );
};

const createUI = () => {
  ReactDOM.render(
    <div>
      <nav className="ui top fixed menu">
        <div className="header item">URL Shortener</div>
        <a id="loginButton" className="active item" onClick={createLoginWindow}>
          Login
        </a>
        <a id="signupButton" className="item" onClick={createSignupWindow}>
          Sign up
        </a>
      </nav>
      <div className="ui container">
        <div id="error"></div>
        <main>
          <LoginWindow />
        </main>
      </div>
    </div>,
    document.querySelector("#content")
  );
};

const setup = (csrfToken) => {
  csrf = csrfToken;
  createUI(csrf); // default view
};

const getToken = () => {
  sendAjax('GET', '/admin/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
let csrf;
