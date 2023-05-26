document.addEventListener("DOMContentLoaded", main);

window.addEventListener('hashchange', (_event) => {
  let page = document.location.toString().split('#')[1];
  loadPage('#' + page);
});

function main() {
  console.log(window.location.href);
  if (window.location.pathname !== '/index.html')
    window.location.href = `index.html#${HOMEPAGE}`;

  navigate(window.location.hash);
  registerInitFunction();
  attachEventHandler();
}

function navigate(page) {
  loadPage(page);
  history.pushState({}, '', `${page}`);
}

function loadPage(page) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status >= 200 && this.status <= 299) {
        // not secure
        // document.getElementById('content').innerHTML = xhttp.responseText;

        // https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML
        // document.getElementById('content').setHTML(xhttp.responseText);
        document.getElementById('content').innerHTML = xhttp.responseText;

        // hack hack ... https://www.macarthur.me/posts/when-dom-updates-appear-to-be-asynchronous
        requestAnimationFrame(() =>
          requestAnimationFrame(function () {
            document.querySelector(`.sidebar .nav-link.active`)?.classList?.remove('active');
            document.querySelector(`.sidebar .nav-link[href="#${page}"]`)?.classList?.add('active');
            if (initFncs[page])
              initFncs[page]();
            attachEventHandler();
          }));

      } else {
        loadPage('404');
      }
    }
  };
  if (page.startsWith('#'))
    page = page.slice(1);
  xhttp.open('GET', `/pages/${page}.htm`, true);
  xhttp.send();
}

// window.addEventListener('popstate', (event) => {
//   console.log(`popstate event occured: ${document.location}, state: ${JSON.stringify(event.state)}`);
// });