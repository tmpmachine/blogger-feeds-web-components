window.feedThis = function(node, feedUrl, widgetId, maxResults) {
  
  let blogFeedUrl = feedUrl;
  let L = console.log;
  let $ = node.shadowRoot.querySelectorAll.bind(node.shadowRoot);

  let template=function(){let $=document.querySelectorAll.bind(document);function a(a){return function(a,b=document){return b.querySelectorAll(a)}(a,this)}return{clone:function(c){let b=$(c)[0].content.cloneNode(!0);return b.getChild=a,b}}}();
  
  
  let defaultThumbnailUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQwTqlGbLo7btOZ16B6cwEnfsXgzjZk3Ys1TEpV5glREu0VbfGICjDM5dvf3DzriKjpzfnUKMVaRxgzqDEHSD3tnrnZ46ZGVB_ZR62PNsinFxCY8MJUZ4vGAH5eclEhP2UAbOVSAZcw39ydTAHlCKIdr07NK-aG7-heLZ8UtDtLYNWZlRB_IbfzlJxcg/s320/no-image.png';
  let prefetchData = window.localStorage.getItem('prefetch-feeds-'+widgetId);
  let isUsePrefetch = false;
  if (prefetchData !== null) {
    try {
      prefetchData = JSON.parse(prefetchData);
      isUsePrefetch = true;
    } catch (err) { }
  }

  function preload() {
    $('.list-thumb-headline')[0].append(template.clone('#tmp-headline-thumbnail-skeleton'));
  }
  
  function fetchHeadline() {
    
    let callbackName = 'onfeedcallback' + widgetId;
    window[callbackName] = handleResponse;
    let script = document.createElement('script');
    let url = new URL(blogFeedUrl);
    let urlParams = new URLSearchParams(url.search);
    urlParams.append('alt', 'json-in-script');
    urlParams.append('max-results', maxResults);
    urlParams.append('callback', 'window.' + callbackName);
    script.src = url.origin + url.pathname + '?' + urlParams;
    document.body.append(script);
    script.remove();
  }
  
  function handleResponse(response) {
    loadCarousel(response, true)
  }
  
  function loadCarousel(res, isCarousel) {
    localStorage.setItem('prefetch-feeds-'+widgetId, JSON.stringify(res));
    loadThumbnail(res);
  }
  
  function loadThumbnail(res) {
    let fragment = document.createDocumentFragment();
    let index = 0;
    if (!res.feed.entry) {
      return;
    }
    for (let item of res.feed.entry) {
      let node = template.clone('#tmp-headline-thumbnail');
      
      // if (item.media$thumbnail) {
      //   node.getChild('img')[0].src = blogImageResizer(item.media$thumbnail.url, 140, 70);
      // } else {
      //   node.getChild('img')[0].src = blogImageResizer(defaultThumbnailUrl, 140, 70);
      // }
      
      node.getChild('.thumb-box')[0].dataset.index = index;
      node.getChild('p')[0].textContent = item.title.$t;
      node.getChild('a')[0].href = item.link.find(x => x.rel == 'alternate').href;
      node.getChild('small')[0].textContent = new Date(item.published.$t).toLocaleDateString();

      fragment.append(node);
      index++;
    }
    
    $('.list-thumb-headline')[0].innerHTML = '';
    $('.list-thumb-headline')[0].append(fragment);
  }
  
  
  function blogImageResizer(url, width=400, height=196) {
    if (url.includes('=s72-')) {
      return url.replace(/=.*/g, `=w${width}-h${height}-c`);
    } else if (url.match(/\/s[0-9]*?\-.*?\//)) {
      return url.replace(/\/s[0-9]*?\-.*?\//g, `/w${width}-h${height}-c/`);
    }
    return url;
  }
  
  try {
    preload();
    if (isUsePrefetch) {
      loadCarousel(prefetchData, false);
    }
  } catch (e) { 
    console.error(e);
  }
  fetchHeadline();
  
};
