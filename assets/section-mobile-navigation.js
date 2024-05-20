function setupDrawer() {
  let mobileHeader = document.getElementById('shopify-section-mobile-header'),
    mobileNav = document.querySelector('.js-mobile-header'),
    mobileSearch = document.getElementById('mobile-search');

  const headerHeight = mobileHeader.offsetHeight + 'px';
  document.documentElement.style.setProperty('--header-height', headerHeight);

  function getHeight(element) {
    element = element.cloneNode(true);
    element.style.visibility = "hidden";
    document.body.appendChild(element);
    var height = element.offsetHeight + 0;
    document.body.removeChild(element);
    element.style.visibility = "visible";
    return height;
  }

  Events.on('slideout:open:mobile-navigation', function(slideout) {
    setTimeout(function(){
      if (mobileNav) mobileNav.style.zIndex = '14';
    }, 200);
  });
  Events.on('slideout:close:mobile-navigation', function(slideout) {
    setTimeout(function(){
      if (mobileSearch) mobileSearch.style.zIndex = '0';
      if (mobileNav) mobileNav.style.zIndex = '12';
    }, 200);
  });
}

document.querySelectorAll('[data-section-type="mobile-header"]').forEach(function(container){
  WAU.Slideout.init("mobile-navigation");
  setupDrawer();

  if ( document.querySelector('.mobile-nav__mobile-header .js-mini-cart-trigger') ) {
    document.querySelector('.mobile-nav__mobile-header .js-mini-cart-trigger').addEventListener("click", function() {
      WAU.Slideout._closeByName("mobile-navigation");
    });
  }
});

document.addEventListener("shopify:section:select", function(event) {
  if ( event.target.querySelector('[data-section-type="mobile-header"]') ) {
    var container = event.target.querySelector('[data-section-type="mobile-header"]');

    if ( WAU.Helpers.isTouch() || WAU.Helpers.isMobile() ) {
      WAU.Slideout._openByName("mobile-navigation");
      setupDrawer();
    }
  }
});

document.addEventListener("shopify:section:deselect", function(event) {
  if ( event.target.querySelector('[data-section-type="mobile-header"]') ) {
    WAU.Slideout._closeByName("mobile-navigation");
  }
});

document.addEventListener("shopify:block:select", function(event) {
  if ( !event.target.querySelector('[data-section-type="mobile-header"]') ) return false;
  if ( WAU.Helpers.isTouch() || WAU.Helpers.isMobile() ) {
    WAU.Slideout._openByName("mobile-navigation");
    setupDrawer();
  }
});
