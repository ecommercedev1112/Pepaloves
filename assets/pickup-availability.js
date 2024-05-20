if (!customElements.get('pickup-availability')) {
  customElements.define('pickup-availability', class PickupAvailability extends HTMLElement {
    constructor() {

      super();

      this.variantId = this.dataset.variantId;
      this.productTitle = this.dataset.productTitle;
      this.hasOnlyDefaultVariant = (this.dataset.hasOnlyDefaultVariant === 'true') ? true : false;
      this.baseUrl = this.dataset.baseUrl;

      this.loadAvailability(this.variantId, this.productTitle);

      Events.on("storeavailability:variant", (id, title) => {
        this.loadAvailability(id, title)
      });

      Events.on("storeavailability:unavailable", () => {
        this.style.display = 'none';
      });

    }

    loadAvailability(id, title) {

      const container = this;
      const variantSectionUrl = this.baseUrl + '/variants/' + id + '/?section_id=pickup-availability';
      container.innerHTML = '';

      fetch(variantSectionUrl)
      .then((response) => {
        return response.text();
      })
      .then((storeAvailabilityHTML) => {

        if (storeAvailabilityHTML.trim() === '') {
          console.warn('Error, no HTML content returned.');
          return;
        }

        container.innerHTML = storeAvailabilityHTML;
        container.innerHTML = container.firstElementChild.innerHTML;
        container.style.opacity = 1;

        container.style.display = "block";

        if ( document.querySelector('[data-pick-up-available="false"]') ) {
          container.style.display = "none";
          console.warn('Error. No pickup available with data attribute set to true.');
          return false;
        } else {
          container.style.visibility = "visible";
        }

        const source = document.getElementById("StoreAvailabilityModal");

        const slideoutContainer = document.querySelector(".js-slideout-toggle-wrapper");
        const slideoutAside = document.getElementById('slideout-store-availability');

        if ( slideoutAside ) {
          slideoutAside.innerHTML = "";
          slideoutAside.appendChild(source);
        } else {
          const newSlideout = WAU.Slideout._createSlideoutEl("right", "store-availability", slideoutContainer);
          newSlideout.appendChild(source);
        }

        WAU.Slideout.init("store-availability");

        const storeAvailabilityModalProductTitle = document.querySelector('[data-store-availability-modal-product-title]');
        storeAvailabilityModalProductTitle.textContent = title;

      })
      .catch((error) => {
        console.warn(error);
      });

    }
  });
}
