const handleShorten = (e) => {
  e.preventDefault();

  if($("#slug").val() == '' || $("#redirect").val() == '') {
    handleError("Error: All fields are required");
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

const LinkStats = (props) => {
  let total = 0, countries = [];
  const statNodes = props.stats.map((entry) => {
    total++;
    if(!countries.includes(entry.country)) {
      countries.push(entry.country);
    }
    return (
      <tr>
        <td>{entry.referrer}</td>
        <td>{entry.country}</td>
        <td>{entry.timestamp}</td>
      </tr>
    );
  });
  return(
    <div>
      <div className="ui card" style={{width:'100%'}}>
        <div className="content">
          <div className="header">Stats for /{props.link.slug}</div>
          <div className="meta">{props.link.redirect}</div>
        </div>
      </div>
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
      </div>
      <table className="ui single line table">
        <thead>
          <tr>
            <th>Referrer</th>
            <th>Country*</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {statNodes}
        </tbody>
      </table>
      <p><i>*: Country requires using Cloudflare w/ IP Geolocation turned on</i></p>
    </div>
  );
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
      <div className="item">
        <div className="right floated content ui buttons">
          <button className="ui button" onClick={this.viewStats}>Stats</button>
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
      <LinkStats link={data.link} stats={data.stats} />,
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
        <div className="header item">URL Shortener</div>
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
