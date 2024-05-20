function customerAddressForm(element) {
  if (Shopify && Shopify.CountryProvinceSelector) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew'
      });
      document.querySelectorAll('.address-country-option').forEach((select) => {
        const formId = select.dataset.formId;
        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
          hideElement: `AddressProvinceContainer_${formId}`
        });
      });
    }
}

document.querySelectorAll('[data-section-type="customer"]').forEach(function(container){
  var newAddressForm = container.querySelector('#AddressNewForm');
  if ( newAddressForm ) customerAddressForm();
});

document.addEventListener("shopify:section:select", function(event) {
  var newAddressForm = event.target.querySelector('#AddressNewForm');
  if ( newAddressForm ) customerAddressForm();
});
