const handlePage = (e) => {
  e.preventDefault();

  console.log('Form submitted');
  //$("#pageMessage").animate({width:'hide'},350);

  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function() {
    loadPagesFromServer(getToken());
  });

  return false;
};

const PageForm = (props) => {
  if(!props.name) props.name = '';
  if(!props.title) props.title = '';
  if(!props.content) props.content = '';
  return (
    <div className="modal fade" id={"editModal-" + props.name} tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
      <form id="pageForm"
        onSubmit={handlePage}
        name="pageForm"
        action="/admin"
        method="POST"
        className="pageForm"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">Edit Page</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">URL slug</label>
                <input className="form-control" id="pageName" type="text" name="name" placeholder="home" value={props.name} />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input className="form-control" id="pageTitle" type="text" name="title" placeholder="Page Title" value={props.title} />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea className="form-control" id="pageContent" type="text" name="content" placeholder="Page Content (Markdown is supported)">{props.content}</textarea>
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

const PageList = function(props) {
  if(props.pages.length === 0) {
    return (
      <div className="pageList">
        <h3 className="emptyPage">No Pages yet</h3>
      </div>
    );
  }

  const pageNodes = props.pages.map(function(page) {
    const node = ownProfile ? (
        <div>
          <a key={page._id} className="list-group-item flex-column align-items-start">
            <h3 className="pageName">{page.title} </h3>
            <p>{page.content}</p>
            <form
              onSubmit={handlePage}
              action="/admin/delete"
              method="POST"
              className="pageDelete"
            >
              <input type="hidden" name="pageId" value={page._id} />
              <input type="hidden" name="_csrf" value={props.csrf} />
              <button type="submit" className="btn btn-danger">Delete Page</button>
              &nbsp;
              <button type="button" className="btn btn-primary" data-toggle="modal" data-target={"#editModal-" + page.name}>Edit Page</button>
            </form>
          </a>
          <PageForm name={page.name} title={page.title} content={page.content} csrf={props.csrf} />
        </div>
    ) : (
        <div>
          <a key={page._id} className="list-group-item flex-column align-items-start">
            <h3 className="pageName">{page.title} </h3>
            <p>{page.content}</p>
          </a>
        </div>
    );
    return (node);
  });

  const userClean = (ownProfile ? 'Your' : `${user}'s`);
  return (
    <div className="pageList">
      <h3>{userClean} Pages</h3>
      <div className="list-group">
        {pageNodes}
      </div>
    </div>
  )
};

const loadPagesFromServer = (csrf) => {
  sendAjax('GET', (ownProfile ? '/getPages' : `/getPages/${user}`), null, (data) => {
    ReactDOM.render(
      <PageList pages={data.pages} csrf={csrf} />,
      document.querySelector("#pages")
    );
  });
};

const setup = function(csrf) {
  if(ownProfile) {
    ReactDOM.render(
      <PageForm csrf={csrf} />,
      document.querySelector("#makePage")
    );
  }

  ReactDOM.render(
    <PageList pages={[]} csrf={csrf} />,
    document.querySelector("#pages")
  );

  loadPagesFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
