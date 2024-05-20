console.log('complementary-products.js script loaded');

if (!customElements.get('complementary-products')) {
  customElements.define('complementary-products', class ComplementaryProducts extends HTMLElement {
    constructor() {

      super();

    }


    connectedCallback() {

      this.element = this.querySelector(".js-complementary-products");

      setTimeout(() => {
        this.loadComplementaryProducts(this.element)
      }, 1000);

    }

    loadComplementaryProducts = function(element) {

      var baseUrl = element.dataset.baseUrl;

      if (element === null) { return; }
      // Read product id from data attribute
      var productId = element.dataset.productId;
      var sectionId = element.dataset.sectionId;
      var limit = element.dataset.limit;
      var intent = element.dataset.intent;

      var complementarySectionUrl = baseUrl + '?section_id='+ sectionId + '&product_id=' + productId + '&limit=' + limit + '&intent=' + intent;

      fetch(complementarySectionUrl)
      .then(response => response.text())
      .then(text => {

        const html = document.createElement('div');
        html.innerHTML = text;
        const recommendations = html.querySelector('.js-complementary-products');

        if (recommendations && recommendations.innerHTML.trim().length) {
          element.innerHTML = recommendations.innerHTML;
        }

        WAU.Quickshop.init();

      }).catch(error => {
        console.log(error);
      });
    }


  });
}
