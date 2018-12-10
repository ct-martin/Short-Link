const handleShorten = (e) => {
  e.preventDefault();

  if($("#slug").val() == '' || $("#redirect").val() == '') {
    handleError("Error: All fields are required");
    return false;
  }

  if(!$("#slug").val().toLowerCase().match(/[a-z0-9-]+/)) {
    handleError("Error: Only the hyphen (-) and alphanumeric characters are allowed in the slug.");
    return false;
  }

  handleForm(e, () => {
    ReactDOM.render(
      <div className="ui positive message">
        <i className="close icon" onClick={hideError}></i>
        <div className="header">
          Success!
        </div>
        <p>Link created! Your link will expire in 30 days.</p>
      </div>,
      document.querySelector("#error")
    );
  });
};

const handlePasswordChange = (e) => {
  e.preventDefault();

  if($("#oldpassword").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Error: All fields are required");
    return false;
  }

  if($("#pass").val() !== $("#pass2").val()) {
    handleError("Error: Passwords do not match");
    return false;
  }

  handleForm(e, () => {
    ReactDOM.render(
      <div className="ui positive message">
        <i className="close icon" onClick={hideError}></i>
        <div className="header">
          Success!
        </div>
        <p>Your password has been changed.</p>
      </div>,
      document.querySelector("#error")
    );
  });
};

const ShortenWindow = (props) => {
  return (
    <form id="shortenForm" name="shortenForm"
      onSubmit={handleShorten}
      action="/admin"
      method="POST"
      className="ui form"
    >
      <div className="field">
        <label>URL to Shorten</label>
        <input type="text" id="redirect" name="redirect" placeholder="https://example.com/" />
      </div>
      <div className="field">
        <label>Shortened Slug</label>
        <div className="ui labeled input">
          <div className="ui label">
            {window.location.hostname}/
          </div>
          <input type="text" id="slug" name="slug" placeholder="yourslug" />
        </div>
      </div>
      <input type="hidden" name="_csrf" value={csrf} />
      <input className="ui button" type="submit" value="Shorten!" />
    </form>
  );
};

const LinkStatsTable = (props) => {
  const statNodes = props.stats.map((entry) => {
    return (
      <tr>
        <td data-tooltip={entry.timestamp} data-potision="bottom left">
          {new Date(entry.timestamp).toLocaleString()}
        </td>
        <td>{entry.uaParsed.browser}</td>
        <td>{entry.uaParsed.platform}</td>
        <td>{entry.uaParsed.isMobile ? 'YES' : 'NO'}</td>
        <td>{entry.uaParsed.isBot ? 'YES' : 'NO'}</td>
        <td>{entry.country.toUpperCase()}</td>
        <td>{entry.referrer}</td>
      </tr>
    );
  });
  return (
    <div>
      <table className="ui single line table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Browser</th>
            <th>Platform</th>
            <th>Mobile</th>
            <th>Bot</th>
            <th>Country*</th>
            <th>Referrer</th>
          </tr>
        </thead>
        <tbody>
          {statNodes}
        </tbody>
      </table>
      <p><i>*: Country requires using Cloudflare w/ IP Geolocation turned on. "XX" means unknown.</i></p>
    </div>
  );
};

const LinkStatsCharts = (props) => {
  let total = 0, unknown = 0, mobile = 0, countries = [], browsers = [], platforms = [];
  props.stats.forEach((entry) => {
    total++;
    if(entry.ua === '') {
      unknown++;
    }
    if(entry.uaParsed.mobile) {
      mobile++;
    }
    if(entry.uaParsed.bot) {
      bot++;
    }
    if(!countries.includes(entry.country)) {
      countries.push(entry.country);
    }
    if(!browsers.includes(entry.uaParsed.browser)) {
      browsers.push(entry.uaParsed.browser);
    }
    if(!platforms.includes(entry.uaParsed.platform)) {
      platforms.push(entry.uaParsed.platform);
    }
  });
  return (
    <div className="ui statistics">
      <div className="statistic">
        <div className="value">
          {total}
        </div>
        <div className="label">
          Total Clicks
        </div>
      </div>
      <div className="statistic">
        <div className="value">
          {countries.length}
        </div>
        <div className="label">
          Countries
        </div>
      </div>
      <div className="statistic">
        <div className="value">
          {Math.round(mobile / (total - unknown) * 100)}%
        </div>
        <div className="label">
          Mobile Users
        </div>
      </div>
      <div className="statistic">
        <div className="value">
          {browsers.length}
        </div>
        <div className="label">
          Browsers
        </div>
      </div>
      <div className="statistic">
        <div className="value">
          {platforms.length}
        </div>
        <div className="label">
          Platforms
        </div>
      </div>
    </div>
  );
};

const LinkStatsCSV = (props) => {
  const statNodes = props.stats.map((entry) => {
    return (
      `${entry.timestamp},"${entry.ua}","${entry.country.toUpperCase()}","${entry.referrer}"`
    );
  });
  statNodes.unshift("Timestamp,UA,Country,Referrer");
  return (
    <div className="ui form">
      <div className="field">
        <textarea readonly value={statNodes.join("\n")} />
      </div>
    </div>
  );
};

class LinkStats extends React.Component {
  constructor(props) {
    super(props);
    this.viewChart = this.viewChart.bind(this);
    this.viewTable = this.viewTable.bind(this);
    this.viewCSV = this.viewCSV.bind(this);
    this.timedData = this.props.link.timedEnd ? (
      <p>Open {new Date(this.props.link.start).toLocaleString()} - {new Date(props.link.end).toLocaleString()}</p>
    ) : (
      <p>Opened {new Date(this.props.link.start).toLocaleString()}</p>
    );
  }

  viewChart() {
    $("#statsNav a").removeClass("active");
    $("#statsSummary").addClass("active");
    ReactDOM.render(
      <LinkStatsCharts link={this.props.link} stats={this.props.stats} />,
      document.querySelector('#statsContainer')
    );
  }

  viewTable() {
    $("#statsNav a").removeClass("active");
    $("#statsTable").addClass("active");
    ReactDOM.render(
      <LinkStatsTable link={this.props.link} stats={this.props.stats} />,
      document.querySelector('#statsContainer')
    );
  }

  viewCSV() {
    $("#statsNav a").removeClass("active");
    $("#statsCSV").addClass("active");
    ReactDOM.render(
      <LinkStatsCSV link={this.props.link} stats={this.props.stats} />,
      document.querySelector('#statsContainer')
    );
  }

  render() {
    return(
      <div>
        <div className="ui card" style={{width:'100%'}}>
          <div className="content">
            <div className="header">
              Stats for <a href={`https://${window.location.hostname}/${this.props.link.slug}`} target="_blank">/{this.props.link.slug}</a>
            </div>
            <div className="meta">
              <a href={this.props.link.redirect} target="_blank">
                {this.props.link.redirect}
              </a>
              {this.timedData}
            </div>
          </div>
        </div>
        <div id="statsNav" className="ui secondary pointing menu">
          <a id="statsSummary" className="active item" onClick={this.viewChart}>
            Summary
          </a>
          <a id="statsTable" className="item" onClick={this.viewTable}>
            Table
          </a>
          <a id="statsCSV" className="item" onClick={this.viewCSV}>
            CSV
          </a>
        </div>
        <div id="statsContainer">
          <LinkStatsCharts link={this.props.link} stats={this.props.stats} />
        </div>
      </div>
    );
  }
};

class LinkItem extends React.Component {
  constructor(props) {
    super(props);
    this.viewStats = this.viewStats.bind(this);
  }

  viewStats() {
    createStatsWindow(this.props.slug);
  }

  render() {
    return (
      <div className="item" onClick={this.viewStats}>
        <div className="right floated content ui buttons">
          <button className="ui button">Stats</button>
        </div>
        <div className="content">
          <div className="header">/{this.props.slug}</div>
          <p>Links to {this.props.redirect}</p>
        </div>
      </div>
    );
  }
};

const ViewWindow = (props) => {
  if(props.links.length === 0) {
    return (
      <div className="ui message">
        <div className="header">
          No links yet
        </div>
        <p>Press "Shorten URL" above to get started!</p>
      </div>
    );
  }

  const linkNodes = props.links.map((link) => {
    return (
      <LinkItem id={link._id} slug={link.slug} redirect={link.redirect} />
    );
  });

  return (
    <div className="ui middle aligned divided list">
      {linkNodes}
    </div>
  );
};

const SettingsWindow = (props) => {
  return (
    <form id="passwordForm"
      name="passwordForm"
      onSubmit={handlePasswordChange}
      action="/admin/password"
      method="POST"
      className="ui form"
    >
      <div className="field">
        <label htmlFor="oldpassword">Current Password: </label>
        <input id="user" type="password" name="oldpassword" placeholder="oldpassword" />
      </div>
      <div className="field">
        <label htmlFor="pass">New Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" />
      </div>
      <div className="field">
        <label htmlFor="pass2">New Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      </div>
      <input type="hidden" name="_csrf" value={csrf} />
      <input className="ui button" type="submit" value="Change Password" />
    </form>
  );
};

const createShortenWindow = () => {
  $("nav a").removeClass("active");
  $("#shortenButton").addClass("active");
  ReactDOM.render(
    <ShortenWindow />,
    document.querySelector("main")
  );
};

const createViewWindow = () => {
  $("nav a").removeClass("active");
  $("#viewButton").addClass("active");
  sendAjax('GET', '/admin/getLinks', null, (data) => {
    ReactDOM.render(
      <ViewWindow links={data.links} />,
      document.querySelector("main")
    );
  });
};

const createStatsWindow = (slug) => {
  sendAjax('GET', `/admin/getStats/${slug}`, null, (data) => {
    ReactDOM.render(
      <LinkStats link={data.link} stats={data.stats.reverse()} />,
      document.querySelector("main")
    );
  });
};

const createSettingsWindow = () => {
  $("nav a").removeClass("active");
  $("#settingsButton").addClass("active");
  ReactDOM.render(
    <SettingsWindow />,
    document.querySelector("main")
  );
};

const createUI = () => {
  ReactDOM.render(
    <div>
      <nav className="ui top fixed menu">
        <div className="header item">S<small>hort</small>-Link Page</div>
        <a id="shortenButton" className="active item" onClick={createShortenWindow}>
          Shorten URL
        </a>
        <a id="viewButton" className="item" onClick={createViewWindow}>
          View your URLs
        </a>
        <div className="right menu">
          <a id="settingsButton" className="item" onClick={createSettingsWindow}>
            Settings
          </a>
          <a className="item" href="/admin/logout">
            Log out
          </a>
        </div>
      </nav>
      <div className="ui container">
        <div id="error"></div>
        <main>
        </main>
      </div>
    </div>,
    document.querySelector("#content")
  );
};

const setup = function(csrfToken) {
  csrf = csrfToken;

  createUI();
  createShortenWindow();
};

const getToken = () => {
  sendAjax('GET', '/admin/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

let csrf;

$(document).ready(function() {
  getToken();
});
