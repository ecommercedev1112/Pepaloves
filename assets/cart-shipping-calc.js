ShippingCalculator = {
  init: function init() {
    var config = document.getElementById('cart-config');
    if ( !config ) return false;
    var config = JSON.parse(config.innerHTML || '{}');

    var selectors = {
      container: '.js-shipping-calc-wrapper',
      submitButton: '.js-shipping-calc-submit',
      addressZip: '.js-shipping-calc-address-zip',
      addressCountry: '.js-shipping-calc-address-country',
      addressProvince: '.js-shipping-calc-address-province',
      addressProvinceLabel: '.js-shipping-calc-address-province-label',
      response: '.js-shipping-calc-response'
    }

    let calculators = document.querySelectorAll(selectors.container);

    calculators.forEach((element, i) => {
      element.classList.add("shipping-calculator-" + i)
    });

    let container = document.querySelector('.shipping-calculator-0');

    // Initialize observer on shipping address.
    new Shopify.CountryProvinceSelector('address_country', 'address_province', {
      hideElement: 'address_province_container'
    } );

    // Updating province label.
    var countriesSelect = container.querySelector(selectors.addressCountry);
    var addressProvinceLabelEl = container.querySelector(selectors.addressProvinceLabel);

    if (typeof Countries !== 'undefined') {
      Countries.updateProvinceLabel(countriesSelect.value,addressProvinceLabelEl);

			countriesSelect.addEventListener('change', function() {
        Countries.updateProvinceLabel(countriesSelect.value,addressProvinceLabelEl);
      });
    }

    // When any of the calculator buttons is clicked, get rates.
    let button = container.querySelector(selectors.submitButton);

    button.addEventListener('click', function(e) {
      e.preventDefault();

      // Disabling all buttons.
      ShippingCalculator.disableButtons(config, container);

      // Hiding response.
      container.querySelector(selectors.response).style.display = 'none';

      // Reading shipping address for submission.
      let shippingAddress = {};
      shippingAddress.zip = container.querySelector(selectors.addressZip).value || '';
      shippingAddress.country = container.querySelector(selectors.addressCountry).value || '';
      shippingAddress.province = container.querySelector(selectors.addressProvince).value || '';

      ShippingCalculator.getRates(config, shippingAddress, container);
    });
  },
  enableButtons: function enableButtons(config, container) {
    var selectors = {
      submitButton: '.js-shipping-calc-submit'
    }
    container.querySelector(selectors.submitButton).removeAttribute('disabled');
    container.querySelector(selectors.submitButton).classList.remove('disabled');
    container.querySelector(selectors.submitButton).value = config.calculator_submit;
  },
  disableButtons: function disableButtons(config, container) {
    var selectors = {
      submitButton: '.js-shipping-calc-submit'
    }
    container.querySelector(selectors.submitButton).setAttribute('disabled', 'disabled');
    container.querySelector(selectors.submitButton).classList.add('disabled');
    container.querySelector(selectors.submitButton).value = config.calculator_calculating;
  },
  getRates: function getRates(config, shipping_address, container) {

    let url = '/cart/shipping_rates.json?shipping_address%5Bzip%5D=' + shipping_address.zip + '&shipping_address%5Bcountry%5D=' + shipping_address.country + '&shipping_address%5Bprovince%5D=' + shipping_address.province;

    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
    .then(response => {
      if ( !response.shipping_rates ) {
        ShippingCalculator.onError(response, config, container);
      } else {
        let rates = response.shipping_rates;
        ShippingCalculator.onRatesUpdate(rates, shipping_address, config, container);
      }
    }).catch(error => {
      ShippingCalculator.onError(error, config, container);
    });

  },
  onError: function onError(error, config, container) {

    // Re-enable calculate shipping buttons.
    ShippingCalculator.enableButtons(config, container);

    let feedback = config.calculator_error + ' ' + Object.keys(error)[0] + ' ' + Object.values(error)[0];

    // Update calculator.
    ShippingCalculator.render( { rates: [], errorFeedback: feedback, success: false }, container, config );

    container.querySelector('.js-shipping-calc-rates').style.display = "none";
    container.querySelector('.js-shipping-calc-response').style.display = "block";
  },
  onRatesUpdate: function onRatesUpdate(rates, shipping_address, config, container) {
    // Re-enable calculate shipping buttons.
    ShippingCalculator.enableButtons(config, container);

    // Formatting shipping address.
    var readable_address = '';
    if (shipping_address.zip) readable_address += shipping_address.zip + ', ';
    if (shipping_address.province) readable_address += shipping_address.province + ', ';
    readable_address += shipping_address.country;

    if ( !rates ) return false;

    // Format rates for moneyFormat
    rates.forEach((rate, i) => {
      rate.price = ShippingCalculator.formatRate(rate.price, config);
    });

    // Show rates and feedback.
    ShippingCalculator.render( { rates: rates, address: readable_address, success:true }, container, config );

  },
  formatRate: function formatRate(ratePrice, config) {

    let formatDollarsToCents = function(value) {
        value = (value + '').replace(/[^\d.-]/g, '');
        if (value && value.includes('.')) {
            value = value.substring(0, value.indexOf('.') + 3);
        }
        return value ? Math.round(parseFloat(value) * 100) : 0;
    }
    let cents = formatDollarsToCents(ratePrice);

    return WAU.Helpers.formatMoney(cents, config.money_format);
  },
  render: function render(response, container, config) {
    let rateFeedback = document.querySelector('.js-shipping-calc-rates-feedback'),
        rateList = document.querySelector('.js-shipping-calc-rates');

    // Empty feedback
    rateFeedback.innerHTML = '';

    // Update feedback
		if (response.rates.length > 1) {
      rateFeedback.innerHTML = config.shipping_multi_rate_one + response.rates.length + config.shipping_multi_rate_two + response.address + config.shipping_multi_rate_three + response.rates[0].price;
    } else if (response.rates.length === 1){
      rateFeedback.innerHTML = config.shipping_single_rate + response.address;
    } else {
      rateFeedback.innerHTML = config.shipping_no_destination;
    }

    // Empty rates
    rateList.innerHTML = '';

    // Update rates
    response.rates.forEach((rate, i) => {
      const rateLI = document.createElement('li');
      rateLI.classList.add('shipping-calc__rate');
      rateLI.innerHTML = rate.name + ' at ' + rate.price;
      rateList.appendChild(rateLI)
    });

    container.querySelector('.js-shipping-calc-rates').style.display = "block";
    document.querySelector('.js-shipping-calc-response').style.display = "block";
  }
}
