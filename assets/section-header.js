const Header = {
  init: function init(container) {
    const themeHeader = document.querySelector(".js-theme-header"),
          clearElement = document.querySelector(".js-clear-element"),
          menuItemsWithNestedDropdowns = document.querySelectorAll(".js-menuitem-with-nested-dropdown"),
          doubleTapToGoItems = document.querySelectorAll(".js-doubletap-to-go"),
          searchSlideout = container.querySelector('.searchbox');

    if (container.querySelector('.js-stickynav')) {
      setTimeout(function() {
        Header.clearSticky();
        Header.prepareSticky();
      }, 1000);
    }

    if ( document.querySelectorAll('.js-search-toggle').length > 0 ) {
      Header.initSearch(container, searchSlideout);
    }

    if ( menuItemsWithNestedDropdowns ) {
      Header.nestedDropdowns(menuItemsWithNestedDropdowns);
    }

    if ( doubleTapToGoItems ) {
      Header.doubleTapToGo(doubleTapToGoItems);
    }

    // Aria support
    WAU.a11yHelpers.setUpAriaExpansion();
    WAU.a11yHelpers.setUpAccessibleNavigationMenus();

    window.addEventListener('resize', function (event) {
      setTimeout(function() {
        Header.clearSticky();
        Header.prepareSticky();
      }, 1000);
    });
    document.addEventListener('shopify:section:select', function (event) {
      setTimeout(function() {
        Header.clearSticky();
        Header.prepareSticky();
      }, 1000);
    });
  },
  /**
   * Helper method to clear left overs from sticky container. In the context of
   * the Theme Editor integration.
   * @return {[type]} [description]
   */
  clearSticky: function clearSticky() {

    // Get the elements.
    const headerEl = document.querySelector(".js-theme-header");
    const clearEls = document.querySelectorAll('.js-clear-element');

    // Bail if no header element.
    if (!headerEl) {
      console.warn('Warning. Did not find an element to clear.')
      return false;
    }

    // Remove sticky navigation class from header.
    if (headerEl.classList.contains('sticky--active')) {
      headerEl.classList.remove('sticky--active');
    }
    // Check that we have a style attribute and remove it.
    if (headerEl.hasAttribute('style')) {
      headerEl.removeAttribute('style');
    }
  },
  prepareSticky: function prepareSticky() {
    let isMobile = window.innerWidth < 767,
        topBar = document.querySelector(".js-top-bar"),
        isSticky = false,
        elementClass, elementHeight, amountToScroll;

    switch ( isMobile ) {
      case true:
        amountToScroll = 0;
        elementClass = ".js-mobile-header";
        elementHeight = (document.querySelector(".js-mobile-header")) ? document.querySelector(".js-mobile-header").clientHeight : '';
        isSticky = (document.querySelector(".js-mobile-header")) ? document.querySelector(".js-mobile-header").classList.contains("stickynav") : '';
        break;
      case false:
        if (topBar) {
          amountToScroll = topBar.clientHeight
        } else {
          amountToScroll = 0;
        }

        elementClass = ".js-theme-header";
        elementHeight = (document.querySelector(".js-theme-header")) ? document.querySelector(".js-theme-header").clientHeight : '';
        isSticky = (document.querySelector(".js-theme-header")) ? document.querySelector(".js-theme-header").classList.contains("stickynav") : '';
        break;
    }

    function updateHeaderEventHandler(event) {

      const stickyElement = document.querySelector(elementClass);
      // let headerHeight = stickyElement.offsetHeight + 15;

      WAU.Helpers.makeSticky(amountToScroll, elementClass, elementHeight);

      if ((document.body.getBoundingClientRect()).top > scrollPos) {
        stickyElement.style.opacity = 1;
        stickyElement.style.top = `0px`;
        if ((document.body.getBoundingClientRect()).top >= 10) {
          stickyElement.style.zIndex = 1;
        } else {
          stickyElement.style.zIndex = 15;
        }
      } else if ((document.body.getBoundingClientRect()).top <= -300) {
        stickyElement.style.zIndex = 0;
        stickyElement.style.opacity = 0;
        stickyElement.style.top = `-${elementHeight}px`;
      };

      scrollPos = (document.body.getBoundingClientRect()).top;

      if (document.querySelector(".js-theme-header").classList.contains("stickynav") ? false : true) {
        window.removeEventListener('scroll', updateHeaderEventHandler);
      }
    }

    if (isSticky) {
      var scrollPos = 0;

      if (typeof updateHeaderEventHandler == 'function') {
        window.addEventListener('scroll', updateHeaderEventHandler);
      }
    } else {
      if (typeof updateHeaderEventHandler == 'function') {
        window.removeEventListener('scroll', updateHeaderEventHandler);
      }
    }
  },
  nestedDropdowns: function nestedDropdowns(dropdown) {
    // Making sure that nested dropdowns are properly placed in the correct place if they're offscreen.
    dropdown.forEach(function (menuItem) {
      menuItem.addEventListener('mouseenter', function (event) {
        const nestedDropdown = menuItem.querySelector(".js-dropdown-nested");

        if (nestedDropdown) {
          if (WAU.Helpers.isElementPastEdge(nestedDropdown)) {
            nestedDropdown.classList.add("dropdown--edge");

            // Check if first level menu item
            if (menuItem.classList.contains('js-first-level')) {
              // Add relative class
              menuItem.classList.add('relative');
            }

          }
        }

      });
    });
  },
  doubleTapToGo: function doubleTapToGo(items) {
    items.forEach(function (doubleTapItem) {
      let preventClick = false,
        prevEventTarget = undefined;

      const activeClass = doubleTapItem.getAttribute("data-active-class");

      Events.on("device:touchstart", function() {
        preventClick = true;
      });

      doubleTapItem.addEventListener("click", function (event) {
        if (preventClick) {
          event.preventDefault();
        }
      });

      doubleTapItem.addEventListener("touchstart", function (event) {
        event.target.setAttribute("aria-expanded", "false");
        Header.closeMenu(activeClass);

        if (prevEventTarget === event.target) {
          preventClick = false;
        } else {
          event.target.classList.toggle(activeClass);
          event.target.setAttribute("aria-expanded", "true");
        }

        prevEventTarget = event.target;
      }, {passive: true});
    });
  },
  closeMenu: function closeMenu(activeClass) {
    document
      .querySelectorAll(`[data-active-class="${activeClass}"]`)
      .forEach(function (activeMenu) {
        activeMenu.classList.remove(activeClass);
      });
  }
}

document.querySelectorAll('[data-section-type="header"]').forEach(function(container){
  Header.init(container);
});
