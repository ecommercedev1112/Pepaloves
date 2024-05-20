Parallax = function(container) {
  const Scale = container.dataset.scale;
  const image = container.querySelectorAll('img');

  if ( !image ) return false;

  const initParallaxSection = function(ParallaxSection) {
    new simpleParallax(image, {
      scale: Scale,
      delay: .3,
      customWrapper: 'parralax__image',
      transition: 'cubic-bezier(0,0,0,1)'
    });
  }

  initParallaxSection(image);
}

// Load vendor script once
if ( document.querySelectorAll('[data-section-type="parallax"]').length >= 1 ) {
  const loader = new WAU.Helpers.scriptLoader();
  loader.load([jsAssets.parallax]).finally(() => {
    initParallax();
  });
}

// initParallax for each section on load and editor events
function initParallax() {
  document.querySelectorAll('[data-section-type="parallax"]').forEach(function(container){
    Parallax(container);
  });

  document.addEventListener("shopify:section:load", function(event) {
    if (event.target.querySelector('[data-section-type="parallax"]')) {
      Parallax(event.target.querySelector('[data-section-type="parallax"]'));
    }
  });
}
