'use strict';

var handlePage = function handlePage(e) {
  e.preventDefault();

  console.log('Form submitted');
  //$("#pageMessage").animate({width:'hide'},350);

  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function () {
    loadPagesFromServer(getToken());
  });

  return false;
};

var PageForm = function PageForm(props) {
  if (!props.name) props.name = '';
  if (!props.title) props.title = '';
  if (!props.content) props.content = '';
  return React.createElement(
    'div',
    { className: 'modal fade', id: "editModal-" + props.name, tabindex: '-1', role: 'dialog', 'aria-labelledby': 'editModalLabel', 'aria-hidden': 'true' },
    React.createElement(
      'form',
      { id: 'pageForm',
        onSubmit: handlePage,
        name: 'pageForm',
        action: '/admin',
        method: 'POST',
        className: 'pageForm'
      },
      React.createElement(
        'div',
        { className: 'modal-dialog', role: 'document' },
        React.createElement(
          'div',
          { className: 'modal-content' },
          React.createElement(
            'div',
            { className: 'modal-header' },
            React.createElement(
              'h5',
              { className: 'modal-title', id: 'editModalLabel' },
              'Edit Page'
            ),
            React.createElement(
              'button',
              { type: 'button', className: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
              React.createElement(
                'span',
                { 'aria-hidden': 'true' },
                '\xD7'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'modal-body' },
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement(
                'label',
                { htmlFor: 'name' },
                'URL slug'
              ),
              React.createElement('input', { className: 'form-control', id: 'pageName', type: 'text', name: 'name', placeholder: 'home', value: props.name })
            ),
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement(
                'label',
                { htmlFor: 'title' },
                'Title'
              ),
              React.createElement('input', { className: 'form-control', id: 'pageTitle', type: 'text', name: 'title', placeholder: 'Page Title', value: props.title })
            ),
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement(
                'label',
                { htmlFor: 'content' },
                'Content'
              ),
              React.createElement(
                'textarea',
                { className: 'form-control', id: 'pageContent', type: 'text', name: 'content', placeholder: 'Page Content (Markdown is supported)' },
                props.content
              )
            ),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf })
          ),
          React.createElement(
            'div',
            { className: 'modal-footer' },
            React.createElement(
              'button',
              { type: 'button', className: 'd-none btn btn-danger', 'data-dismiss': 'modal' },
              'Delete'
            ),
            React.createElement('input', { type: 'submit', className: 'btn btn-primary', value: 'Save' })
          )
        )
      )
    )
  );
};

var PageList = function PageList(props) {
  if (props.pages.length === 0) {
    return React.createElement(
      'div',
      { className: 'pageList' },
      React.createElement(
        'h3',
        { className: 'emptyPage' },
        'No Pages yet'
      )
    );
  }

  var pageNodes = props.pages.map(function (page) {
    var node = ownProfile ? React.createElement(
      'div',
      null,
      React.createElement(
        'a',
        { key: page._id, className: 'list-group-item flex-column align-items-start' },
        React.createElement(
          'h3',
          { className: 'pageName' },
          page.title,
          ' '
        ),
        React.createElement(
          'p',
          null,
          page.content
        ),
        React.createElement(
          'form',
          {
            onSubmit: handlePage,
            action: '/admin/delete',
            method: 'POST',
            className: 'pageDelete'
          },
          React.createElement('input', { type: 'hidden', name: 'pageId', value: page._id }),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
          React.createElement(
            'button',
            { type: 'submit', className: 'btn btn-danger' },
            'Delete Page'
          ),
          '\xA0',
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', 'data-toggle': 'modal', 'data-target': "#editModal-" + page.name },
            'Edit Page'
          )
        )
      ),
      React.createElement(PageForm, { name: page.name, title: page.title, content: page.content, csrf: props.csrf })
    ) : React.createElement(
      'div',
      null,
      React.createElement(
        'a',
        { key: page._id, className: 'list-group-item flex-column align-items-start' },
        React.createElement(
          'h3',
          { className: 'pageName' },
          page.title,
          ' '
        ),
        React.createElement(
          'p',
          null,
          page.content
        )
      )
    );
    return node;
  });

  var userClean = ownProfile ? 'Your' : user + '\'s';
  return React.createElement(
    'div',
    { className: 'pageList' },
    React.createElement(
      'h3',
      null,
      userClean,
      ' Pages'
    ),
    React.createElement(
      'div',
      { className: 'list-group' },
      pageNodes
    )
  );
};

var loadPagesFromServer = function loadPagesFromServer(csrf) {
  sendAjax('GET', ownProfile ? '/getPages' : '/getPages/' + user, null, function (data) {
    ReactDOM.render(React.createElement(PageList, { pages: data.pages, csrf: csrf }), document.querySelector("#pages"));
  });
};

var setup = function setup(csrf) {
  if (ownProfile) {
    ReactDOM.render(React.createElement(PageForm, { csrf: csrf }), document.querySelector("#makePage"));
  }

  ReactDOM.render(React.createElement(PageList, { pages: [], csrf: csrf }), document.querySelector("#pages"));

  loadPagesFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  //$("#errorMessage").text(message);
  //$("#domoMessage").animate({width:'toggle'},350);
  console.log("Error: " + message);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
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
