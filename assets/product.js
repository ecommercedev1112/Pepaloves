ProductForm = function (context, sectionId, events, Product) {
  var prodForm = context.querySelector(`#product-form-${Product.id}-${sectionId}`);
  var config = JSON.parse(prodForm.dataset.productForm || '{}');
  var selector, varSelectors, options, variant;

  (function quantity() {
    var elements = context.querySelectorAll(".product-qty, .formQty");

    if (!elements) return false;

    if (elements.length > 0) {
      elements.forEach((element) => {

    events.on("quantitycontrol:click", change);

    function change(value) {
      var quantity = parseInt(element.value) + value;

      if ( quantity < 1 ) return false;

      element.value = quantity;
        }
      });  // end forEach
    } // end if
  })();

  /**
   * Helper method to check inputs that are already checked.
   * @see https://stackoverflow.com/a/51750471
   */
  (function checkItems() {
    let checkedInputs = context.querySelectorAll('[checked="checked"]');
    if (checkedInputs.length > 0) {
      checkedInputs.forEach((input) => {
        input.checked = true;
      });
    }
  })();

  (function quantity_controls() {
    Control(".js-qty-up", 1);
    Control(".js-qty-down", -1);

    function Control(selector, value) {
      var element = context.querySelector(selector);

      if ( !element ) return false;

      element.addEventListener("click", function (event) {
        event.preventDefault();
        events.trigger("quantitycontrol:click", value);
      });
      element.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          events.trigger("quantitycontrol:click", value);
        }
      });
    }
  })();

  if (context.querySelector('#formVariantId')) {
    context.querySelector('#formVariantId').setAttribute('name', 'id');
  }

  // variant only js below
  if ( Product.has_only_default_variant ) return false;

  varSelectors = context.querySelectorAll('.js-variant-selector');

  varSelectors.forEach((item, i) => {
    item.addEventListener("change", function (event) {
      event.preventDefault();

      if ( config.swatches == 'swatches' ) {
        const swatches = Array.from(varSelectors);
        options = swatches.map((swatch) => {
          var val;
          swatch.querySelectorAll('input').forEach((item) => {
            if (item.checked) {
              val = item.value;
              item.checked = true;
            }
          });
          return val;
        });
      } else {
        options = Array.from(context.querySelectorAll('select.js-variant-selector'), (select) => select.value);
      }
      variant = Product.variants.find((variant) => {
        return !variant.options.map((option, index) => {
          return options[index] === option;
        }).includes(false);
      });
      variantEvents(context, variant, config);
    });
  });

  (function swatches() {
    var elements = context.querySelectorAll("[type=radio]");

    var states = {
      sold_out: function (element) {
        element.parentElement.classList.add("soldout");
      },
      available: function (element) {
        element.parentElement.classList.remove("soldout");
      }
    };

    events.on("variantunavailable", set_unavailable);

    elements.forEach(Swatch);

    var swatchLabel = context.querySelectorAll(".swatches__form--label");
    swatchLabel.forEach(selectInput);

		function set_unavailable() {
      var selected = {};
      var selected_elements = document.querySelectorAll("[type=radio]:checked");

      selected_elements.forEach(function (element) {
       var option = "option" + element.getAttribute("data-position");
       var value = element.value;
       selected[option] = value;
      });
      elements.forEach(function (element) {
       var available = false;
       var current_option = "option" + element.getAttribute("data-position");
       var current_value = element.value;
       var other_options = ["option1", "option2", "option3"].filter(function (option) {
         return selected[option] && option != current_option;
       });
       Product.variants.forEach(function (variant) {
         if ( !variant.available ) {
           return;
         }
         if ( variant[current_option] != current_value ) {
           return;
         }
         if ( variant[other_options[0]] == selected[other_options[0]] && variant[other_options[1]] == selected[other_options[1]] ) {
           available = true;
           return;
         }
       });
       if ( available ) {
         states.available(element);
       } else {
         states.sold_out(element);
       }
      });
    }
		function Swatch(element) {
      var option_position = element.getAttribute("data-position");

      var current_option = "option" + option_position;

      var other_options = ["option1", "option2", "option3"].filter(function (option) {
        return option != current_option;
      });

      element.addEventListener("change", function (event) {
        var selectedLabel = context.querySelector('#selected-option-' + option_position);

        selectedLabel.innerHTML = element.value;

        events.trigger("swatch:change:" + option_position, element.value);
      });

      events.on("variantchange:option" + option_position + ":" + element.value, select);

      events.on("variantchange", set_availability);

      function select() {
        element.checked = true;
      }

      function set_availability(current_variant) {
        var available = false;

        Product.variants.forEach(function (variant) {
          if ( !variant.available ) {
            return;
          }

          if ( variant[current_option] != element.value ) {
            return;
          }

          if ( variant[other_options[0]] != current_variant[other_options[0]] ) {
            return;
          }

          if ( variant[other_options[1]] != current_variant[other_options[1]] ) {
            return;
          }

          available = true;
        });

        if ( available ) {
          states.available(element);
        } else {
          states.sold_out(element);
        }
      }
    }
    function selectInput(element) {
      element.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          const input = event.target.parentNode.querySelector(".swatches__form--input");
          input.click();
        }
      });
      element.addEventListener("click", function(event) {
        event.preventDefault();
        const input = event.target.parentNode.querySelector(".swatches__form--input");
        input.click();
      });
    }
  })();

  (function sku() {
    var element = context.querySelector(".js-variant-sku");

    if ( !element ) return false;

    events.on("variantchange", function (variant, config) {
			if (!variant.sku) {
				element.parentNode.style.display = 'none';
			} else {
				element.innerHTML = variant.sku;
				element.parentNode.style.display = 'inline-block';
			}
    });
    events.on("variantunavailable", function (config) {
			element.innerHTML = config.unavailable;
    });
  })();

	(function price() {
		var element = context.querySelector(".price__regular .price-item--regular");

    if ( !element ) return false;

		events.on("variantchange", function (variant) {
			var price = money(variant.price);
			element.innerHTML = price;

			events.on("variantunavailable", function (variant) {
				price = config.unavailable;
				element.innerHTML = price;
			});
		});
	})();

	(function price_classes() {
		var element = context.querySelector("[data-price]");

    if ( !element ) return false;

		events.on("variantchange", function (variant) {
			if ( variant.available && variant.compare_at_price > variant.price ) {
				element.classList.add('price--on-sale');
				element.classList.remove('price--sold-out');
			} else if ( !variant.available && variant.compare_at_price > variant.price ) {
				element.classList.add('price--sold-out');
				element.classList.add('price--on-sale');
			} else if ( !variant.available ) {
				element.classList.add('price--sold-out');
				element.classList.remove('price--on-sale');
			} else {
				element.classList.remove('price--on-sale');
				element.classList.remove('price--sold-out');
			}

			if (variant.unit_price_measurement) {
				element.classList.add('price--unit-available');
			} else {
				element.classList.remove('price--unit-available');
			}
		});
	})();

	(function unit_price() {
		var element = context.querySelector("[data-unit-price]");
		var wrapper = context.querySelector(".price__unit");

		if ( !element ) return false;

		events.on("variantchange", function (variant) {
			var unitPrice = "";

			if (variant.unit_price) {
          unitPrice = '(' + WAU.Helpers.formatMoney(variant.unit_price, config.money_format) +  ' / ' + getBaseUnit(variant) + '&nbsp;)';

          element.style.display = "inline-block";
			} else {
				wrapper.style.display = "none";
			}

			element.innerHTML = unitPrice;
		});
	})();

	(function compare_price() {
		var saleEl = context.querySelector(".price__sale .price-item--sale");
		var regEl = context.querySelector(".price__sale .price-item--regular");

		if ( !saleEl ) return false;

		events.on("variantchange", function (variant) {
			var salePrice = "",
					regPrice = "";

			if ( variant.compare_at_price > variant.price ) {
				regPrice = money(variant.compare_at_price);
				salePrice = money(variant.price);
			}

			saleEl.innerHTML = salePrice;
			regEl.innerHTML = regPrice;
		});
	})();

	(function add_to_cart() {
    var element = context.querySelector(".js-ajax-submit");

    if ( !element ) return false;

    events.on("variantchange", function (variant) {
      var text = config.button;
      var disabled = false;

      if ( !variant.available ) {
        text = config.sold_out;
        disabled = true;
      }

			element.setAttribute("data-variant-id", variant.id);
      element.value = text;
      element.disabled = disabled;
    });

    events.on("variantunavailable", function () {
      element.value = config.unavailable;
      element.disabled = true;
    });
  })();

  (function shop_pay() {
    const element = context.querySelector('#product-form-installment');

    if (!element) return false;

    const input = element.querySelector('input[name="id"]');

    events.on("variantchange", function (variant) {
      input.value = variant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  })();

  (function smart_payment_buttons() {
    var element = context.querySelector(".shopify-payment-button");

    if ( !element ) return false;

    events.on("variantchange", function (variant) {

      if ( !variant.available ) {
         element.style.display = 'none';
       } else {
         element.style.display = 'block';
       }

    });
  })();

  (function selling_plans() {
    var element = context.querySelector('[name="selling_plan"]');

    if ( !element ) return false;

    // Add selling plan input to submit form
    var submitForm = context.querySelector('.js-prod-form-submit');
    var input = document.createElement("input");
      input.name = "selling_plan";
      input.type = "hidden";
      input.className = "js-selling-plan";
      submitForm.appendChild(input);

    //Update selling plan input on select change
    element.addEventListener('change', function(event) {
      input.value = event.target.value;
    });
  })();

	function money(cents) {
		return WAU.Helpers.formatMoney(cents, config.money_format);
	}

	function getBaseUnit(variant) {
   return variant.unit_price_measurement.reference_value != 1
     ? variant.unit_price_measurement.reference_value
     : variant.unit_price_measurement.reference_unit;
  }

  function variantEvents(context, variant, config) {
    if ( !variant ) {
      events.trigger("variantunavailable", config);
      Events.trigger("storeavailability:unavailable");
      return;
    }

    if ( Product.variants.length == 1 ) {
      if ( !variant.available ) {
        var element = context.querySelector(".product-price");
        element.innerHTML = config.sold_out;
      }
      return;
    }

    events.trigger("variantchange", variant, config);
    events.trigger("variantchange:option1:" + variant.option1);
    events.trigger("variantchange:option2:" + variant.option2);
    events.trigger("variantchange:option3:" + variant.option3);

    if ( context.querySelector('[data-store-availability-container]') ) {
      Events.trigger("storeavailability:variant", variant.id, Product.title);
    }

    if ( variant.featured_media ) {
      Events.trigger("variantchange:image", variant.featured_media.id, context);
    }

    if ( config.enable_history ) historyState(variant, context);

    updateVariantInput(variant, context);
  }

  function historyState(variant, context) {
    if ( !variant ) return;
    window.history.replaceState({ }, '', `${context.dataset.url}?variant=${variant.id}`);
  }

  function updateVariantInput(variant, context) {
    const input = context.querySelector('#formVariantId');
    if (!input) {
      return false;
    }
    input.setAttribute('name', 'id');
    input.value = variant.id;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    Events.trigger("variantinputchange", variant);
    if ( variant.featured_media ) Events.trigger("variantinputchange:image", variant.featured_media.id, context);
  }
}

ProductDetails = function (context, events, Product) {
  (function sku() {
    var element = context.querySelector(".js-variant-sku");

    if ( !element ) return false;

    events.on("variantchange", function (variant, config) {
			if (!variant.sku) {
				element.parentNode.style.display = 'none';
			} else {
				element.innerHTML = variant.sku;
				element.parentNode.style.display = 'grid';
			}
    });
    events.on("variantunavailable", function (config) {
			element.innerHTML = config.unavailable;
    });

  })();

  (function weight() {
    var element = context.querySelector(".js-variant-weight");

    if ( !element ) return false;

    events.on("variantchange", function (variant, config) {
      var variantWeight = variant.weight_in_unit;
      var variantWeightUnit = variant.weight_unit;
      if ( variantWeight > 0 ) {
        element.innerHTML = variantWeight + '&nbsp;' + variantWeightUnit;
      } else {
        element.innerHTML = config.unavailable;
      }
    });
    events.on("variantunavailable", function (config) {
      element.innerHTML = config.unavailable;
    });

  })();
}

ProductProperties = function(context) {
  var elements = context.querySelectorAll("[data-product-property]");

  elements.forEach((element, i) => {
    var propertyId = element.dataset.propertyId,
      propertyInput = context.querySelector(`.formProperty-${propertyId}`);

    if ( !propertyInput ) propertyInput = newProperty(element);

    element.addEventListener('change', function(event) {
      updatePropertyValue(element, propertyInput)
    });
  });

  function newProperty(element) {
    var form = context.querySelector('.js-prod-form-submit');

    if ( !form ) return false;

    var input = document.createElement("input");
    input.type = "hidden";
    input.className = "formProperty-" + element.dataset.propertyId;
    input.value = element.value;
    input.name = element.name;
    input.required = element.required;
    input.setAttribute('data-product-property-form', '');
    form.appendChild(input); // put it into the DOM

    return input;
  }

  function updatePropertyValue(element, input) {
    var propertyValue = element.value;

    if ( !input ) return false;
    input.value = propertyValue;
    input.required = element.required;
  }
}

ProductGallery = (function () {
  function init(context, sectionId, events, Product) {
    let config = JSON.parse(context.querySelector('.js-product-gallery')?.dataset.galleryConfig || '{}'),
        main = context.querySelector('.js-carousel-main'),
        carouselNav = context.querySelector('.js-thumb-carousel-nav');

    this.mainSlider(main, carouselNav, config, context);
    if ( config.thumbPosition == 'bottom' && config.thumbSlider == true ) this.thumbSlider(carouselNav, main, context);

    if ( config.clickToEnlarge ) ProductGallery.enlargePhoto(context);
  }

  function mainSlider(main, carouselNav, config, context) {
    let initialEl = main.querySelector("[data-image-id='" + context.dataset.initialVariant + "']"),
        initialIndex;

    if ( initialEl ) {
      initialIndex = initialEl.dataset.slideIndex;
    } else {
      initialIndex = 0;
    }

    var flkty = new Flickity( main, {
      // options
      fade: true,
      wrapAround: true,
      cellAlign: 'left',
      draggable: true,
      contain: true,
      pageDots: true,
      prevNextButtons: true,
      selectedAttraction: 0.2,
      friction: 0.8,
      autoPlay: false,
      selectedAttraction: 0.01,
      dragThreshold: 5,
      adaptiveHeight: true,
      imagesLoaded: true,
      initialIndex: initialIndex,
			arrowShape: 'M71.9,95L25.1,52.2c-0.6-0.6-0.9-1.3-0.9-2.2s0.3-1.6,0.9-2.2L71.9,5l3.9,4.3L31.4,50l44.4,40.7L71.9,95z',
      on: {
        ready: function() {
          let id = this.selectedElement.dataset.imageId;

          /* Fade in */
          context.querySelector('.js-product-gallery').style.visibility = "visible";

          ProductGallery.setThumbByColor(context);
        },
        change: function() {
          /* Set focus control on change */
          ProductGallery.removeFocus(context);
          ProductGallery.addFocus(this.selectedElement, context);

          /* Set media */
          ProductGallery.setActiveThumbnail(this.selectedElement.dataset.imageId, this.selectedElement, context);
          ProductGallery.switchMedia(this.selectedElement.dataset.imageId, context);

          /* Allow model drag */
          if ( this.selectedElement.classList.contains('model-slide') ) {
            if ( this.isDraggable ) {
              /* Turn off drag for model usage */
              this.options.draggable = !this.options.draggable;
              this.updateDraggable();
            }
          }
        },
        dragStart: function () {
          document.ontouchmove = e => e.preventDefault();
        },
        dragEnd: function () {
          document.ontouchmove = () => true
        }
      }
    });

    ProductGallery.galleryEvents(flkty, context, carouselNav);

    if ( carouselNav ) ProductGallery.thumbnails(flkty, carouselNav, config, context);
  }

  function thumbSlider(wrapper, main, context) {
    var flktyThumbs = new Flickity( wrapper, {
      // options
      asNavFor: main,
      wrapAround: false,
      groupCells: true,
      cellAlign: 'left',
      draggable: false,
      contain: true,
      imagesLoaded: true,
      pageDots: false,
      autoPlay: false,
      selectedAttraction: 0.01,
      dragThreshold: 5,
      accessibility: false,
      arrowShape: 'M71.9,95L25.1,52.2c-0.6-0.6-0.9-1.3-0.9-2.2s0.3-1.6,0.9-2.2L71.9,5l3.9,4.3L31.4,50l44.4,40.7L71.9,95z'
    });
  }

  function thumbnails(flkty, carouselNav, config, context) {
    if ( !carouselNav ) return false;

    let thumbs = carouselNav.querySelectorAll('.js-thumb-item');

    if ( !thumbs ) return false;

    /* on thumbnail click and key enter */
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', function(event){
        event.preventDefault();

        let index = this.dataset.slideIndex,
            el = carouselNav.querySelectorAll('.js-thumb-item')[index],
            mediaId = this.dataset.imageId;

        /* Update classes & aria */
        ProductGallery.setActiveThumbnail(mediaId, el, context);
        ProductGallery.switchMedia(mediaId, context);

        /* move thumb slider to position */
        ProductGallery.setThumbPos(this, carouselNav);

        /* change slide */
        flkty.select( index );

      });

      thumb.addEventListener('keypress', function(event){
        event.preventDefault();

        if(event.which == 13){ //Enter key pressed

          let index = this.dataset.slideIndex,
              el = carouselNav.querySelectorAll('.js-thumb-item')[index],
              mediaId = this.dataset.imageId;

          /* Update classes & aria */
          ProductGallery.setActiveThumbnail(mediaId, el, context);
          ProductGallery.switchMedia(mediaId, context);

          /* move thumb slider to position */
          ProductGallery.setThumbPos(this, carouselNav);

          /* change slide */
          flkty.select( index );

        }
      });
    });
  }

  function setThumbPos(selected, carouselNav) {

    carouselNav.scrollTo({
      top: selected.offsetTop - 20,
      left: 0,
      behavior: 'smooth'
    });
  }

  function galleryEvents(flkty, context, carouselNav) {

    /* On Variant Change and Initial Load */
    Events.on('variantchange:image', function(id, context){

      if ( id === null ) return false;

      /* Select new image in flickity */
      var main, el, index, curFlkty;

      main = context.querySelector('.js-carousel-main');

      if ( !main ) return false;

	  carouselNav = context.querySelector('.js-thumb-carousel-nav');
		

      el = main.querySelector("[data-image-id='" + id + "']");
      if (!el) return false;
      index = el.dataset.slideIndex;

      ProductGallery.setActiveThumbnail(id, el, context);
      ProductGallery.switchMedia(id, context);
      ProductGallery.setThumbByColor(context);

      curFlkty = Flickity.data( main );
      curFlkty.select( index );

      if ( carouselNav ) {
        let activeThumb = carouselNav.querySelector('.js-thumb-item.is-nav-selected');
        ProductGallery.setThumbPos(activeThumb, carouselNav);
      }

    });
  }

  function removeFocus(context) {
    let main;

    if ( context ) {
      main = context;
    } else {
      main = context.querySelector('.js-carousel-main');
    }

    /* Set all elements to no tab */
    context.querySelectorAll('.js-carousel-main *').forEach((item, i) => {
      item.setAttribute('tabIndex', '-1');
      item.blur();
    });

    let buttonContents = context.querySelectorAll('.flickity-button *');
    buttonContents.forEach((item, i) => {
      item.setAttribute('tabIndex', '-1');
      item.classList.add('js-hide-focus')
    });

    if (main.classList.contains('.flickity-enabled')) {
      main.setAttribute('tabIndex', '-1');
      main.classList.add('js-hide-focus');
    }
  }

  function addFocus(current, context) {
    /* Set current element to tab */
    if ( current.classList.contains('image-slide') ) {
      current.querySelector('img').setAttribute("tabIndex", "0");
    } else if ( current.classList.contains('video-slide') ) {
      current.querySelectorAll('.plyr__controls *').forEach((item, i) => {
        item.setAttribute("tabIndex", "0");
      });
    } else if ( current.classList.contains('external_video-slide') ) {
      current.querySelector('iframe').setAttribute("tabIndex", "0");
    } else if ( current.classList.contains('model-slide') ) {
      current.querySelectorAll('.shopify-model-viewer-ui__controls-area *').forEach((item, i) => {
        item.setAttribute("tabIndex", "0");
      });
    }
  }

  function enlargePhoto(context) {

    let buttons = context.querySelectorAll('.js-zoom-btn');

    if ( !buttons ) return false;

    buttons.forEach((button, i) => {
      button.addEventListener('click', function (event) {
      	event.preventDefault();

        var btn = event.target,
            index = btn.getAttribute('data-index'),
            index = parseInt(index,10);

        const loader = new WAU.Helpers.scriptLoader();
        loader.load([jsAssets.zoom]).then(() => {
          openPhotoSwipe(index);
        });

      });
    });

    var openPhotoSwipe = function(index) {
      var pswpElement = document.querySelectorAll('.pswp')[0];

      let images = context.querySelectorAll('#main-slider .image-slide');

      if ( images.length < 2 ) {
        var arrows = false;
      } else {
        var arrows = true;
      }

      let items = [];
      images.forEach((image, i) => {
        let imageTag = image.querySelector('.product__image');

        let item = {
          src: imageTag.getAttribute('data-zoom-src'),
          w: imageTag.getAttribute('width'),
          h: imageTag.getAttribute('height')
        }
        items.push(item);
      });

      var options = {
        index: index,
        arrowEl: arrows,
        captionEl: false,
        closeOnScroll: false,
        counterEl: false,
        history: false,
        fullscreenEl: false,
        preloaderEl: false,
        shareEl: false,
        tapToClose: false,
        zoomEl: true,
        getThumbBoundsFn: function(index) {
          var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          var thumbnail = context.querySelector('.product__image');
          var rect = thumbnail.getBoundingClientRect();
          return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
        }
      };

      var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();

      gallery.listen('afterChange', function() {
        var flkty = Flickity.data('.js-carousel-main')
        var newIndex = gallery.getCurrentIndex();
        flkty.select (newIndex);
      });

    };
  }

  function switchMedia(mediaId, context) {
    let main = context.querySelector('.js-carousel-main'),
        currentMedia = main.querySelector('[data-product-single-media-wrapper]:not(.inactive)'),
        newMedia = main.querySelector('[data-product-single-media-wrapper]' + "[data-thumbnail-id='product-template-" + mediaId +"']"),
        otherMedia = main.querySelectorAll('[data-product-single-media-wrapper]' + ":not([data-thumbnail-id='product-template-" + mediaId + "'])");

    if (currentMedia) {
      currentMedia.dispatchEvent(
        new CustomEvent('mediaHidden', {
          bubbles: true,
          cancelable: true
        })
      );
    }

    if (newMedia) {
      newMedia.classList.add('active-slide');
      newMedia.classList.remove('inactive');
      newMedia.dispatchEvent(
        new CustomEvent('mediaVisible', {
          bubbles: true,
          cancelable: true
        })
      );
    }

    if (otherMedia) {
      otherMedia.forEach(
        function(el) {
          el.classList.add('inactive');
          el.classList.remove('active-slide');
        }.bind(this)
      );
    }
  }

  function setActiveThumbnail(mediaId, el, context) {

     let main = context.querySelector('.js-carousel-main'),
         carouselNav = context.querySelector('.js-thumb-carousel-nav');

     if (typeof mediaId === 'undefined') {
       mediaId = main.querySelector('[data-product-single-media-wrapper]:not(.hide)').dataset.mediaId;
     }

     if ( carouselNav ) {
       /* remove selected class from all */
       carouselNav.querySelectorAll('.js-thumb-item').forEach((item, i) => {
         item.classList.remove('is-nav-selected');
         item.classList.remove('active-slide');
         item.removeAttribute('aria-current');
       });
     }

     /* add selected class */
     let thumbActive = context.querySelector(".js-thumb-item[data-image-id='" + mediaId + "']");
     if ( thumbActive ) {
       thumbActive.classList.add('is-nav-selected');
       thumbActive.classList.add('active-slide');
       thumbActive.setAttribute('aria-current', true);
     }
   }

  function setThumbByColor(context) {
    let selectColors = context.querySelectorAll('.swatches__form--input:checked');

    selectColors.forEach((el) => {
      if (el.name === 'metal' || el.name === 'gold' || el.name === 'color' || el.name === 'colors' || el.name === 'colour' || el.name === 'colours' || el.name === 'colore') {
        var selectColor = el.value;
        let thumbnails = context.querySelectorAll('.js-thumb-item');

        thumbnails.forEach((item, i) => {
          let color = item.dataset.group;

          if ( !color ) return false;
          let currentColor = selectColor.replace(/\s+/g, '-').toLowerCase();
          if (color == currentColor) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      }
    });
  }

  return {
    init: init,
    mainSlider: mainSlider,
    thumbSlider: thumbSlider,
    thumbnails: thumbnails,
    setThumbPos: setThumbPos,
    galleryEvents: galleryEvents,
    removeFocus: removeFocus,
    addFocus: addFocus,
    enlargePhoto: enlargePhoto,
    switchMedia: switchMedia,
    setActiveThumbnail: setActiveThumbnail,
    setThumbByColor: setThumbByColor
  };
})();

ProductMasonryGallery = (function(container) {
  function init(context, sectionId, events, Product) {
    let config = JSON.parse(context.querySelector('[data-gallery-config]').dataset.galleryConfig || '{}'),
        main = context.querySelector('.js-scroll-gallery');

    if ( !main ) return false;

    if ( config.clickToEnlarge ) ProductMasonryGallery.enlargePhoto(context);


    if ( WAU.Helpers.isDevice() ) {
      this.mobileCarouselInit(main, config, context);
    } else {
      this.mobileCarouselDestroy(main);
      this.masonryInit(main, context);
    }

    window.addEventListener('resize', WAU.Helpers.debounce((event) => {
			if ( WAU.Helpers.isDevice() ) {
        this.mobileCarouselInit(main, config, context);
      } else {
        this.mobileCarouselDestroy(main);
        this.masonryInit(main, context);
      }
		}, 300).bind(this));

  }
  function masonryInit(main, context) {
    var imgLoad = imagesLoaded( main );
    function onAlways() {
      ProductMasonryGallery.galleryEvents(main, context);
    }
    if (main) {
      imgLoad.on( 'always', onAlways )
    }
  }
  function galleryEvents(main, context) {
    document.addEventListener("shopify:section:load", function(event) {
      if (event.target.querySelector('[data-section-type="product"]')) {
         ProductMasonryGallery.masonryInit(main, context);
      }
    });

    /* On Variant Change and Initial Load */
    Events.on('variantchange:image', function(id, context){

      if ( id === null ) return false;

      var el = main.querySelector("[data-image-id='" + id + "']");

      // Bail if not masonry gallery.
      if (context.dataset.productGallery != 'masonry') return false;

      ProductMasonryGallery.switchMedia(main, id, context);

      ProductMasonryGallery.scrollIntoView(el);
    });
  }
  function scrollIntoView(element) {
    if (!element) {
      console.log('Error. Must provide an element to scroll to.');
      return false;
    }
    setTimeout(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 500)
  }
  function switchMedia(main, mediaId, context) {
    let currentMedia = main.querySelector('[data-product-single-media-wrapper]:not(.inactive)'),
        newMedia = main.querySelector('[data-product-single-media-wrapper]' + "[data-thumbnail-id='product-template-" + mediaId +"']"),
        otherMedia = main.querySelectorAll('[data-product-single-media-wrapper]' + ":not([data-thumbnail-id='product-template-" + mediaId + "'])");

    if (currentMedia) {
      currentMedia.dispatchEvent(
        new CustomEvent('mediaHidden', {
          bubbles: true,
          cancelable: true
        })
      );
    }

    if (newMedia) {
      newMedia.classList.add('active-slide');
      newMedia.classList.remove('inactive');
      newMedia.dispatchEvent(
        new CustomEvent('mediaVisible', {
          bubbles: true,
          cancelable: true
        })
      );
    }

    if (otherMedia) {
      otherMedia.forEach(
        function(el) {
          el.classList.add('inactive');
          el.classList.remove('active-slide');
        }.bind(this)
      );
    }
  }
  function mobileCarouselInit(main, config, context) {
    var flkty = new Flickity( main, {
      // options
      wrapAround: true,
      cellAlign: 'left',
      draggable: true,
      pageDots: true,
      prevNextButtons: true,
      autoPlay: false,
      selectedAttraction: 0.2,
      friction: 0.8,
      dragThreshold: 5,
      adaptiveHeight: true,
      imagesLoaded: true,
      arrowShape: 'M71.9,95L25.1,52.2c-0.6-0.6-0.9-1.3-0.9-2.2s0.3-1.6,0.9-2.2L71.9,5l3.9,4.3L31.4,50l44.4,40.7L71.9,95z',
      on: {
        ready: function() {
          setTimeout(function(){
            var flkty = Flickity.data( main );
            context.querySelector('.flickity-enabled').style.height = null;
            flkty.resize();
          }, 200);

          ProductMasonryGallery.mobileGalleryEvents(this, context, main);
        },
        change: function() {
          ProductMasonryGallery.switchMedia(main, this.selectedElement.dataset.imageId, context);
        },
        dragStart: function () {
          document.ontouchmove = e => e.preventDefault();
        },
        dragEnd: function () {
          document.ontouchmove = () => true
        }
      }
    });
  }
  function mobileCarouselDestroy(main) {
    var flkty = Flickity.data(main);
    if ( !flkty ) return false;
    flkty.destroy();
  }
  function mobileGalleryEvents(flkty, context, main) {

    /* On Variant Change and Initial Load */
    Events.on('variantchange:image', function(id, context){

      if ( id === null ) return false;

      /* Select new image in flickity */
      var el, index, curFlkty;

      el = main.querySelector("[data-image-id='" + id + "']");
      if (!el) return false;
      index = parseInt(el.dataset.slideIndex);

      curFlkty = Flickity.data( main );
      if ( curFlkty ) curFlkty.select( index );

    });
  }
  function enlargePhoto(context) {

    let buttons = context.querySelectorAll('.js-zoom-btn');

    if ( !buttons ) return false;

    buttons.forEach((button, i) => {
      button.addEventListener('click', function (event) {
        event.preventDefault();

        if ( WAU.Helpers.isDevice() && button.tagName == 'IMG' ) return false;

        var btn = event.target,
            index = btn.getAttribute('data-index'),
            index = parseInt(index,10);

        const loader = new WAU.Helpers.scriptLoader();
        loader.load([jsAssets.zoom]).then(() => {
          openPhotoSwipe(index);
        });

      });
    });

    var openPhotoSwipe = function(index) {
      var pswpElement = document.querySelectorAll('.pswp')[0];

      let images = context.querySelectorAll('#main-image-gallery .image-slide');

      if ( images.length < 2 ) {
        var arrows = false;
      } else {
        var arrows = true;
      }

      let items = [];
      images.forEach((image, i) => {
        let imageTag = image.querySelector('.product__image');

        let item = {
          src: imageTag.getAttribute('data-zoom-src'),
          w: imageTag.getAttribute('width'),
          h: imageTag.getAttribute('height')
        }
        items.push(item);
      });

      var options = {
        index: index,
        arrowEl: arrows,
        captionEl: false,
        closeOnScroll: false,
        counterEl: false,
        history: false,
        fullscreenEl: false,
        preloaderEl: false,
        shareEl: false,
        tapToClose: false,
        zoomEl: true
      };

      var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();

      gallery.listen('afterChange', function() {
        var flkty = Flickity.data('.js-scroll-gallery');
        var newIndex = gallery.getCurrentIndex();
        if ( !flkty ) return false;
        flkty.select (newIndex);
      });

    };
  }
  return {
    init,
    masonryInit,
    galleryEvents,
    scrollIntoView,
    switchMedia,
    mobileCarouselInit,
    mobileCarouselDestroy,
    mobileGalleryEvents,
    enlargePhoto
  }
})();

ProductSet = (function() {
  function init(container) {
    const loader = new WAU.Helpers.scriptLoader();
    loader.load([jsAssets.flickity]).finally(() => {});

    WAU.Slideout.init("product-set");

    let setProducts = container.querySelectorAll('.js-set-product');
    setProducts.forEach(item => Product(item));
    var data = {};
        data = setData(container, data);

    Events.on("variantinputchange", function (variant) {
      // Update variant data for adding to cart
      data = setData(container, data);

      // Update selected variants in product form
      var variantContext = document.querySelector(`.js-product-set-selected[data-variant-id="${variant.id}"]`).parentNode;
      variantContext.querySelectorAll('.js-product-set-selected').forEach(item => item.classList.remove('active--image'));
      variantContext.querySelector(`.js-product-set-selected[data-variant-id="${variant.id}"]`)?.classList.add('active--image');

      // Update price on selected variant
      variantContext.querySelector(`.js-product-set-selected[data-variant-id="${variant.id}"]`).setAttribute('data-variant-price', variant.price);
      var setPrice = 0;
      document.querySelectorAll('.js-product-set-selected.active--image').forEach(item => {
        let itemPrice = item.getAttribute('data-variant-price');
        setPrice += parseInt(itemPrice);
      });
      container.querySelector('.js-product-set-price').innerHTML = WAU.Helpers.formatMoney(setPrice);
    });

    Events.on('variantinputchange:image', function(id, context){
      if ( id === null ) return false;
      context.querySelectorAll('.active--image').forEach(item => item.classList.remove('active--image'));
      context.querySelector(`img[data-image-id="${id}"]`)?.classList.add('active--image');
    });

    let customSubmits = document.querySelectorAll('.js-custom-submit');
    customSubmits.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        if (!data) return false;
        WAU.AjaxCart.addItemsToCart(data, event.target);
      });
    });
  }
  function setData(container, data) {
    let forms = container.querySelectorAll('.product__form-buttons');
    var items = [];

    for (const prop of Object.getOwnPropertyNames(data)) {
      delete data[prop];
    }

    var data = {};
    forms.forEach((form) => {
      let varID = form.querySelector('#formVariantId').value,
          setTitle = container.dataset.setTitle;
      var item = {};

      item.id = parseInt(varID);
      item.quantity = 1;
      item.properties = {
        'Product Set': setTitle
      }
      items.push(item);

      data = { items };
    });

    return data;
  }
  return {
    init,
    setData
  }
})();

function Product(container) {
  var events = new EventEmitter3();
  events.trigger = events.emit; // alias

  var productJson = container.querySelector('.product-json');

  if ( !productJson ) return false;

  var Product = productJson.innerHTML,
      Product = JSON.parse(Product || '{}');

  var sectionId = container.dataset.sectionId;

  let productModals = container.querySelectorAll('[data-wau-modal-content]');
  if (productModals.length > 0) {
    productModals.forEach(modal => {
      WAU.Modal.init(modal.dataset.wauModalContent);
    });
  }

  if ( container.querySelector("[data-product-form]") ) {
    ProductForm(container, sectionId, events, Product);
  }

  if ( container.getAttribute('data-product-gallery') === 'thumbnail' ) {
    ProductGallery.init(container, sectionId, events, Product);
  }

  if ( container.getAttribute('data-product-gallery') === 'masonry' ) {
    ProductMasonryGallery.init(container);
  }

  if ( container.querySelectorAll('[data-product-property]').length > 0) {
    ProductProperties(container);
  }

  if ( container.querySelector('[data-recipient-form]') ) {
    GiftCardRecipient(container, sectionId, events, Product);
  }

  if ( document.querySelector("[data-product-details]") ) {
    ProductDetails(document.querySelector("[data-product-details]"), events, Product);
  }

  /* Product media */
  if ( container.querySelectorAll('[data-product-media-type-video]').length > 0 ) {
    setTimeout(function() {
      container.querySelectorAll('[data-product-media-type-video]').forEach(function (item, sectionId) {
        ProductVideo.init(item, sectionId);
      });
    }, 90);
  }

  let modelViewerElements = container.querySelectorAll('[data-product-media-type-model]');

  if ( modelViewerElements.length > 0 ) {
    setTimeout(function() {
      ProductModel.init(modelViewerElements, sectionId);
    }, 90);
  }

  var self = this;

  document.addEventListener('shopify_xr_launch', function() {
    var currentMedia = document.querySelector('[data-product-single-media-wrapper]:not(.inactive)', self);

    currentMedia.dispatchEvent(
      new CustomEvent('xrLaunch', {
        bubbles: true,
        cancelable: true
      })
    );
  });
}

GiftCardRecipient = function (context, sectionId, events, Product) {
  const container = context.querySelector(".recipient-form");
  if (!container) return false;
  const recipientCheckbox = container.querySelector(`#Recipient-Checkbox-${ sectionId }`);
  recipientCheckbox.disabled = false;
  const emailInput = container.querySelector(`#Recipient-email-${ sectionId }`);
  const nameInput = container.querySelector(`#Recipient-name-${ sectionId }`);
  const messageInput = container.querySelector(`#Recipient-message-${ sectionId }`);
  const hiddenField = container.querySelector(`#Recipient-Control-${ sectionId }`);
  hiddenField.disabled = true;
  const form = container.closest('.js-prod-form-submit');
  const formSubmitButton = form.querySelector('.js-ajax-submit');
  const defaultErrorMessage = context.querySelector('.js-error-msg').innerHTML;

  form.addEventListener('change', handleChange);

  function handleChange(event) {
    if (!recipientCheckbox.checked) {
      clearForm();
    } else {
      emailInput.required = true;
    }
  }

  function clearForm() {
    clearErrorMessage();
    emailInput.value = '';
    nameInput.value = '';
    messageInput.value = '';
    emailInput.required = false;
  }

  function clearErrorMessage() {
    container.querySelectorAll('.recipient-fields .form__message').forEach(field => {
      field.classList.add('hidden');
      const textField = field.querySelector('.error-message');
      if (textField) textField.innerText = '';
    });
  }

  function displayErrorMessage(title, body, formContext) {
    if (!form.isSameNode(formContext)) return;
    clearErrorMessage();
    if (typeof body === 'object') {
      return Object.entries(body).forEach(([key, value]) => {
        const errorMessageId = `RecipientForm-${ key }-error-${ sectionId }`
        const fieldSelector = `#Recipient-${ key }-${ sectionId }`;
        const placeholderElement = container.querySelector(`${fieldSelector}`);
        const label = placeholderElement?.getAttribute('placeholder') || key;
        const message = `${label} ${value}`;
        const errorMessageElement = container.querySelector(`#${errorMessageId}`);
        const errorTextElement = errorMessageElement?.querySelector('.error-message')
        if (!errorTextElement) return;

        errorTextElement.innerText = `${message}.`;
        errorMessageElement.classList.remove('hidden');
      });
    }
  }

  function updateErrorMessage(title, config, formContext) {
    if (!form.isSameNode(formContext)) return;

    const errorMessage = context.querySelector('.js-error-msg');
    if (!errorMessage) {
      console.warn('No error message found.');
      return;
    }
    errorMessage.innerHTML = `<b>${config.form_error}</b> ${title}`;

    // Set back to default
    setTimeout(() => {
      errorMessage.innerHTML = defaultErrorMessage;
    }, 4000)
  }

  Events.on('recipientform:errors', function(title, body, config, addToCartForm) {
    displayErrorMessage(title, body, addToCartForm);
    updateErrorMessage(title, config, addToCartForm);
  });
};

document.querySelectorAll('[data-section-type="product"]').forEach(function(container, i){
  Product(container);
});

document.querySelectorAll('[data-section-type="product-set"]').forEach(function(container, i) {
  ProductSet.init(container);
});

document.addEventListener("shopify:section:select", function(event) {
  if (event.target.querySelector('[data-section-type="product-set"]')) ProductSet.init(event.target.querySelector('[data-section-type="product-set"]'));
});

document.addEventListener("shopify:block:select", function(event) {
  if (event.target.querySelector('[data-section-type="product"]')) Product(event.target.querySelector('[data-section-type="product"]'));

  if (event.target.querySelector('[data-section-type="product-set"]')) ProductSet.init(event.target.querySelector('[data-section-type="product-set"]'));
});

document.addEventListener("shopify:section:load", function(event) {
  if (event.target.querySelector('[data-section-type="product"]')) Product(event.target.querySelector('[data-section-type="product"]'));

  if (event.target.querySelector('[data-section-type="product-set"]')) ProductSet.init(event.target.querySelector('[data-section-type="product-set"]'));
});
