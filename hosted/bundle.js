"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var handleShorten = function handleShorten(e) {
  e.preventDefault();

  if ($("#slug").val() == '' || $("#redirect").val() == '') {
    handleError("Error: All fields are required");
    return false;
  }

  handleForm(e, function () {
    ReactDOM.render(React.createElement(
      "div",
      { className: "ui positive message" },
      React.createElement("i", { className: "close icon", onClick: hideError }),
      React.createElement(
        "div",
        { className: "header" },
        "Success!"
      ),
      React.createElement(
        "p",
        null,
        "Link created! Your link will expire in 30 days."
      )
    ), document.querySelector("#error"));
  });
};

var handlePasswordChange = function handlePasswordChange(e) {
  e.preventDefault();

  if ($("#oldpassword").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Error: All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Error: Passwords do not match");
    return false;
  }

  handleForm(e, function () {
    ReactDOM.render(React.createElement(
      "div",
      { className: "ui positive message" },
      React.createElement("i", { className: "close icon", onClick: hideError }),
      React.createElement(
        "div",
        { className: "header" },
        "Success!"
      ),
      React.createElement(
        "p",
        null,
        "Your password has been changed."
      )
    ), document.querySelector("#error"));
  });
};

/*
const LinkForm = (props) => {
  if(!props.name) props.name = '';
  if(!props.title) props.title = '';
  if(!props.content) props.content = '';
  return (
    <div className="modal fade" id={"editModal-" + props.name} tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
      <form id="linkForm"
        onSubmit={handleLink}
        name="linkForm"
        action="/admin"
        method="POST"
        className="linkForm"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">Edit Link</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">URL slug</label>
                <input className="form-control" id="linkName" type="text" name="name" placeholder="home" value={props.name} />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input className="form-control" id="linkTitle" type="text" name="title" placeholder="Link Title" value={props.title} />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea className="form-control" id="linkContent" type="text" name="content" placeholder="Link Content (Markdown is supported)">{props.content}</textarea>
              </div>
              <input type="hidden" name="_csrf" value={props.csrf} />
            </div>
            <div className="modal-footer">
              <button type="button" className="d-none btn btn-danger" data-dismiss="modal">Delete</button>
              <input type="submit" className="btn btn-primary" value="Save" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
*/

var ShortenWindow = function ShortenWindow(props) {
  return React.createElement(
    "form",
    { id: "shortenForm", name: "shortenForm",
      onSubmit: handleShorten,
      action: "/admin",
      method: "POST",
      className: "ui form"
    },
    React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        null,
        "URL to Shorten"
      ),
      React.createElement("input", { type: "text", id: "redirect", name: "redirect", placeholder: "https://example.com/" })
    ),
    React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        null,
        "Shortened Slug"
      ),
      React.createElement(
        "div",
        { className: "ui labeled input" },
        React.createElement(
          "div",
          { className: "ui label" },
          window.location.hostname,
          "/"
        ),
        React.createElement("input", { type: "text", id: "slug", name: "slug", placeholder: "yourslug" })
      )
    ),
    React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
    React.createElement("input", { className: "ui button", type: "submit", value: "Shorten!" })
  );
};

var LinkStats = function LinkStats(props) {
  var total = 0,
      countries = [];
  var statNodes = props.stats.map(function (entry) {
    total++;
    if (!countries.includes(entry.country)) {
      countries.push(entry.country);
    }
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        null,
        entry.referrer
      ),
      React.createElement(
        "td",
        null,
        entry.country
      ),
      React.createElement(
        "td",
        null,
        entry.timestamp
      )
    );
  });
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "ui card", style: { width: '100%' } },
      React.createElement(
        "div",
        { className: "content" },
        React.createElement(
          "div",
          { className: "header" },
          "Stats for /",
          props.link.slug
        ),
        React.createElement(
          "div",
          { className: "meta" },
          props.link.redirect
        )
      )
    ),
    React.createElement(
      "div",
      { className: "ui statistics" },
      React.createElement(
        "div",
        { className: "statistic" },
        React.createElement(
          "div",
          { className: "value" },
          total
        ),
        React.createElement(
          "div",
          { className: "label" },
          "Total Clicks"
        )
      ),
      React.createElement(
        "div",
        { className: "statistic" },
        React.createElement(
          "div",
          { className: "value" },
          countries.length
        ),
        React.createElement(
          "div",
          { className: "label" },
          "Countries"
        )
      )
    ),
    React.createElement(
      "table",
      { className: "ui single line table" },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement(
            "th",
            null,
            "Referrer"
          ),
          React.createElement(
            "th",
            null,
            "Country*"
          ),
          React.createElement(
            "th",
            null,
            "Timestamp"
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        statNodes
      )
    ),
    React.createElement(
      "p",
      null,
      React.createElement(
        "i",
        null,
        "*: Country requires using Cloudflare w/ IP Geolocation turned on"
      )
    )
  );
};

var LinkItem = function (_React$Component) {
  _inherits(LinkItem, _React$Component);

  function LinkItem(props) {
    _classCallCheck(this, LinkItem);

    var _this = _possibleConstructorReturn(this, (LinkItem.__proto__ || Object.getPrototypeOf(LinkItem)).call(this, props));

    _this.viewStats = _this.viewStats.bind(_this);
    return _this;
  }

  _createClass(LinkItem, [{
    key: "viewStats",
    value: function viewStats() {
      createStatsWindow(this.props.slug);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "item" },
        React.createElement(
          "div",
          { className: "right floated content ui buttons" },
          React.createElement(
            "button",
            { className: "ui button", onClick: this.viewStats },
            "Stats"
          )
        ),
        React.createElement(
          "div",
          { className: "content" },
          React.createElement(
            "div",
            { className: "header" },
            "/",
            this.props.slug
          ),
          React.createElement(
            "p",
            null,
            "Links to ",
            this.props.redirect
          )
        )
      );
    }
  }]);

  return LinkItem;
}(React.Component);

;

var ViewWindow = function ViewWindow(props) {
  if (props.links.length === 0) {
    return React.createElement(
      "div",
      { className: "ui message" },
      React.createElement(
        "div",
        { className: "header" },
        "No links yet"
      ),
      React.createElement(
        "p",
        null,
        "Press \"Shorten URL\" above to get started!"
      )
    );
  }

  var linkNodes = props.links.map(function (link) {
    return React.createElement(LinkItem, { id: link._id, slug: link.slug, redirect: link.redirect });
  });

  return React.createElement(
    "div",
    { className: "ui middle aligned divided list" },
    linkNodes
  );
};

var SettingsWindow = function SettingsWindow(props) {
  return React.createElement(
    "form",
    { id: "passwordForm",
      name: "passwordForm",
      onSubmit: handlePasswordChange,
      action: "/admin/password",
      method: "POST",
      className: "ui form"
    },
    React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        { htmlFor: "oldpassword" },
        "Current Password: "
      ),
      React.createElement("input", { id: "user", type: "password", name: "oldpassword", placeholder: "oldpassword" })
    ),
    React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        { htmlFor: "pass" },
        "New Password: "
      ),
      React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" })
    ),
    React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        { htmlFor: "pass2" },
        "New Password: "
      ),
      React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" })
    ),
    React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
    React.createElement("input", { className: "ui button", type: "submit", value: "Change Password" })
  );
};

var createShortenWindow = function createShortenWindow() {
  $("nav a").removeClass("active");
  $("#shortenButton").addClass("active");
  ReactDOM.render(React.createElement(ShortenWindow, null), document.querySelector("main"));
};

var createViewWindow = function createViewWindow() {
  $("nav a").removeClass("active");
  $("#viewButton").addClass("active");
  sendAjax('GET', '/admin/getLinks', null, function (data) {
    ReactDOM.render(React.createElement(ViewWindow, { links: data.links }), document.querySelector("main"));
  });
};

var createStatsWindow = function createStatsWindow(slug) {
  sendAjax('GET', "/admin/getStats/" + slug, null, function (data) {
    ReactDOM.render(React.createElement(LinkStats, { link: data.link, stats: data.stats }), document.querySelector("main"));
  });
};

var createSettingsWindow = function createSettingsWindow() {
  $("nav a").removeClass("active");
  $("#settingsButton").addClass("active");
  ReactDOM.render(React.createElement(SettingsWindow, null), document.querySelector("main"));
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
        "URL Shortener"
      ),
      React.createElement(
        "a",
        { id: "shortenButton", className: "active item", onClick: createShortenWindow },
        "Shorten URL"
      ),
      React.createElement(
        "a",
        { id: "viewButton", className: "item", onClick: createViewWindow },
        "View your URLs"
      ),
      React.createElement(
        "div",
        { className: "right menu" },
        React.createElement(
          "a",
          { id: "settingsButton", className: "item", onClick: createSettingsWindow },
          "Settings"
        ),
        React.createElement(
          "a",
          { className: "item", href: "/admin/logout" },
          "Log out"
        )
      )
    ),
    React.createElement(
      "div",
      { className: "ui container" },
      React.createElement("div", { id: "error" }),
      React.createElement("main", null)
    )
  ), document.querySelector("#content"));
};

var setup = function setup(csrfToken) {
  csrf = csrfToken;

  createUI();
  createShortenWindow();
};

var getToken = function getToken() {
  sendAjax('GET', '/admin/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

var csrf = void 0;

$(document).ready(function () {
  getToken();
});
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
