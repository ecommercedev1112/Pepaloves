document.querySelectorAll('[data-section-type="product"].quickshop-product').forEach(function(container){
  const loader = new WAU.Helpers.scriptLoader();
  loader.load([jsAssets.flickity]).finally(() => {

    if ( container.dataset.productVideo === 'true' ) {
      loader.load([jsAssets.productVideo]).finally(() => {});
    }
    if ( container.dataset.productModel === 'true' ) {
      loader.load([jsAssets.productModel]).finally(() => {});
    }
    if (container.dataset.productPickupAvailability === 'true') {
      loader.load([jsAssets.productPickupAvailability]).finally(() => {});
    }

    loader.load([jsAssets.product]).finally(() => {});
  });
});
