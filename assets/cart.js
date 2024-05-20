WAU.ThemeCart = (function (exports) {
  'use strict';

  function getDefaultRequestConfig() {
    return JSON.parse(
      JSON.stringify({
        credentials: 'same-origin',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json;'
        }
      })
    );
  }

  function fetchJSON(url, config) {
    return fetch(url, config).then(function(response) {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    });
  }

  function cart() {
    return fetchJSON('/cart.js', getDefaultRequestConfig());
  }

  function cartAdd(id, quantity, properties) {
    var config = getDefaultRequestConfig();

    config.method = 'POST';
    config.body = JSON.stringify({
      id: id,
      quantity: quantity,
      properties: properties
    });

    return fetchJSON('/cart/add.js', config);
  }

  function cartAddItems(items) {
    var config = getDefaultRequestConfig();

    config.method = 'POST';
    config.body = JSON.stringify(items);

    return fetchJSON('/cart/add.js', config);
  }

  function cartAddFromForm(formData) {
    var config = getDefaultRequestConfig();
    delete config.headers['Content-Type'];

    config.method = 'POST';
    config.body = formData;

    return fetchJSON('/cart/add.js', config);
  }

  function cartChange(line, options) {
    var config = getDefaultRequestConfig();

    options = options || {};

    config.method = 'POST';
    config.body = JSON.stringify({
      line: line,
      quantity: options.quantity,
      properties: options.properties
    });

    return fetchJSON('/cart/change.js', config);
  }

  function cartClear() {
    var config = getDefaultRequestConfig();
    config.method = 'POST';

    return fetchJSON('/cart/clear.js', config);
  }

  function cartUpdate(body) {
    var config = getDefaultRequestConfig();

    config.method = 'POST';
    config.body = JSON.stringify(body);

    return fetchJSON('/cart/update.js', config);
  }

  function cartShippingRates() {
    return fetchJSON('/cart/shipping_rates.json', getDefaultRequestConfig());
  }

  function key(key) {
    if (typeof key !== 'string' || key.split(':').length !== 2) {
      throw new TypeError(
        'Theme Cart: Provided key value is not a string with the format xxx:xxx'
      );
    }
  }

  function quantity(quantity) {
    if (typeof quantity !== 'number' || isNaN(quantity)) {
      throw new TypeError(
        'Theme Cart: An object which specifies a quantity or properties value is required'
      );
    }
  }

  function id(id) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new TypeError('Theme Cart: Variant ID must be a number');
    }
  }

  function properties(properties) {
    if (typeof properties !== 'object') {
      throw new TypeError('Theme Cart: Properties must be an object');
    }
  }

  function form(form) {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError('Theme Cart: Form must be an instance of HTMLFormElement');
    }
  }

  function options(options) {
    if (typeof options !== 'object') {
      throw new TypeError('Theme Cart: Options must be an object');
    }

    if (
      typeof options.quantity === 'undefined' &&
      typeof options.properties === 'undefined'
    ) {
      throw new Error(
        'Theme Cart: You muse define a value for quantity or properties'
      );
    }

    if (typeof options.quantity !== 'undefined') {
      quantity(options.quantity);
    }

    if (typeof options.properties !== 'undefined') {
      properties(options.properties);
    }
  }

  /**
   * Cart Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Cart template.
   *
   * @namespace cart
   */

  /**
   * Returns the state object of the cart
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  function getState() {
    return cart().then(function(cart) {
      Events.trigger("cart:ready", cart)
    });
  }

  /**
   * Returns the object of the cart
   * @returns {Promise} Resolves with the object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  function getCart() {
    return cart().then(function(cart) {
      return cart;
    });
  }

  /**
   * Returns the index of the cart line item
   * @param {string} key The unique key of the line item
   * @returns {Promise} Resolves with the index number of the line item
   */
  function getItemIndex(key$$1) {
    key(key$$1);

    return cart().then(function(state) {
      var index = -1;

      state.items.forEach(function(item, i) {
        index = item.key === key$$1 ? i + 1 : index;
      });

      if (index === -1) {
        return Promise.reject(
          new Error('Theme Cart: Unable to match line item with provided key')
        );
      }

      return index;
    });
  }

  /**
   * Fetches the line item object
   * @param {string} key The unique key of the line item
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  function getItem(key$$1) {
    key(key$$1);

    return cart().then(function(state) {
      var lineItem = null;

      state.items.forEach(function(item) {
        lineItem = item.key === key$$1 ? item : lineItem;
      });

      if (lineItem === null) {
        return Promise.reject(
          new Error('Theme Cart: Unable to match line item with provided key')
        );
      }
      return lineItem;
    });
  }

  /**
   * Add a new line item to the cart
   * @param {number} id The variant's unique ID
   * @param {object} options Optional values to pass to /cart/add.js
   * @param {number} options.quantity The quantity of items to be added to the cart
   * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  function addItem(id$$1, options$$1) {
    options$$1 = options$$1 || {};

    id(id$$1);

    return cartAdd(id$$1, options$$1.quantity, options$$1.properties);
  }

  /**
   * Add a new line items to the cart
   * @param {number} items Array of items with id and quantity
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  function addItems(items$$1) {
    return cartAddItems(items$$1);
  }

  /**
   * Add a new line item to the cart from a product form
   * @param {object} form DOM element which is equal to the <form> node
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  function addItemFromForm(form$$1) {
    form(form$$1);

    var formData = new FormData(form$$1);
    id(parseInt(formData.get('id'), 10));

    return cartAddFromForm(formData);
  }

  /**
   * Changes the quantity and/or properties of an existing line item.
   * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
   * @param {object} options Optional values to pass to /cart/add.js
   * @param {number} options.quantity The quantity of items to be added to the cart
   * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  function updateItem(key$$1, options$$1) {
    key(key$$1);
    options(options$$1);

    return getItemIndex(key$$1).then(function(line) {
      return cartChange(line, options$$1);
    });
  }

  /**
   * Removes a line item from the cart
   * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  function removeItem(key$$1) {
    key(key$$1);

    return getItemIndex(key$$1).then(function(line) {
      return cartChange(line, { quantity: 0 });
    });
  }

  /**
   * Sets all quantities of all line items in the cart to zero. This does not remove cart attributes nor the cart note.
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  function clearItems() {
    return cartClear().then(function() {
      Events.trigger("cart:clear");
    });
  }

  /**
   * Gets all cart attributes
   * @returns {Promise} Resolves with the cart attributes object
   */
  function getAttributes() {
    return cart().then(function(state) {
      return state.attributes;
    });
  }

  /**
   * Sets all cart attributes
   * @returns {Promise} Resolves with the cart state object
   */
  function updateAttributes(attributes) {
    return cartUpdate({ attributes: attributes });
  }

  /**
   * Clears all cart attributes
   * @returns {Promise} Resolves with the cart state object
   */
  function clearAttributes() {
    return getAttributes().then(function(attributes) {
      for (var key$$1 in attributes) {
        attributes[key$$1] = '';
      }
      return updateAttributes(attributes);
    });
  }

  /**
   * Gets cart note
   * @returns {Promise} Resolves with the cart note string
   */
  function getNote() {
    return cart().then(function(state) {
      return state.note;
    });
  }

  /**
   * Sets cart note
   * @returns {Promise} Resolves with the cart state object
   */
  function updateNote(note) {
    return cartUpdate({ note: note });
  }

  /**
   * Clears cart note
   * @returns {Promise} Resolves with the cart state object
   */
  function clearNote() {
    return cartUpdate({ note: '' });
  }

  /**
   * Get estimated shipping rates.
   * @returns {Promise} Resolves with response of /cart/shipping_rates.json (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-shipping-rates)
   */
  function getShippingRates() {
    return cartShippingRates();
  }

  exports.getState = getState;
  exports.getCart = getCart;
  exports.getItemIndex = getItemIndex;
  exports.getItem = getItem;
  exports.addItem = addItem;
  exports.addItems = addItems;
  exports.addItemFromForm = addItemFromForm;
  exports.getDefaultRequestConfig = getDefaultRequestConfig;
  exports.updateItem = updateItem;
  exports.removeItem = removeItem;
  exports.clearItems = clearItems;
  exports.getAttributes = getAttributes;
  exports.updateAttributes = updateAttributes;
  exports.clearAttributes = clearAttributes;
  exports.getNote = getNote;
  exports.updateNote = updateNote;
  exports.clearNote = clearNote;
  exports.getShippingRates = getShippingRates;

  return exports;

}({}));

WAU.AjaxCart = {
  init: function init() {
    let config = document.getElementById('cart-config');
    if ( !config ) return false;
    config = JSON.parse(config.innerHTML || '{}');

    var selectors = {
      cartTrigger: '.js-mini-cart-trigger',
      cartPageLoader: '.ajax-cart__page-wrapper .js-mini-cart-loader',
      addToCart: '.js-ajax-submit'
    };

    // Init carts
    this.initializeAjaxCart(config);

		// Set No Js Cart or Remove
		if (config.cart_action == 'no_js_cart') {
			if ( document.querySelector('.js-ajax-cart-content') ) {
				document.querySelector('.js-ajax-cart-content').remove();
			}
		} else {
			if ( document.querySelector('.js-ajax-cart-content-nojs') ){
				document.querySelector('.js-ajax-cart-content-nojs').remove();
			}
		}

    // Init cart type
    if (config.cart_action == 'drawer') {
      WAU.Slideout.init("ajax-cart");
    } else if (config.cart_action == 'modal_cart')  {
      WAU.Modal.init("ajax-cart");
    }

    // Override add to cart form
    document.querySelectorAll(selectors.addToCart).forEach((element, i) => {
		  element.addEventListener('click', function (e) {
        e.preventDefault();

        var addToCartForm = this.closest('form');
        WAU.AjaxCart.addToCart(addToCartForm, element.parentNode, config, false, false);

        return false;
      });
    });

    // Update cart page on load
    if (document.querySelector('body').classList.contains('template-cart')) {
      WAU.ThemeCart.getCart().then(Cart => {
        WAU.AjaxCart.updateView(config, Cart);

        // Remove page loader
        setTimeout(function(){
          document.querySelector('body').classList.add('cart-loaded');
        }, 800);

      });
    }

    // On cart trigger click
    let cartTriggers = document.querySelectorAll(selectors.cartTrigger);
    cartTriggers.forEach((item, i) => {
      item.addEventListener('click', function (e) {
        e.preventDefault();

        // Open drawer
        WAU.ThemeCart.getCart().then(Cart => {

          WAU.AjaxCart.updateView(config, Cart);

          if (config.cart_action == 'drawer') {
            WAU.AjaxCart.showDrawer(config);
          } else if (config.cart_action == 'modal_cart')  {
            WAU.AjaxCart.showModal(config);
          } else {
            window.location.href = config.cart_url;
          }

        });

        return false;
      });
    });

  },
  cartEvents: function cartEvents(config) {
    var selectors = {
      cartDrawerRemove: '.js-cart-remove',
			cartDrawerQty: '[data-item-qty]',
      cartDrawerQtyDecrease: '[data-ajax-qty-decrease]',
      cartDrawerQtyIncrease: '[data-ajax-qty-increase]',
      cartNote: '.js-cart-note',
      cartUpsell: '.js-upsell-submit'
    };

    // Cart Events
		document.querySelectorAll(selectors.cartDrawerQty).forEach((element, i) => {
      element.addEventListener('change', function (e) {
        e.preventDefault();

        var quantity = parseInt(this.value),
						itemKey = this.dataset.itemKey,
						itemMax = this.dataset.limit,
						lineElement = element.closest('.ajax-cart__cart-item');

				// Set new quantity
				element.value = quantity;

				// Adjust cart object
				setTimeout(function() {
					if (quantity === 0) {
						WAU.AjaxCart.removeFromCart(itemKey, config);
					} else {

						WAU.AjaxCart.checkLimit(itemMax, quantity, lineElement, config);

						WAU.ThemeCart.updateItem(itemKey, { quantity }).then(state => {
							WAU.AjaxCart.updateView(config, state);
						});
					}
				}, 250);


        return false;
      });
    });
    document.querySelectorAll(selectors.cartDrawerRemove).forEach((element, i) => {
      element.addEventListener('click', function (e) {
        e.preventDefault();

        var itemKey = this.dataset.itemKey;

        WAU.AjaxCart.removeFromCart(itemKey, config);

        return false;
      });
    });
    document.querySelectorAll(selectors.cartDrawerQtyDecrease).forEach((element, i) => {
      element.addEventListener('click', function (e) {
        e.preventDefault();

				if (this.nextElementSibling.value === '1') {
					var itemKey = this.dataset.itemKey;
					WAU.AjaxCart.removeFromCart(itemKey, config);
				} else {
					var itemId = this.dataset.ajaxQtyDecrease;
	        WAU.AjaxCart.adjustQty(-1, itemId, config);
				}

        return false;
      });
    });
    document.querySelectorAll(selectors.cartDrawerQtyIncrease).forEach((element, i) => {
      element.addEventListener('click', function (e) {
        e.preventDefault();

        var itemId = this.dataset.ajaxQtyIncrease;
        WAU.AjaxCart.adjustQty(+1, itemId, config);

        return false;
      });
    });
    document.querySelectorAll(selectors.cartNote).forEach((element, i) => {
			element.addEventListener('blur', (event) => {
        let note = element.value;
        WAU.ThemeCart.updateNote(note).then(state => {
          WAU.AjaxCart.updateView(config, state);
        });
      });
    });
    document.querySelectorAll(selectors.cartUpsell).forEach((element, i) => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const id = parseInt(element.dataset.variantId);
        WAU.ThemeCart.addItem(id, 1).then(state => {
          WAU.ThemeCart.getCart().then(Cart => {
            WAU.AjaxCart.updateView(config, Cart);
          });
        });
      });
    });

    // Reinit shipping calc
    if ( config.show_calculator && document.querySelector('body').classList.contains('template-cart')) {
      setTimeout(function(){
        ShippingCalculator.init();
      }, 1000);
    }

    // Restart Payment buttons
    if (Shopify && Shopify.StorefrontExpressButtons) {
      Shopify.StorefrontExpressButtons.initialize();
    }
  },
  showDrawer: function showDrawer(config) {
    if (config.cart_action != 'drawer') return false;

    WAU.Slideout._openByName("ajax-cart");
  },
  hideDrawer: function hideDrawer(config) {
    if (config.cart_action != 'drawer') return false;

    WAU.Slideout._closeByName("ajax-cart");
  },
  showModal: function showModal(config) {
    if (config.cart_action != 'modal_cart') return false;

    WAU.Modal._openByName("ajax-cart");
  },
  hideModal: function hideModal(config) {
    if (config.cart_action != 'modal_cart') return false;

    WAU.Modal._closeByName("ajax-cart");
  },
  removeFromCart: function removeFromCart(itemKey, config, callback) {
    WAU.ThemeCart.removeItem(itemKey).then(state => {
      WAU.AjaxCart.updateView(config, state);
    });
  },
  adjustQty: function adjustQty(value, itemId, config) {

    var selectors = {
      lineItem: '.item_' + itemId,
      updatesItem: '.updates_' + itemId
    };

    // Update Line Item
    document.querySelectorAll(selectors.lineItem).forEach((element, i) => {
      elementInput = element.querySelector(selectors.updatesItem),
      key = elementInput.dataset.itemKey,
      max = elementInput.dataset.limit,
      quantity = parseInt(elementInput.value) + parseInt(value);

      // Check limit to prevent over adding
			if (WAU.AjaxCart.checkLimit(max, quantity, element, config)) return false;

      // Check new qty to prevent going lower than 1
      if (quantity === 0 ) return false;

      // Set new quantity
      elementInput.value = quantity;

      // Adjust cart object
      setTimeout(function() {
        WAU.ThemeCart.updateItem(key, { quantity }).then(state => {
          WAU.AjaxCart.updateView(config, state);
        });
      }, 250);

    });
  },
	checkLimit: function checkLimit(max, quantity, element, config) {
		// Check limit to prevent over adding
		if ( max != '' && quantity > max ) {
			let cartNote = document.createElement("div");
					cartNote.classList.add('mini-cart__cart-note');
					cartNote.innerHTML = '<p class="a-center"><b>' + config.cart_error + '</b>&nbsp;&nbsp;' + config.update_qty_error + '</p>';

			let adjacentElement = element.querySelector('.js-item-quantity');
			let parentElement = adjacentElement.parentNode;

			parentElement.appendChild(cartNote, adjacentElement);

			setTimeout(function() {
				WAU.Helpers.fadeOut(cartNote);
				parentElement.removeChild(cartNote);
			}, 2000);

			return true;
		}
	},
  addToCart: function addToCart(addToCartForm, formContext, config, isQuickview, quickAdd, trigger) {
    var selectors = {
      addToCart: '.js-ajax-submit',
      cartAddedMsg: '.js-added-msg'
    }

    let context;

    if ( isQuickview ) { context = document.getElementById('quickview-form') } else { context = formContext; }

    // Check if we have a recipient form.
    const isRecipientForm = [...addToCartForm.elements].filter(element => {
      return element.name == 'properties[__shopify_send_gift_card_to_recipient]' && element.checked;
    }).length !== 0;

    if (isRecipientForm) {

      const recipientConfig = WAU.ThemeCart.getDefaultRequestConfig();
      const formData = new FormData(addToCartForm);

      delete recipientConfig.headers['Content-Type'];
      recipientConfig.method = 'POST';
      recipientConfig.body = formData;

      fetch('/cart/add.js', recipientConfig)
        .then(function(response) {
          return response.json();
        }).then(function(data) {
          if (data.status == 422) {
            const errors = data.description;
            const messages  = data.message;
            Events.trigger("recipientform:errors", messages, errors, config, addToCartForm);
          }
        }).catch(function(error) {
          console.error(error);
        });
    }

    // Check line item properties required
    if ( addToCartForm.querySelectorAll("[required]").length > 0 ) {
      var properties = document.querySelectorAll("[data-product-property-form]");
      var required = false;
      properties.forEach((element, i) => {
        if ( element.required && element.value === '' ) {
          required = true;
          document.querySelector(`[name="${element.name}"]`)?.classList.add('required-error');
          setTimeout(function(){
            document.querySelector(`[name="${element.name}"]`)?.classList.remove('required-error');
          }, 3000);
        }
      });
      if ( required ) return false;
    }

    if (trigger && trigger.hasAttribute('data-complementary-product')) {
      trigger.textContent = config.adding_to_cart;
      trigger.classList.add('disabled');
      trigger.getAttribute('disabled', 'disabled');
    }

    // Disable add to cart button temporarily
    context.querySelector(selectors.addToCart).value = config.adding_to_cart;
    context.querySelector(selectors.addToCart).classList.add('disabled');
    context.querySelector(selectors.addToCart).getAttribute('disabled', 'disabled');


    WAU.ThemeCart.addItemFromForm(addToCartForm).then(item => {

      if (trigger && trigger.hasAttribute('data-complementary-product')) {
        trigger.textContent = config.added_to_cart;
        trigger.classList.remove('disabled');
        trigger.removeAttribute('disabled', 'disabled');
      }

      // Re-enable add to cart button
      context.querySelector(selectors.addToCart).value = config.added_to_cart;
      context.querySelector(selectors.addToCart).classList.remove('disabled');
      context.querySelector(selectors.addToCart).removeAttribute('disabled', 'disabled');

      setTimeout(function(){
        if (trigger && trigger.hasAttribute('data-complementary-product')) trigger.textContent = config.add_to_cart;
				if ( context.querySelector(selectors.addToCart) ) context.querySelector(selectors.addToCart).value = config.add_to_cart;
      }, 3000);

      WAU.ThemeCart.getCart().then(Cart => {

				if ( isQuickview && config.cart_added_event != 'product_page') {
					let type = context.getAttribute('data-quickshop-type');

					if ( quickAdd === false ) {
						if ( type == 'drawer' ) {
							WAU.Quickshop.hideDrawer();
						} else {
							WAU.Quickshop.hideModal();
						}
					}
        } else if ( isQuickview && config.cart_added_event == 'product_page') {
					if ( quickAdd === true ) {
						var trigger = document.querySelector('.js-quick-adding');
						if ( trigger ) {
							trigger.classList.remove('loading-quickshop');
							WAU.Helpers.fadeOut(trigger.querySelector('.quickview-trigger--plus'));
							WAU.Helpers.fadeIn(trigger.querySelector('.quickview-trigger--check'), 'inline-block');

							setTimeout(function(){
								WAU.Helpers.fadeOut(trigger.querySelector('.quickview-trigger--check'));
								WAU.Helpers.fadeIn(trigger.querySelector('.quickview-trigger--plus'), 'inline-block');
								trigger.classList.remove('js-quick-adding');
							}, 4000);
						}
					} else {
						WAU.Helpers.fadeIn(context.querySelector(selectors.cartAddedMsg));

						if ( context.getAttribute('data-quickshop-type') == 'drawer' ) {
							context.querySelector(selectors.cartAddedMsg).scrollIntoView();
						}

						setTimeout(function(){
							WAU.Helpers.fadeOut(context.querySelector(selectors.cartAddedMsg));
						}, 4000);
					}
        }

        if (config.cart_action == 'drawer' && config.cart_added_event == 'go_to_active_cart') {
          WAU.AjaxCart.showDrawer(config);
        } else if (config.cart_action == 'modal_cart' && config.cart_added_event == 'go_to_active_cart' )  {
          WAU.AjaxCart.showModal(config);
        } else if (config.cart_action == 'page_only' && config.cart_added_event == 'go_to_active_cart' )  {
          window.location.href = config.cart_url;
        } else if ( config.cart_added_event == 'product_page' ) {
			    WAU.Helpers.fadeIn(context.querySelector(selectors.cartAddedMsg));
          setTimeout(function(){
            WAU.Helpers.fadeOut(context.querySelector(selectors.cartAddedMsg));
          }, 4000);
        } else {
          window.location.href = config.cart_url;
        }

        WAU.AjaxCart.updateView(config, Cart);
      });
    }).catch(error => {
      if (error.status == 422) {
				function showErrorMsg() {
					// Show error msg
					WAU.Helpers.fadeIn(context.querySelector('.js-error-msg'));

          if (trigger) {
            trigger.textContent = config.add_to_cart;
            trigger.classList.remove('disabled');
            trigger.removeAttribute('disabled', 'disabled');
          }

					// Re-enable add to cart button
					context.querySelector(selectors.addToCart).value = config.add_to_cart;
					context.querySelector(selectors.addToCart).classList.remove('disabled');
					context.querySelector(selectors.addToCart).removeAttribute('disabled', 'disabled');

					setTimeout(function(){
						WAU.Helpers.fadeOut(context.querySelector('.js-error-msg'));
					}, 4000);
				}

				if ( isQuickview ) {
					let type = context.getAttribute('data-quickshop-type');
					let trigger = document.querySelector('.js-quickview-onboard-trigger');

					if ( type == 'drawer' ) {
						WAU.Quickshop.showDrawer(trigger);
						showErrorMsg();
					} else {
						WAU.Quickshop.showModal(trigger);
						showErrorMsg();
					}
				} else {
					showErrorMsg();
				}
      } else {
        console.log(error)
      }
    });
  },
  addItemsToCart: function addItemsToCart(data, button) {
    let config = document.getElementById('cart-config');
    if ( !config ) return false;
    config = JSON.parse(config.innerHTML || '{}');

    // Disable add to cart button temporarily
    button.value = config.adding_to_cart;
    button.classList.add('disabled');
    button.getAttribute('disabled', 'disabled');
 
    WAU.ThemeCart.addItems(data).then(state => {
      // Re-enable add to cart button
      button.value = config.added_to_cart;
      button.classList.remove('disabled');
      button.removeAttribute('disabled', 'disabled');

      setTimeout(function(){
				if ( button ) button.value = config.add_set_to_cart;
      }, 3000);

      WAU.ThemeCart.getCart().then(Cart => {

        if (config.cart_action == 'drawer' && config.cart_added_event == 'go_to_active_cart') {
          WAU.AjaxCart.showDrawer(config);
        } else if (config.cart_action == 'modal_cart' && config.cart_added_event == 'go_to_active_cart' )  {
          WAU.AjaxCart.showModal(config);
        } else if (config.cart_action == 'page_only' && config.cart_added_event == 'go_to_active_cart' )  {
          window.location.href = config.cart_url;
        } else if ( config.cart_added_event == 'product_page' ) {
			    WAU.Helpers.fadeIn(document.querySelectorAll('.js-added-msg')[0]);
          setTimeout(function(){
            WAU.Helpers.fadeOut(document.querySelectorAll('.js-added-msg')[0]);
          }, 4000);
        } else {
          window.location.href = config.cart_url;
        }

        WAU.AjaxCart.updateView(config, Cart);
      }).catch(error => {
        if (error.status == 422) {
          // Show error msg
          WAU.Helpers.fadeIn(document.querySelectorAll('.js-added-msg')[0]);

          // Re-enable add to cart button
          button.value = config.add_set_to_cart;
          button.classList.remove('disabled');
          button.removeAttribute('disabled', 'disabled');

          setTimeout(function(){
            WAU.Helpers.fadeOut(document.querySelectorAll('.js-added-msg')[0]);
          }, 4000);
        } else {
          console.log(error)
        }
      });
    }).catch(error => {
      if (error.status == 422) {

        // Show error msg
        WAU.Helpers.fadeIn(document.querySelectorAll('.js-error-msg')[0]);

        // Re-enable add to cart button
        button.value = config.add_set_to_cart;
        button.classList.remove('disabled');
        button.removeAttribute('disabled', 'disabled');

        setTimeout(function(){
          WAU.Helpers.fadeOut(document.querySelectorAll('.js-error-msg')[0]);
        }, 4000);
      } else {
        console.log(error)
      }
    });
  },
  getAjaxCart: function getAjaxCart(response) {
    const el = document.createElement('div');
    el.innerHTML = response;

    const responseOptions = JSON.parse(el.querySelector('[data-options]').innerHTML);
    const htmls = el.querySelectorAll('[data-html]');

    let html = {};
    if (htmls.length === 1 && htmls[0].getAttribute('data-html') === '') {
      html = htmls[0].innerHTML;
    } else {
      for (let i = 0; i < htmls.length; i++) {
        html[htmls[i].getAttribute('data-html')] = htmls[i].innerHTML;
      }
    }
    let options = responseOptions;

    return html;
  },
  initializeAjaxCart: function initializeAjaxCart(config) {
    let data, url;
    url = config.cart_url + '/?view=ajax';

    fetch(url, data)
    .then(res => res.text())
    .then(response => {
      let html = WAU.AjaxCart.getAjaxCart(response);

      // Replace cart content
      document.querySelectorAll('.js-ajax-cart-content').forEach((item, i) => {
        item.innerHTML = html.content;
      });

    }).then(response => {
      // Init shipping calc
      if ( config.show_calculator && document.querySelector('body').classList.contains('template-cart')) {
        setTimeout(function(){
          ShippingCalculator.init();
        }, 1000);
      }
    }).catch(error => {
      console.log(error)
    });
  },
  updateView: function updateView(config, Cart) {
    let data, url;
    url = config.cart_url + '/?view=ajax';

    fetch(url, data)
    .then(res => res.text())
    .then(response => {
      let html = WAU.AjaxCart.getAjaxCart(response);

      var selectors = {
        cartContent: '.js-ajax-cart-content',
        cartEmpty: '.js-cart-empty',
        cartForm: '.js-cart-form',
        cartAccordion: '.js-cart-accordion',
        cartCount: '.js-cart-count',
        cartAdditonalCheckoutButtons: '.js-additional-checkout-buttons'
      };

      if (Cart.item_count === 0) {
        // Hide form
        document.querySelectorAll(selectors.cartForm).forEach((item, i) => {
          item.classList.add('hide');
        });
        // Show empty msg
        document.querySelectorAll(selectors.cartEmpty).forEach((item, i) => {
          item.classList.remove('hide');
        });
        // Update cart count
        document.querySelectorAll(selectors.cartCount).forEach((item, i) => {
          item.innerHTML = '0';
        });
        // Hide additional checkout buttons
        document.querySelectorAll(selectors.cartAdditonalCheckoutButtons)?.forEach((item) => {
          item.classList.add('hide');
        });
      } else {
        // Hide empty msg
        document.querySelectorAll(selectors.cartEmpty).forEach((item, i) => {
          item.classList.add('hide');
        });
        // Update cart count
        document.querySelectorAll(selectors.cartCount).forEach((item, i) => {
          item.innerHTML = Cart.item_count;
        });
        // Replace cart page and drawer content
        document.querySelectorAll(selectors.cartContent).forEach((item, i) => {
          item.innerHTML = html.content;
        });
        // Reload accordions
        document.querySelectorAll(selectors.cartAccordion).forEach((item, i) => {
          WAU.Helpers.Accordion(item, '.tlink.has_sub_menu button', '.accordion-content.sub');
          WAU.Helpers.Accordion(item, '.tlink2.has_sub_menu button', '.accordion-content2.sub');
        });
        // Show additional checkout buttons
        document.querySelectorAll(selectors.cartAdditonalCheckoutButtons)?.forEach((item) => {
          item.classList.remove('hide');
        });

        // Reload events
        WAU.AjaxCart.cartEvents(config);
      }

      // Set Cart Loaded
      setTimeout(function(){
        document.querySelector('body').classList.add('cart-loaded');
      }, 500);
    })
    .catch(error => {
      console.log(error)
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  WAU.AjaxCart.init();
});

document.addEventListener('shopify:section:select', function(event){
  WAU.AjaxCart.init();
});

document.addEventListener('shopify:section:load', function(event){
  WAU.AjaxCart.init();
});
