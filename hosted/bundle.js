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

  if (!$("#slug").val().toLowerCase().match(/[a-z0-9-]+/)) {
    handleError("Error: Only the hyphen (-) and alphanumeric characters are allowed in the slug.");
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

var LinkStatsTable = function LinkStatsTable(props) {
  var statNodes = props.stats.map(function (entry) {
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        { "data-tooltip": entry.timestamp, "data-potision": "bottom left" },
        new Date(entry.timestamp).toLocaleString()
      ),
      React.createElement(
        "td",
        null,
        entry.uaParsed.browser
      ),
      React.createElement(
        "td",
        null,
        entry.uaParsed.platform
      ),
      React.createElement(
        "td",
        null,
        entry.uaParsed.isMobile ? 'YES' : 'NO'
      ),
      React.createElement(
        "td",
        null,
        entry.uaParsed.isBot ? 'YES' : 'NO'
      ),
      React.createElement(
        "td",
        null,
        entry.country.toUpperCase()
      ),
      React.createElement(
        "td",
        null,
        entry.referrer
      )
    );
  });
  return React.createElement(
    "div",
    null,
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
            "Timestamp"
          ),
          React.createElement(
            "th",
            null,
            "Browser"
          ),
          React.createElement(
            "th",
            null,
            "Platform"
          ),
          React.createElement(
            "th",
            null,
            "Mobile"
          ),
          React.createElement(
            "th",
            null,
            "Bot"
          ),
          React.createElement(
            "th",
            null,
            "Country*"
          ),
          React.createElement(
            "th",
            null,
            "Referrer"
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
        "*: Country requires using Cloudflare w/ IP Geolocation turned on. \"XX\" means unknown."
      )
    )
  );
};

var LinkStatsCharts = function (_React$Component) {
  _inherits(LinkStatsCharts, _React$Component);

  function LinkStatsCharts(props) {
    _classCallCheck(this, LinkStatsCharts);

    var _this = _possibleConstructorReturn(this, (LinkStatsCharts.__proto__ || Object.getPrototypeOf(LinkStatsCharts)).call(this, props));

    _this.draw = _this.draw.bind(_this);

    _this.total = 0;
    _this.unknown = 0;
    _this.mobile = 0;
    _this.countries = {};
    _this.browsers = {};
    _this.platforms = {};
    _this.props.stats.forEach(function (entry) {
      _this.total++;
      if (entry.ua === '') {
        _this.unknown++;
      }
      if (entry.uaParsed.isMobile) {
        _this.mobile++;
      }
      if (entry.uaParsed.isBot) {
        _this.bot++;
      }
      if (!_this.countries.hasOwnProperty(entry.country)) {
        _this.countries[entry.country] = 1;
      } else {
        _this.countries[entry.country]++;
      }
      if (!_this.browsers.hasOwnProperty(entry.uaParsed.browser)) {
        _this.browsers[entry.uaParsed.browser] = 1;
      } else {
        _this.browsers[entry.uaParsed.browser]++;
      }
      if (!_this.platforms.hasOwnProperty(entry.uaParsed.platform)) {
        _this.platforms[entry.uaParsed.platform] = 1;
      } else {
        _this.platforms[entry.uaParsed.platform]++;
      }
    });
    _this.mobilePercent = Math.round(_this.mobile / _this.total * 100);
    return _this;
  }

  _createClass(LinkStatsCharts, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.draw();
    }
  }, {
    key: "draw",
    value: function draw() {
      var canvasCoT = document.querySelector('#statChartClicksOverTime');
      var ctxCoT = canvasCoT.getContext('2d');
      var chartCoT = new Chart(ctxCoT, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Total Clicks',
            data: this.props.stats.map(function (item) {
              return { x: new Date(item.timestamp), y: 1 };
            }),
            backgroundColor: 'rgba(0,0,0,0.87)'
          }]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'hour'
              }
            }],
            yAxes: [{
              ticks: {
                min: 0,
                suggestedMax: 1.1
              }
            }]
          }
        }
      });
      var colors = ['#21ba45', '#db2828', '#2185d0', '#fbbd08', '#6435c9', '#00b5ad', '#767676'];
      var canvasCountries = document.querySelector('#statChartCountries');
      var ctxCountries = canvasCountries.getContext('2d');
      var chartCountries = new Chart(ctxCountries, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: Object.entries(this.countries).map(function (item) {
              return item[1];
            }),
            backgroundColor: colors
          }],
          labels: Object.entries(this.countries).map(function (item) {
            return item[0].toUpperCase();
          })
        }
      });
      var canvasBrowsers = document.querySelector('#statChartBrowsers');
      var ctxBrowsers = canvasBrowsers.getContext('2d');
      var chartBrowsers = new Chart(ctxBrowsers, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: Object.entries(this.browsers).map(function (item) {
              return item[1];
            }),
            backgroundColor: colors
          }],
          labels: Object.entries(this.browsers).map(function (item) {
            return item[0];
          })
        }
      });
      var canvasPlatforms = document.querySelector('#statChartPlatforms');
      var ctxPlatforms = canvasPlatforms.getContext('2d');
      var chartPlatforms = new Chart(ctxPlatforms, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: Object.entries(this.platforms).map(function (item) {
              return item[1];
            }),
            backgroundColor: colors
          }],
          labels: Object.entries(this.platforms).map(function (item) {
            return item[0];
          })
        }
      });
      var canvasMobileUsers = document.querySelector('#statChartMobileUsers');
      var ctxMobileUsers = canvasMobileUsers.getContext('2d');
      var chartMobileUsers = new Chart(ctxMobileUsers, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [this.mobilePercent, 100 - this.mobilePercent],
            backgroundColor: colors
          }],
          labels: ['Mobile Users', 'Non-Mobile Users']
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "ui statistics" },
          React.createElement(
            "div",
            { className: "statistic" },
            React.createElement(
              "div",
              { className: "value" },
              this.total
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
              Object.keys(this.countries).length
            ),
            React.createElement(
              "div",
              { className: "label" },
              "Countries"
            )
          ),
          React.createElement(
            "div",
            { className: "statistic" },
            React.createElement(
              "div",
              { className: "value" },
              this.mobilePercent,
              "%"
            ),
            React.createElement(
              "div",
              { className: "label" },
              "Mobile Users"
            )
          ),
          React.createElement(
            "div",
            { className: "statistic" },
            React.createElement(
              "div",
              { className: "value" },
              Object.keys(this.browsers).length
            ),
            React.createElement(
              "div",
              { className: "label" },
              "Browsers"
            )
          ),
          React.createElement(
            "div",
            { className: "statistic" },
            React.createElement(
              "div",
              { className: "value" },
              Object.keys(this.platforms).length
            ),
            React.createElement(
              "div",
              { className: "label" },
              "Platforms"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "doubling ui grid" },
          React.createElement(
            "div",
            { className: "sixteen wide column" },
            React.createElement("canvas", { id: "statChartClicksOverTime", style: { width: '100%', height: '200px' } })
          ),
          React.createElement(
            "div",
            { className: "eight wide column" },
            React.createElement("canvas", { id: "statChartCountries", style: { width: '100%', height: '200px' } })
          ),
          React.createElement(
            "div",
            { className: "eight wide column" },
            React.createElement("canvas", { id: "statChartMobileUsers", style: { width: '100%', height: '200px' } })
          ),
          React.createElement(
            "div",
            { className: "eight wide column" },
            React.createElement("canvas", { id: "statChartBrowsers", style: { width: '100%', height: '200px' } })
          ),
          React.createElement(
            "div",
            { className: "eight wide column" },
            React.createElement("canvas", { id: "statChartPlatforms", style: { width: '100%', height: '200px' } })
          )
        )
      );
    }
  }]);

  return LinkStatsCharts;
}(React.Component);

;

var LinkStatsCSV = function LinkStatsCSV(props) {
  var statNodes = props.stats.map(function (entry) {
    return entry.timestamp + ",\"" + entry.ua + "\",\"" + entry.country.toUpperCase() + "\",\"" + entry.referrer + "\"";
  });
  statNodes.unshift("Timestamp,UA,Country,Referrer");
  return React.createElement(
    "div",
    { className: "ui form" },
    React.createElement(
      "div",
      { className: "field" },
      React.createElement("textarea", { readonly: true, value: statNodes.join("\n") })
    )
  );
};

var LinkStats = function (_React$Component2) {
  _inherits(LinkStats, _React$Component2);

  function LinkStats(props) {
    _classCallCheck(this, LinkStats);

    var _this2 = _possibleConstructorReturn(this, (LinkStats.__proto__ || Object.getPrototypeOf(LinkStats)).call(this, props));

    _this2.viewChart = _this2.viewChart.bind(_this2);
    _this2.viewTable = _this2.viewTable.bind(_this2);
    _this2.viewCSV = _this2.viewCSV.bind(_this2);
    _this2.timedData = _this2.props.link.timedEnd ? React.createElement(
      "p",
      null,
      "Open ",
      new Date(_this2.props.link.start).toLocaleString(),
      " - ",
      new Date(props.link.end).toLocaleString()
    ) : React.createElement(
      "p",
      null,
      "Opened ",
      new Date(_this2.props.link.start).toLocaleString()
    );
    return _this2;
  }

  _createClass(LinkStats, [{
    key: "viewChart",
    value: function viewChart() {
      $("#statsNav a").removeClass("active");
      $("#statsSummary").addClass("active");
      ReactDOM.render(React.createElement(LinkStatsCharts, { link: this.props.link, stats: this.props.stats }), document.querySelector('#statsContainer'));
    }
  }, {
    key: "viewTable",
    value: function viewTable() {
      $("#statsNav a").removeClass("active");
      $("#statsTable").addClass("active");
      ReactDOM.render(React.createElement(LinkStatsTable, { link: this.props.link, stats: this.props.stats }), document.querySelector('#statsContainer'));
    }
  }, {
    key: "viewCSV",
    value: function viewCSV() {
      $("#statsNav a").removeClass("active");
      $("#statsCSV").addClass("active");
      ReactDOM.render(React.createElement(LinkStatsCSV, { link: this.props.link, stats: this.props.stats }), document.querySelector('#statsContainer'));
    }
  }, {
    key: "render",
    value: function render() {
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
              "Stats for ",
              React.createElement(
                "a",
                { href: "https://" + window.location.hostname + "/" + this.props.link.slug, target: "_blank" },
                "/",
                this.props.link.slug
              )
            ),
            React.createElement(
              "div",
              { className: "meta" },
              React.createElement(
                "a",
                { href: this.props.link.redirect, target: "_blank" },
                this.props.link.redirect
              ),
              this.timedData
            )
          )
        ),
        React.createElement(
          "div",
          { id: "statsNav", className: "ui secondary pointing menu" },
          React.createElement(
            "a",
            { id: "statsSummary", className: "active item", onClick: this.viewChart },
            "Summary"
          ),
          React.createElement(
            "a",
            { id: "statsTable", className: "item", onClick: this.viewTable },
            "Table"
          ),
          React.createElement(
            "a",
            { id: "statsCSV", className: "item", onClick: this.viewCSV },
            "CSV"
          )
        ),
        React.createElement(
          "div",
          { id: "statsContainer" },
          React.createElement(LinkStatsCharts, { link: this.props.link, stats: this.props.stats })
        )
      );
    }
  }]);

  return LinkStats;
}(React.Component);

;

var LinkItem = function (_React$Component3) {
  _inherits(LinkItem, _React$Component3);

  function LinkItem(props) {
    _classCallCheck(this, LinkItem);

    var _this3 = _possibleConstructorReturn(this, (LinkItem.__proto__ || Object.getPrototypeOf(LinkItem)).call(this, props));

    _this3.viewStats = _this3.viewStats.bind(_this3);
    return _this3;
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
        { className: "item", onClick: this.viewStats },
        React.createElement(
          "div",
          { className: "right floated content ui buttons" },
          React.createElement(
            "button",
            { className: "ui button" },
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
    { className: "ui middle aligned divided selection list" },
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
    ReactDOM.render(React.createElement(LinkStats, { link: data.link, stats: data.stats.reverse() }), document.querySelector("main"));
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
