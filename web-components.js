(function() {
  let $ = (selector, node = document) => node.querySelectorAll(selector);
  let version = Math.floor(1);
  // let templateId = `blog-feeds-v${version}`;
  let templateId = `blog-feeds`;
  class CustomElement extends HTMLElement {
    constructor() {
      super();
      let fragment = $('#my-custom-element')[0].content.cloneNode(true);
      this.attachShadow({mode: 'open'}).append(fragment);
    }
    
    connectedCallback() {
      this.classList.add('loaded');
      let feedUrl = null;
      let id = null;
      let maxResults = null;
      
      let slot = this.shadowRoot.querySelectorAll('slot')[0];
      let slot2 = this.shadowRoot.querySelectorAll('slot')[1];
      let slot3 = this.shadowRoot.querySelectorAll('slot')[2];
      
      slot.addEventListener('slotchange', () => {
        let nodes = slot.assignedNodes();
        id = nodes[0].innerHTML.trim();
        
        if (feedUrl !== null && id !== null && maxResults !== null) {
          window.feedThis(this, feedUrl, id, maxResults)
        }
      });
      
      slot2.addEventListener('slotchange', () => {
        let nodes = slot2.assignedNodes();
        feedUrl = nodes[0].innerHTML.trim();;
        
        if (feedUrl !== null && id !== null && maxResults !== null) {
          window.feedThis(this, feedUrl, id, maxResults)
        }
      });
      
      slot3.addEventListener('slotchange', () => {
        let nodes = slot3.assignedNodes();
        maxResults = nodes[0].innerHTML.trim();;
        
        if (feedUrl !== null && id !== null && maxResults !== null) {
          window.feedThis(this, feedUrl, id, maxResults)
        }
      });
      
    }
    
    
  }
  
  customElements.define(templateId, CustomElement);
  
})();
