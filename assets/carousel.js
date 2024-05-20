document.querySelectorAll('[data-section-type="carousel"]').forEach(function(container){
  const loader = new WAU.Helpers.scriptLoader();
  loader.load([jsAssets.flickity]).finally(() => {
    setTimeout(function() {
      carouselInit(container);
    }, 200);
  });
});

document.addEventListener("shopify:section:load", function(event) {
  if ( !event.target.querySelector('[data-section-type="carousel"]') ) return false;
  setTimeout(function() {
    carouselInit(event.target);

    // If testimonials section.
    if (event.target.querySelector('[data-section-type]')?.matches('.section-testimonials')) {
      carouselSlideLast(event.target);
    }
  }, 200);
});

document.addEventListener("shopify:block:select", function(event) {
  var container = event.target.closest('[data-section-type]');
  if ( container.getAttribute('data-section-type') === 'carousel' ) {
    setTimeout(function() {
      carouselSlideEdit(event.target);
    }, 200);
  }
});

document.addEventListener("shopify:block:deselect", function(event) {
  var container = event.target.closest('[data-section-type]');
  if ( container.getAttribute('data-section-type') === 'carousel' ) {
    if (container.classList.contains('section-image-carousel-text')) {
      carouselSlideReset(event.target);
    }
    // If testimonials section.
    if (event.target.closest('[data-section-type]')?.matches('.section-testimonials')) {
      carouselSlideFirst(event.target);
    }
    carouselSlideRestart(event.target);
  }

});

function carouselSlideFirst(container) {
  let carousel = container.closest('.js-carousel');

  if (!carousel) return false;

  let flkty = Flickity.data(carousel);

  flkty.select(0);
}

function carouselSlideLast(container) {
  let carousel = container.querySelector('.js-carousel');

  if (!carousel) return false;

  let flkty = Flickity.data(carousel);

  flkty.select(flkty.cells.length - 1);
}

function carouselInit(container) {
  var carousel = container.querySelector('.js-carousel');

  if ( !carousel ) return false;

  if ( carousel.classList.contains('carousel-loaded--false') ) {
    carousel.classList.remove('carousel-loaded--false');
    carousel.classList.add('carousel-loaded--true');
  }

  var flktyOptions;

  // Carousel on mobile only
  if (container.querySelector('[data-flickity-mobile]') && WAU.Helpers.isMobile()) {
    const flktyData = carousel.getAttribute('data-flickity-mobile');
    flktyOptions = JSON.parse(flktyData);
  } else if (container.querySelector('[data-flickity-other]')) {
    const flktyData = carousel.getAttribute('data-flickity-other');
    flktyOptions = JSON.parse(flktyData);
  } else {
    const flktyData = carousel.getAttribute('data-flickity');
    flktyOptions = JSON.parse(flktyData);
  }

  new Flickity(carousel, flktyOptions);
  carousel.classList.remove('is-hidden');

  carouselResize(carousel);
  carouselAccesibility(carousel);

  var flkty = Flickity.data( carousel );
  flkty.offsetHeight

  // Bail if a testimonials container
  if (!carousel.classList.contains('section-testimonials__inner-wrapper')) {

    // Carousel pagination
    var carouselPag = container.querySelector('.js-carousel-pagination');
    if ( carouselPag ) carouselPagination(carousel, carouselPag);
  }
  
  // Carousel Drag Fix on Mobile
  flkty.on( 'dragStart', function( index ) { document.ontouchmove = e => e.preventDefault() });
  flkty.on( 'dragEnd', function( index ) { document.ontouchmove = () => true });
}

function carouselAccesibility(carousel) {
  var flkty = Flickity.data(carousel);

  if ( flkty.nextButton ) {
    flkty.handles[0].before(flkty.nextButton.element);
    flkty.nextButton.element.before(flkty.prevButton.element);
  }
}

function carouselSlideEdit(container) {
  var carousel = container.closest('.js-carousel');
  if ( !carousel ) return false;

  var flkty = Flickity.data(carousel);
  var slide = container.getAttribute("data-slide-index");

  flkty.select(slide);
  flkty.pausePlayer();
}

function carouselSlideRestart(container) {
  var carousel = container.closest('.js-carousel');

  if ( !carousel ) return false;

  const flkty = Flickity.data(carousel);
  flkty.unpausePlayer();
}

function carouselSlideReset(container) {
  var carousel = container.closest('.js-carousel');

  if ( !carousel ) return false;

  const flkty = Flickity.data(carousel);
  flkty.select(0);
}

function carouselResize(carousel) {
  var flkty = Flickity.data(carousel);
  flkty.resize();
}

function carouselPagination(carousel, pagination) {
  var flkty = Flickity.data(carousel);

  document.addEventListener('click', event => {
    if (event.target.classList.contains('js-nav-item')) {
      removeClasses();
      event.target.classList.add('is-nav-selected');
      flkty.select(event.target.dataset.slideIndex);
    }
  });

  flkty.on( 'change', function( index ) {
    let item = pagination.querySelector(`[data-slide-index="${index}"].js-nav-item`);
    removeClasses();
    item.classList.add('is-nav-selected');
  });

  function removeClasses() {
     pagination.querySelectorAll('.js-nav-item').forEach((item) => {
      item.classList.remove('is-nav-selected');
    });
  }
}
