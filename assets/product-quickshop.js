WAU.Quickshop = {
  init: function init() {

    var selectors = {
      quickviewButton: '.js-quickview-trigger'
    }

		// Remove section contents
		if ( document.getElementById('quickshopTemplate') ) {
			document.getElementById('quickshopTemplate').innerHTML = '';
		}

    // Init on click event for buttons
    document.querySelectorAll(selectors.quickviewButton).forEach((button, i) => {

      button.addEventListener('click', function(event) {
        event.preventDefault();
				event.target.classList.add('loading-quickshop');

				var productUrl = this.dataset.productUrl,
						productUrl = WAU.Quickshop.cleanUrl(productUrl, 'variant');

				let singleVariant = event.target.hasAttribute('data-quick-add');

				const loader = new WAU.Helpers.scriptLoader();

        if ( this.dataset.hasModel )loader.load([jsAssets.productModel]).finally(() => {});
        if ( this.dataset.hasVideo )loader.load([jsAssets.productVideo]).finally(() => {});
        if ( this.dataset.productPickupAvailability )loader.load([jsAssets.productPickupAvailability]).finally(() => {});

				loader.load([jsAssets.flickity]).finally(() => {
					loader.load([jsAssets.product]).finally(() => {
						WAU.Quickshop.getTemplate(productUrl, singleVariant, event.target);
					});
				});

      });
    });

		// Open placeholder product on edit
		document.addEventListener("shopify:section:select", function(event) {
		  if (event.target.id != 'shopify-section-quickshop') return false;

			WAU.Quickshop.getOnboard();

		});
  },
  formatTemplate: function formatTemplate(response) {
		const html = new DOMParser()
      .parseFromString(response, 'text/html')
      .getElementById('quickshopTemplate').innerHTML;

    return html;
  },
  showModal: function showModal(trigger) {
		trigger.setAttribute('data-wau-modal-target', 'quickview');
		trigger.classList.add('js-modal-open');

		WAU.Modal.init("quickview");
		WAU.Modal._openByName("quickview");
  },
  hideModal: function hideModal() {
		document.querySelector('.js-quickview-content').innerHTML = '';

    WAU.Modal._closeByName("quickview");
  },
	showDrawer: function showDrawer(trigger) {
		trigger.setAttribute('data-wau-slideout-target', 'quickview');
		trigger.setAttribute('data-slideout-direction', 'right');
		trigger.classList.add('js-slideout-open');

		WAU.Slideout.init("quickview");
		WAU.Slideout._openByName("quickview");
	},
	hideDrawer: function hideDrawer() {
		document.querySelector('.js-quickview-content').innerHTML = '';

		WAU.Slideout._closeByName("quickview");
	},
  cleanUrl: function cleanUrl(url, key) {
    return url.split('?')[0] + '?view=quick';
  },
  getTemplate: function getTemplate(url, singleVariant, trigger) {
		fetch(url)
		.then(function(response) {
			return response.text();
		})
		.then(function(response) {
			let content = WAU.Quickshop.formatTemplate(response);

      // Replace content
      document.querySelector('.js-quickview-content').innerHTML = content;

			// Set context
			const context = document.getElementById('quickview-form');
			return context;
    }).then(context => {

			// Load product js function
      Product(context);

			return context;
    }).then(context => {
			// Load Payment Buttons
      if (context.querySelector('.js-quickview-wrapper')) {
        if (context.querySelector('.js-quickview-wrapper').dataset.paymentButton == 'true' && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }
      }
			return context;
    }).then(context => {
			// Trigger event for add to cart
			if ( context.querySelector('.js-ajax-submit') ) {
				context.querySelector('.js-ajax-submit').addEventListener('click', function (e) {
					e.preventDefault();

					var addToCartForm = this.closest('form');

					let cartConfig = document.getElementById('cart-config');
					if ( !cartConfig ) return false;
					cartConfig = JSON.parse(cartConfig.innerHTML || '{}');

					WAU.AjaxCart.addToCart(addToCartForm, null, cartConfig, true, false);

					return false;
				});
			}

			return context;
    }).then(context => {

			let type = context.dataset.quickshopType,
				  quickAdd = (context.dataset.quickshopAdd === 'true');

			if ( quickAdd === true && singleVariant === true) {
				// Add to cart if single variant and quick add is enabled
				var addToCartForm = context.querySelector('.js-product-form-quickshop');

				let cartConfig = document.getElementById('cart-config');
				if ( !cartConfig ) return false;
				cartConfig = JSON.parse(cartConfig.innerHTML || '{}');

				trigger.classList.add('js-quick-adding');

				WAU.AjaxCart.addToCart(addToCartForm, null, cartConfig, true, true, trigger);

        trigger.classList.remove('loading-quickshop');
			} else {
				// Open quick shop
				if ( type === 'modal' ) {
					WAU.Quickshop.showModal(trigger);
				} else {
					WAU.Quickshop.showDrawer(trigger);
				}
				trigger.classList.remove('loading-quickshop');
			}

    })
    .catch(error => {
      console.log(error)
    });
  },
	getOnboard: function getOnboard() {
		let content = document.querySelector('.js-quickview-onboard');
		document.querySelector('.js-quickview-content').innerHTML = content.innerHTML;

		let type = content.dataset.quickshopType,
				trigger = document.querySelector('.js-quickview-onboard-trigger');

		if ( type == 'modal' ) {

			if (document.body.classList.contains('slideout-right--open')) document.body.classList.remove('slideout-right--open');
			WAU.Quickshop.showModal(trigger);

			setTimeout(function() {
				document.getElementById('modal-quickview').style.top = `calc(${window.scrollY}px + 10vh)`;
			}, 500);

		} else {
			if (document.body.classList.contains('modal--open')) document.body.classList.remove('modal--open');
			WAU.Quickshop.showDrawer(trigger);
		}

	}
}

document.addEventListener('DOMContentLoaded', function() {
  WAU.Quickshop.init();
});

document.addEventListener('shopify:section:select', function(event){
  WAU.Quickshop.init();
});
