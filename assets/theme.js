!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).EventEmitter3=e()}}(function(){return function i(s,f,c){function u(t,e){if(!f[t]){if(!s[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(a)return a(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var o=f[t]={exports:{}};s[t][0].call(o.exports,function(e){return u(s[t][1][e]||e)},o,o.exports,i,s,f,c)}return f[t].exports}for(var a="function"==typeof require&&require,e=0;e<c.length;e++)u(c[e]);return u}({1:[function(e,t,n){"use strict";var r=Object.prototype.hasOwnProperty,v="~";function o(){}function f(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function i(e,t,n,r,o){if("function"!=typeof n)throw new TypeError("The listener must be a function");var i=new f(n,r||e,o),s=v?v+t:t;return e._events[s]?e._events[s].fn?e._events[s]=[e._events[s],i]:e._events[s].push(i):(e._events[s]=i,e._eventsCount++),e}function u(e,t){0==--e._eventsCount?e._events=new o:delete e._events[t]}function s(){this._events=new o,this._eventsCount=0}Object.create&&(o.prototype=Object.create(null),(new o).__proto__||(v=!1)),s.prototype.eventNames=function(){var e,t,n=[];if(0===this._eventsCount)return n;for(t in e=this._events)r.call(e,t)&&n.push(v?t.slice(1):t);return Object.getOwnPropertySymbols?n.concat(Object.getOwnPropertySymbols(e)):n},s.prototype.listeners=function(e){var t=v?v+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var r=0,o=n.length,i=new Array(o);r<o;r++)i[r]=n[r].fn;return i},s.prototype.listenerCount=function(e){var t=v?v+e:e,n=this._events[t];return n?n.fn?1:n.length:0},s.prototype.emit=function(e,t,n,r,o,i){var s=v?v+e:e;if(!this._events[s])return!1;var f,c,u=this._events[s],a=arguments.length;if(u.fn){switch(u.once&&this.removeListener(e,u.fn,void 0,!0),a){case 1:return u.fn.call(u.context),!0;case 2:return u.fn.call(u.context,t),!0;case 3:return u.fn.call(u.context,t,n),!0;case 4:return u.fn.call(u.context,t,n,r),!0;case 5:return u.fn.call(u.context,t,n,r,o),!0;case 6:return u.fn.call(u.context,t,n,r,o,i),!0}for(c=1,f=new Array(a-1);c<a;c++)f[c-1]=arguments[c];u.fn.apply(u.context,f)}else{var l,p=u.length;for(c=0;c<p;c++)switch(u[c].once&&this.removeListener(e,u[c].fn,void 0,!0),a){case 1:u[c].fn.call(u[c].context);break;case 2:u[c].fn.call(u[c].context,t);break;case 3:u[c].fn.call(u[c].context,t,n);break;case 4:u[c].fn.call(u[c].context,t,n,r);break;default:if(!f)for(l=1,f=new Array(a-1);l<a;l++)f[l-1]=arguments[l];u[c].fn.apply(u[c].context,f)}}return!0},s.prototype.on=function(e,t,n){return i(this,e,t,n,!1)},s.prototype.once=function(e,t,n){return i(this,e,t,n,!0)},s.prototype.removeListener=function(e,t,n,r){var o=v?v+e:e;if(!this._events[o])return this;if(!t)return u(this,o),this;var i=this._events[o];if(i.fn)i.fn!==t||r&&!i.once||n&&i.context!==n||u(this,o);else{for(var s=0,f=[],c=i.length;s<c;s++)(i[s].fn!==t||r&&!i[s].once||n&&i[s].context!==n)&&f.push(i[s]);f.length?this._events[o]=1===f.length?f[0]:f:u(this,o)}return this},s.prototype.removeAllListeners=function(e){var t;return e?(t=v?v+e:e,this._events[t]&&u(this,t)):(this._events=new o,this._eventsCount=0),this},s.prototype.off=s.prototype.removeListener,s.prototype.addListener=s.prototype.on,s.prefixed=v,s.EventEmitter=s,void 0!==t&&(t.exports=s)},{}]},{},[1])(1)});

window.theme = window.theme || {};
window.themeInfo = {name: "Forge"};

var Events = new EventEmitter3();
Events.trigger = Events.emit; // trigger alias

/*============================================================================
 Underground Functions
==============================================================================*/
window.WAU = window.WAU || {};

/* ---- WAU SLIDEOUT - v1.0 ---- */
WAU.Slideout = (function() {
  /*
   * Elements
   */
  var wrapper = undefined;

  /*
   * @description - Makes sure that the ESC Key works to close the menus.
   */
  document.addEventListener('keyup', function(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeActiveSlideout();
    }
  });

  document.addEventListener('click', function(event) {
    if (event.target === document.querySelector(".js-slideout-overlay")) {
      closeActiveSlideout();
    }
  });

  /*
   * @description - Closes the currently active slide.
   */
  function closeActiveSlideout() {
    // Find the open slideout.
    const activeSlideout = document.querySelector('.slideout--active');
    const activeSlideoutName = activeSlideout.getAttribute('data-wau-slideout');
    const opener = document.querySelector('.js-slideout-open[data-wau-slideout-target="' + activeSlideoutName + '"]');
    const direction = opener ? opener.getAttribute('data-slideout-direction') : 'left';
    const accordionsClosed = activeSlideout.getAttribute('data-wau-accordions-closed');

    if (accordionsClosed !== null) {
      WAU.Accordion.hideAll(activeSlideoutName);
    }

    close(direction, opener);
  }

  /*
   * @description - Checks if the slideout is currently open or not.
   * @return Boolean
   */
  function isOpen() {
    wrapper = document.querySelector(".js-slideout-toggle-wrapper");
    return wrapper.classList.contains("slideout-left--open") || wrapper.classList.contains("slideout-right--open");
  }

  /*
   * @description - Open a specific slideout in a specific direction.
   * @param direction:String - the drction to open the slideout in.
   * @param targetSlideoutEl:Node - The slideout element that will be opened.
   */
  function open(direction, targetSlideoutEl, opener) {
    wrapper.classList.add("slideout-" + direction + "--open");
    wrapper.classList.remove("slideout-" + direction + "--closed");
    let isTopSlideout = targetSlideoutEl.classList.contains('slideout__drawer-top');

    if ( targetSlideoutEl.dataset.wauOverlay == "false" ) {
      wrapper.classList.add("slideout--no-overlay");
    }

    opener.setAttribute("aria-expanded", "true");

    // Fix body wrapper so no scrolling on mobile
    let scrollPosition = Math.abs(0 - document.querySelector('.site-wrap').getBoundingClientRect().top);

    let slideoutName = targetSlideoutEl.dataset.wauSlideout;
    wrapper.classList.add("slideout-" + slideoutName + "--open");

    Events.trigger('slideout:open:' + slideoutName, targetSlideoutEl);

    // Aria and Active classes
    targetSlideoutEl.setAttribute('aria-hidden', 'false');

    setTimeout(function() {
      targetSlideoutEl.classList.add('slideout--active');
      targetSlideoutEl.classList.remove('slideout--close');
    }, 350);

    // Trapfocus on slideout until closed
    trapFocus(targetSlideoutEl)

    wrapper.style.overflow = 'hidden';
    if (!isTopSlideout) {
      wrapper.style.position = 'fixed';
      wrapper.style.top = `-${scrollPosition}px`;
    }
    wrapper.style.width = '100%';
  }

  /*
   * @description - Closes all slideouts. Puts a11y focus back on the original opener.
   * @param opener:Node - the opener element.
   */
  function close(direction, opener) {
    const activeOpenSlideouts = document.querySelectorAll('.slideout--active');
    const openers = document.querySelectorAll(".js-slideout-open");
    const closers = document.querySelectorAll(".js-slideout-close");

    // Remove content if quickview
    if (opener && opener.getAttribute("aria-controls") == 'quickview') {
      document.querySelector('.js-quickview-content').innerHTML = '';
    }

    // Close the slideout.
    wrapper.classList.remove("slideout-" + direction + "--open");
    wrapper.classList.add("slideout-" + direction + "--closed");

    if ( wrapper.classList.contains("slideout--no-overlay") ) {
      wrapper.classList.remove("slideout--no-overlay");
    }

    // Close all active drawers. This is incase there is more than 1 slide on a direction.
    activeOpenSlideouts.forEach(function(activeSlideoutDrawer) {
      activeSlideoutDrawer.classList.remove('slideout--active');

      const accordionsClosed = activeSlideoutDrawer.getAttribute('data-wau-accordions-closed');
      const activeSlideoutName = activeSlideoutDrawer.getAttribute('data-wau-slideout');

      if (accordionsClosed !== null) {
        WAU.Accordion.hideAll(activeSlideoutName);
      }

      wrapper.classList.remove("slideout-" + activeSlideoutName + "--open");
      Events.trigger('slideout:close:' + activeSlideoutName, activeSlideoutDrawer);

      // Aria and Active classes
      activeSlideoutDrawer.classList.remove('slideout--active');
      activeSlideoutDrawer.classList.add('slideout--close');

      setTimeout(function() {
        activeSlideoutDrawer.setAttribute('aria-hidden', 'true');
      }, 350);

      // Remove focus on button
      if (activeSlideoutDrawer.querySelector('.js-slideout-close')) activeSlideoutDrawer.querySelector('.js-slideout-close').blur();
    });

    // Makes sure aria-expanded false is added to all the open and close buttons.
    openers.forEach(function(opener) {
      opener.setAttribute('aria-expanded', 'false');
    });

    closers.forEach(function(closer) {
      closer.setAttribute('aria-expanded', 'false');
    });

    // Fix body wrapper so no scrolling on mobile
    let scrollPosition = Math.abs(0 - document.querySelector('.site-wrap').getBoundingClientRect().top);

    wrapper.style.removeProperty('overflow');
    wrapper.style.removeProperty('position');
    wrapper.style.removeProperty('top');
    wrapper.style.removeProperty('width');
    window.scrollTo(0, scrollPosition);
  }

  /*
   * @description - Closes a specific slideout given the name in data-wau-slideout attribute
   * @return void
   */
  function closeByName(name) {
    const closer = document.querySelector('[data-wau-slideout-target="' + name + '"]');
    const direction = closer.getAttribute('data-slideout-direction');
    const opener = document.querySelector('.js-slideout-open[data-wau-slideout-target="' + name + '"]');
    close(direction, opener);
  }

  /*
   * @description - Opens a specific slideout given the name in data-wau-slideout attribute
   * @return void
   */
  function openByName(name) {
    const opener = document.querySelector('[data-wau-slideout-target="' + name + '"]')
    const direction = opener ? opener.getAttribute('data-slideout-direction') : 'left';
    const targetSlideoutEl = document.querySelector('[data-wau-slideout="' + name + '"]');
    open(direction, targetSlideoutEl, opener);
  }

  /*
   * @description - Creates a new aside element to be used as a slideout.
   * @param direction:String - the direction that the slideout will open in. "left" or "right"
   * @param name:String - An explicit name to refer to the slideout by on a trigger.
   * @param wrapperEl:Node - An element that can be explicitly passed in as the wrapper element.
   */
  function createSlideoutEl(direction, name, wrapperEl) {

    const aside = document.createElement('aside');
    const innerDiv = document.createElement('div');
    const innerContentDiv = document.createElement('div');
    const opener = document.querySelector('[data-wau-slideout-target="' + name + '"]');
    const content = document.querySelector('[data-wau-slideout-content="' + name + '"]');
    const generatedId = "slideout-" + name;

    wrapperEl = wrapperEl || wrapper;

    if (content.hasAttribute('data-wau-accordions-closed')) {
      aside.setAttribute('data-wau-accordions-closed', '');
    }

    // Create outer wrapper
    aside.classList.add('slideout');
    aside.classList.add('slideout__drawer-' + direction);
    aside.setAttribute('data-wau-slideout', name);
    aside.setAttribute('id', generatedId); // setting an id here so that we can set the aria-controls attribute on the opener.

    // Create inner wrapper and move content to it
    innerDiv.classList.add('slideout__inner-wrapper');
    innerDiv.classList.add('slideout__general-slide__wrapper');
    innerContentDiv.innerHTML = content.innerHTML;
    innerContentDiv.classList.add('slideout__inner-content-container');

    // Empty content so no conflict
    content.innerHTML = '';

    // Add close button to Inner
    if (content.dataset.wauSlideoutButton && content.dataset.wauSlideoutButton == 'true') {
      let closeDiv = createCloser(name, direction);
      innerDiv.prepend(closeDiv);
    }

    // Add inner wrapper to outer wrapper
    aside.appendChild(innerDiv);
    innerDiv.appendChild(innerContentDiv);

    opener.setAttribute('aria-controls', generatedId);
    wrapperEl.appendChild(aside);

    return aside;
  }


  /*
   * @description - Empties inner wrapper of slideout and replaces content with previous content
   */
  function reloadSlideoutContents(name) {
    const content = document.querySelector('[data-wau-slideout-content="' + name + '"]');
    const drawer = document.querySelector('aside[data-wau-slideout="' + name + '"]');
    const innerWrapper = drawer.querySelector('.slideout__inner-content-container');

    innerWrapper.innerHTML = content.innerHTML;
  }

  /*
   * @description - Traps keyboard focus inside slideout when open
   */
  function trapFocus(activeSlideout) {
    // add all the elements inside modal which you want to make focusable
    const focusableElements =
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const firstFocusableElement = activeSlideout.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    const focusableContent = activeSlideout.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

    document.addEventListener('keydown', function(e) {
      let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

      if (!isTabPressed) {
        return;
      }

      if (e.shiftKey) { // if shift key pressed for shift + tab combination
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus(); // add focus for the last focusable element
          e.preventDefault();
        }
      } else { // if tab key is pressed
        if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
          firstFocusableElement.focus(); // add focus for the first focusable element
          e.preventDefault();
        }
      }
    });

    firstFocusableElement.focus();
  }

  /*
   * @description - Initializes the plugin by adding all of the appropriate event listeners.
   */
  function init(name) {
    if (typeof name === "undefined") {
      console.log("The Slideout must have an associated name.");
      return;
    }

    wrapper = document.querySelector('.js-slideout-toggle-wrapper');

    const slideoutOpeners = document.querySelectorAll('.js-slideout-open[data-wau-slideout-target="' + name + '"]');

    let slideoutTargetEl = undefined;

    slideoutOpeners.forEach((slideoutOpener, i) => {
      const slideoutDirection = slideoutOpener.getAttribute('data-slideout-direction');

      if (slideoutOpener) {
        slideoutTargetEl = document.querySelector(`aside[data-wau-slideout=${name}]`);
      }

      if (!slideoutTargetEl) {
        slideoutTargetEl = createSlideoutEl(slideoutDirection, name, wrapper);
      }

      // Set tabindex so it skips hidden slideout

      // Set Aria Hidden on Load
      slideoutTargetEl.setAttribute('aria-hidden', 'true');

      // Trigger event for outside functions to listen and use
      Events.trigger('slideout:active:' + name);
      slideoutOpener.addEventListener('click', function(event) {
        event.preventDefault();
        open(slideoutDirection, slideoutTargetEl, slideoutOpener);
      });

    });

    const slideoutClosers = document.querySelectorAll('.js-slideout-close');

    slideoutClosers.forEach((slideoutCloser, i) => {
      const slideoutCloseDirection = slideoutCloser.getAttribute('data-slideout-direction');
      slideoutCloser.addEventListener('click', function() {
        close(slideoutCloseDirection, slideoutCloser);
      });
    });
  }

  const privateFunctions = {
    openByName,
    closeByName,
    createSlideoutEl,
    reloadSlideoutContents
  };

  let returnObj = {};

  returnObj.init = init;

  /*
   * @description - Gives WAU.Slideout external access to the internal functions for use in Shopify Events.
   */
  Object.keys(privateFunctions).forEach(function(pf) {
    returnObj['_' + pf] = privateFunctions[pf];
  });

  return returnObj;
}());

/* ---- WAU MODAL - v1.0 ---- */
WAU.Modal = (function() {
  /*
   * Elements
   */
  var wrapper = undefined;
  /*
   * @description - Makes sure that the ESC Key works to close the menus.
   */
  document.addEventListener('keyup', function(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeActiveModal();
    }
  });
  document.addEventListener('click', function(event) {
    if (event.target === document.querySelector(".js-modal-overlay")) {
      closeActiveModal();
    }
  });
  /*
   * @description - Closes the currently active modal.
   */
  function closeActiveModal() {
    // Find the open modal.
    const activeModal = document.querySelector('.modal--active');
    const activeModalName = activeModal.getAttribute('data-wau-modal');
    const closer = activeModal.querySelector('.js-modal-close');

    close(closer);
  }
  /*
   * @description - Checks if the modal is currently open or not.
   * @return Boolean
   */
  function isOpen() {
    wrapper = document.querySelector(".js-modal-toggle-wrapper");
    return wrapper.classList.contains("modal--open");
  }
  /*
   * @description - Open a specific modal.
   * @param targetSlideoutEl:Node - The modal element that will be opened.
   */
  function open(targetModalEl, opener) {

		// Fix body wrapper so no scrolling on mobile
    let scrollPosition = Math.abs(0 - document.querySelector('.site-wrap').getBoundingClientRect().top);
    wrapper.style.width = '100%';

		if ( targetModalEl.hasAttribute("data-wau-modal-full") ) {
			wrapper.style.overflowY = 'hidden';
		} else {
			// Stop from scrolling to top
			targetModalEl.style.top = `calc(${scrollPosition}px + 10vh)`;
		}

    wrapper.classList.add("modal--open");
    wrapper.classList.remove("modal--closed");
    targetModalEl.classList.add('modal--active');

    // Add specific modal type class
    if ( targetModalEl.getAttribute("data-wau-modal") ) {
      var elClass = targetModalEl.getAttribute("data-wau-modal"),
          elClass = "modal-" + elClass + "--open";
      wrapper.classList.add(elClass);
    }

    opener.setAttribute("aria-expanded", "true");
  }
  /*
   * @description - Closes all modals. Puts a11y focus back on the original opener.
   * @param opener:Node - the opener element.
   */
  function close(openerEl) {
    const activeOpenModals = document.querySelectorAll('.modal--active');
    const openers = document.querySelectorAll(".js-modal-open");
    const closers = document.querySelectorAll(".js-modal-close");

    // Remove content if quickview
    if (openerEl && openerEl.getAttribute("aria-controls") == 'quickview') {
      document.querySelector('.js-quickview-content').innerHTML = '';
    }

    // Close the Modal.
    wrapper.classList.remove("modal--open");
    wrapper.classList.add("modal--closed");

    // Close all active modals. This is incase there is more than 1..
    activeOpenModals.forEach(function(activeModalDrawer) {
      // Remove specific modal type class
      if ( activeModalDrawer.getAttribute("data-wau-modal") ) {
        var elClass = activeModalDrawer.getAttribute("data-wau-modal"),
            elClass = "modal-" + elClass + "--open";
        wrapper.classList.remove(elClass);
      }

      activeModalDrawer.classList.remove('modal--active');

			// For full width modal
			if ( activeModalDrawer.hasAttribute("data-wau-modal-full") ) {
				wrapper.style.overflowY = 'unset';
			}

    });

    // Makes sure aria-expanded false is added to all the open and close buttons.
    openers.forEach(function(opener) {
      opener.setAttribute('aria-expanded', 'false');
    });
    closers.forEach(function(closer) {
      closer.setAttribute('aria-expanded', 'false');
    });

    // Fix body wrapper so no scrolling on mobile
    wrapper.style.removeProperty('overflow');
    wrapper.style.removeProperty('position');
    wrapper.style.removeProperty('padding-right');
    wrapper.style.removeProperty('top');
    wrapper.style.removeProperty('width');
  }
  /*
   * @description - Closes a specific modal given the name in data-wau-slideout attribute
   * @return void
   */
  function closeByName(name) {
    const closer = document.querySelector('[data-wau-modal-target="' + name + '"]');
    const opener = document.querySelector('.js-modal-open[data-wau-modal-target="' + name + '"]');
    close(opener);
  }
  /*
   * @description - Opens a specific modal given the name in data-wau-slideout attribute
   * @return void
   */
  function openByName(name) {
    const opener = document.querySelector('[data-wau-modal-target="' + name + '"]');
    const targetModalEl = document.querySelector('[data-wau-modal="' + name + '"]');
    open(targetModalEl, opener);
  }
  /*
   * @description - Creates a new close button inside created modal.
   * @param name:String - An explicit name to refer to the modal by on a trigger.
   */
  function createCloser(name) {
    const closeDiv = document.createElement('div');
    const button = document.createElement('button');
    const icon = document.createElement('div');
    closeDiv.classList.add('slideout__trigger--close');
    closeDiv.classList.add('slideout__trigger-' + name + '__wrapper');
    closeDiv.classList.add('slideout__trigger-general-modal__wrapper');
    button.classList.add('slideout__trigger-' + name);
    button.classList.add('slideout__trigger-general-modal');
    button.classList.add('js-modal-close');
    button.setAttribute('aria-controls', 'modal-' + name);
    button.setAttribute('aria-label', 'Close modal');
    icon.classList.add('icn-close');
    button.appendChild(icon);
    closeDiv.appendChild(button);
    return closeDiv;
  }
  /*
   * @description - Creates a new div element to be used as a modal.
   * @param name:String - An explicit name to refer to the modal by on a trigger.
   * @param wrapperEl:Node - An element that can be explicitly passed in as the wrapper element.
   */
  function createModalEl(name, wrapperEl) {
    const div = document.createElement('div');
    const innerDiv = document.createElement('div');
    const innerContentDiv = document.createElement('div');
    const opener = document.querySelector('[data-wau-modal-target="' + name + '"]');
    const content = document.querySelector('[data-wau-modal-content="' + name + '"]');
    const generatedId = "modal-" + name;
    wrapperEl = wrapperEl || wrapper;

    // Create outer wrapper
    div.classList.add('modal');
    div.classList.add('modal__container');
		div.setAttribute('data-wau-modal', name);
		div.setAttribute('id', generatedId); // setting an id here so that we can set the aria-controls attribute on the opener.

		// Set full width
		if ( content && content.hasAttribute('data-wau-modal-full') ) {
			div.setAttribute('data-wau-modal-full', '');
		}

    // Create inner wrapper and move content to it
    innerDiv.classList.add('modal__inner-wrapper');
    innerDiv.classList.add('modal__general-modal__wrapper');
    innerContentDiv.innerHTML = content.innerHTML;
    innerContentDiv.classList.add('modal__inner-content-container');

    // Add close button to Inner
    let closeDiv = createCloser(name);
    innerDiv.prepend(closeDiv);

    // Add inner wrapper to outer wrapper
    div.appendChild(innerDiv);
    innerDiv.appendChild(innerContentDiv);
    opener.setAttribute('aria-controls', generatedId);
    wrapperEl.appendChild(div);
    return div;
  }
  /*
   * @description - Initializes the plugin by adding all of the appropriate event listeners.
   */
  function init(name) {
    if (typeof name === "undefined") {
      console.log("The Modal must have an associated name.");
      return;
    }
    wrapper = document.querySelector('.js-modal-toggle-wrapper');
    const modalOpeners = document.querySelectorAll('.js-modal-open[data-wau-modal-target="' + name + '"]');

    let modalTargetEl = undefined;
    if (modalOpeners) {
      modalTargetEl = document.querySelector(`div[data-wau-modal=${name}]`);
    }

    if (!modalTargetEl) {
      modalTargetEl = createModalEl(name, wrapper);
    }

    modalOpeners.forEach((modalOpener, i) => {
      modalOpener.addEventListener('click', function() {
        open(modalTargetEl, modalOpener);
      });
    });

    const modalClosers = document.querySelectorAll('.js-modal-close');
    modalClosers.forEach(function(modalCloser) {
      modalCloser.addEventListener('click', function() {
        close(modalCloser);
      });
    });
  }
  const privateFunctions = {
    openByName,
    closeByName,
    createModalEl
  };
  let returnObj = {};
  returnObj.init = init;
  /*
   * @description - Gives WAU.Slideout external access to the internal functions for use in Shopify Events.
   */
  Object.keys(privateFunctions).forEach(function(pf) {
    returnObj['_' + pf] = privateFunctions[pf];
  });
  return returnObj;
}());

/* ---- WAU ACCORDION - v1.0 ---- */
WAU.Accordion = (function() {
  const classes = {
    show: "is-active",
    open: "js-accordion-is-open",
    mobileNavAccordion: "js-accordion-mobile-nav"
  };

  const selectors = {
    accordion: ".js-accordion",
    accordionItem: '.c-accordion__item',
    accordionLink: ".js-accordion-link",
    accordionHeader: ".js-accordion-header",
    accordionPanel: ".c-accordion__panel"
  };

  const publicAPIs = {};

  /*
   * @description strips class period
   */
  const stripClassPeriod = function(className) {
    if (!className) return;
    return className.split('.')[1];
  }

  /*
   * @description returns class naem
   */
  publicAPIs.getConfigClass = function(className) {
    if (!className) return;
    if (classes[className] && classes[className] != '') {
      return classes[className];
    } else {
      return false;
    }
  };

  /*
   * @description Hides an accordion item
   */
  publicAPIs.hide = function(target) {

    target.setAttribute("aria-expanded", "false");
    target.parentNode.classList.remove('accordion-expanded');

    const panel = document.querySelector(
      `#${target.getAttribute("aria-controls")}`
    );

    panel.setAttribute("hidden", "");

    // 350 matches the CSS transition timing
    setTimeout(function() {
      panel.style.display = "none";
    }, 100);
  };

  /*
   * @description Hides all accordion items at once
   */
  publicAPIs.hideAll = function(name) {
    const accordion = document.querySelector('[data-accordion-family="' + name + '"]');

    if (!accordion) return false;

    const accordionHeaders = document.querySelectorAll('[data-accordion-family="' + name + '"] > .js-accordion-header');

    accordionHeaders.forEach((item, i) => {
      const target = item.querySelector('[data-toggle="accordion"]');

      // Close each accordion item
      target.setAttribute("aria-expanded", "false");
      target.parentNode.classList.remove('accordion-expanded');

      const panel = document.querySelector(
        `#${target.getAttribute("aria-controls")}`
      );

      panel.setAttribute("hidden", "");

      // 350 matches the CSS transition timing
      setTimeout(function() {
        panel.style.display = "none";
      }, 350);

    });

  };

  /*
   * @description Shows an accordion item
   */
  publicAPIs.show = function(target, allowMultiple) {

    const panel = document.querySelector(
      `#${target.getAttribute("aria-controls")}`
    );

    const parentElement = target.closest(panel.getAttribute("data-parent"));

    const allowMultipleFlag = allowMultiple || parentElement
      .hasAttribute("data-accordion-allow-multiple") ? true : false;

    const isMobileNav = parentElement.classList.contains(classes.mobileNavAccordion);

    if (!allowMultipleFlag && panel.hasAttribute("data-parent")) {

      let childSelector = '';

      if (isMobileNav) {
        childSelector = ':scope > li > [aria-expanded="true"]';
      } else {
        childSelector = ':scope > [aria-expanded="true"]';
      }

      if (!childSelector) {
        return;
      }

      const activePanels = target
        .closest(panel.getAttribute("data-parent"))
        .querySelectorAll(
          childSelector
        );

      if (!activePanels) {
        return;
      }

      activePanels.forEach(function(element) {
        publicAPIs.hide(element);
      });
    }

    target.setAttribute("aria-expanded", "true");
    target.parentNode.classList.add('accordion-expanded');

    panel.removeAttribute("hidden");

    panel.style.display = "block";

  };

  /*
   * @description Toggle showing and hiding an accordion item
   */
  publicAPIs.toggle = function(target, allowMultiple) {

    if (target.getAttribute("aria-expanded") == "true") {
      publicAPIs.hide(target);
      return;
    } else {
      publicAPIs.show(target, allowMultiple);
    }
  };

  /*
   * @description Initialize function
   */
  publicAPIs.init = function() {

    // Hide add accordion panels
    document.querySelectorAll(`[data-toggle="accordion"]:not(.${classes.open})`).forEach(function(element, index) {
      publicAPIs.hide(element);
    });

    // Add keyboard accessibility events
    document.addEventListener('keydown', function(event) {
      let target = event.target;
      const key = event.which.toString();
      const disablePageScroll = false;
      const pageScrollOptions = disablePageScroll ? {
        preventScroll: true
      } : {
        preventScroll: false
      };
      const isDropDownArrow = target.classList.contains('dropdown-arrow');

      if (target.classList.contains(stripClassPeriod(selectors.accordionHeader)) ||
        target.classList.contains(stripClassPeriod(selectors.accordionLink)) ||
        isDropDownArrow) {

        if (key.match(/38|40/)) {

          const isMobile = target.closest(selectors.accordion).classList.contains(classes.mobileNavAccordion) ? true : false;

          const accordionSelector = isMobile ? `:scope > li > ${selectors.accordionLink}` : `:scope > ${selectors.accordionHeader}`;

          const accordions = target.closest(selectors.accordion).querySelectorAll(accordionSelector);

          if (isMobile && isDropDownArrow) {
            target.previousElementSibling.focus(pageScrollOptions);
            return;
          }

          let indexPlace;
          accordions.forEach(function(element, index) {
            if (element == target) {
              indexPlace = index;
            }
          });
          const direction = key.match(/34|40/) ? 1 : -1;
          const length = accordions.length;
          const newIndex = (indexPlace + length + direction) % length;

          accordions[newIndex].focus(pageScrollOptions);
        }
      }
    });

    document.addEventListener("click", function(event) {

      const target = event.target.matches('[data-toggle="accordion"]') ? event.target : event.target.closest('[data-toggle="accordion"]');

      if (!target) {
        return false;
      }

      event.preventDefault();

      publicAPIs.toggle(target);
    });

    document.addEventListener("click", function(event) {
      if (event.target.classList.contains('js-accordion-link')) {
        let url = event.target.getAttribute('href');
        if (url == '') {
          event.preventDefault();

          let target = event.target.parentNode.querySelector('[data-toggle="accordion"]');
          publicAPIs.toggle(target);
        }
      }
    });
  };

  return publicAPIs;
})();

/* ---- WAU HELPERS - v1.0 ---- */
WAU.Helpers = (function() {

  function isTouch() {
    let touchDevice = false;
    touchDevice = (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
    return touchDevice;
  }

  function isMobile() {
    let mobileDevice = false;
    mobileDevice = window.matchMedia('(max-width: 967px)').matches;
    return mobileDevice;
  }

  function isDevice() {
    let mobileDevice = false;
    mobileDevice = window.matchMedia('(max-width: 1023px)').matches;
    return mobileDevice;
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function makeSticky(amountToScroll, elementClass, elementHeight) {
    const clearElement = document.querySelector(".js-desktop-clear-element"),
          stickyElement = document.querySelector(elementClass);

    if ( clearElement.classList.contains('over-content--true') && window.matchMedia('(min-width: 968px)').matches ) {
      height = "0px";
    } else {
      height = elementHeight  + "px";
      clearElement.style.paddingTop = `${height}`;
    }

    if (window.pageYOffset > amountToScroll) {
      stickyElement.classList.add('sticky--active');
    } else {
      stickyElement.classList.remove('sticky--active');
      clearElement.style.paddingTop = `0`;
    }
  }

  function showHide(show, hide) {
    var show = document.getElementById(show);
    show.classList.remove("hide");
    show.classList.add("show");
    show.style.display = 'block';

    var hide = document.getElementById(hide);
    hide.classList.remove("show");
    hide.classList.add("hide");
    hide.style.display='none';
  }

  function Toggle(id) {
    var element = document.getElementById(id);
    if ( element.classList.contains('animate-hide') ) {
      element.classList.remove("animate-hide", "fadeOut");
      element.classList.add("animate-show", "fadeIn");
      element.style.visibility = "visible";
    } else {
    element.classList.remove("animate-show", "fadeIn");
      element.classList.add("animate-hide", "fadeOut");
      element.style.visibility = "hidden";
    }
  }

  function toggleClass(id, className) {
    var element = document.getElementById(id);
    if (!element) return false;
    if ( element.classList.contains(className) ) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  }

  function Accordion(container, tlink, submenu) {

    let accorContent = container.querySelector(submenu);

    if ( !container.querySelector(tlink) ) return false;

    container.querySelector(tlink).addEventListener('click', function(event) {
      event.preventDefault();

      // Toggle class on label and update a11y
      if ( this.classList.contains('closed') ) {
        this.classList.remove('closed');
        this.parentElement.classList.remove('closed');
        this.setAttribute('aria-expanded', 'true');
      } else {
        this.classList.add('closed');
        this.parentElement.classList.add('closed');
        this.setAttribute('aria-expanded', 'false');
      }

      // Show content
      if ( accorContent.classList.contains('closed') ) {
        accorContent.classList.remove("closed");
        accorContent.style.display = "block";
      } else {
        accorContent.classList.add("closed");
        accorContent.style.display = "none";
      }

    });
  }

  function fadeToggle(el, display) {
    var style = display || "block";

    if (el.style.display === 'none') {
      el.style.opacity = 0;
      el.style.display = display || "block";

      (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += 0.1) > 1)) {
          el.style.opacity = val;
          requestAnimationFrame(fade);
        }
      })();

    } else if (el.style.display === style) {
      el.style.opacity = 1;

      (function fade() {
        if ((el.style.opacity -= 0.1) < 0) {
          el.style.display = "none";
        } else {
          requestAnimationFrame(fade);
        }
      })();
    }
  }

  function fadeOut(el){
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  function fadeIn(el, display){
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += 0.1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }

  function getScrollbarWidth() {

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;

  }

  function smoothScrollTo(endX, endY, duration) {
     let startX = window.scrollX || window.pageXOffset,
     startY = window.scrollY || window.pageYOffset,
     distanceX = endX - startX,
     distanceY = endY - startY,
     startTime = new Date().getTime();
     // Easing function
     let easeInOutQuart = function(time, from, distance, duration) {
         if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
         return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
     };
     let timer = window.setInterval(function() {
         let time = new Date().getTime() - startTime,
         newX = easeInOutQuart(time, startX, distanceX, duration),
         newY = easeInOutQuart(time, startY, distanceY, duration);
         if (time >= duration) {
             window.clearInterval(timer);
         }
         window.scrollTo(newX, newY);
     }, 1000 / 60); // 60 fps
  }

  function wrapIframe(options) {
    options.iframes.forEach(function(iframe) {
      var wrapper = document.createElement('div');
      wrapper.classList.add(options.iframeWrapperClass);

      iframe.parentNode.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);

      iframe.src = iframe.src;
    });
  }

  function wrapTable(options) {
   options.tables.forEach(function(table) {
     var wrapper = document.createElement('div');
     wrapper.classList.add(options.tableWrapperClass);

     table.parentNode.insertBefore(wrapper, table);
     wrapper.appendChild(table);
   });
  }

  function isOutOfBounds(elem) {
    if (!elem) {
      console.log('Error. Must provide element to check out of bounds');
      return false;
    }

    // Get element's bounding.
    var bounding = elem.getBoundingClientRect();

    // Check if it's out of the viewport on each side
    var out = {};
    out.left = bounding.left < 0;
    out.leftAmount = bounding.left;
    out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    out.rightAmount = bounding.right - (window.innerWidth || document.documentElement.clientWidth);

    return out;
  };

  function scriptLoader() {
      /**
       * Promise-based script loader
       * @param {string} url
       * @param {object=} attr
       * @returns {Promise}
       */
      const loader = (url, attr) => new Promise((resolve, reject) => {
        const script = window.document.createElement('script');
        script.src = url;
        script.async = true;
        script.crossOrigin = 'anonymous';

        attr = attr || {};

        for (const attrName in attr) {
          script[attrName] = attr[attrName];
        }

        script.addEventListener('load', () => {
          resolve(script);
        }, false);

        script.addEventListener('error', () => {
          reject(script);
        }, false);

        function scriptExists(url) {
          return document.querySelectorAll(`script[src="${url}"]`).length > 0;
        }

        if ( !scriptExists(url) ) {
          window.document.head.appendChild(script);
        } else {
          resolve(script);
        }

      });

      /**
       * Loads scripts asynchronously
       * @param {string|string[]} urls
       * @param {object=} attr Other script tag attributes
       * @returns {Promise}
       */
      this.load = (urls, attr) => {
        if (!Array.isArray(urls)) {
          urls = [urls];
        }

        return Promise.all(urls.map(url => loader(url, attr)));
      }

      /**
       * Loads scripts asynchronously. It supports multiple url arguments, so each one will be loaded right after the
       * previous is loaded. This is a way of chaining dependency loading.
       *
       * @param {string|string[]} urls, ...
       * @returns {Promise}
       */
      this.loadChain = function (urls) {
        const args = Array.isArray(arguments) ? arguments : Array.prototype.slice.call(arguments);
        const p = this.require(args.shift());
        const self = this;
        return args.length ? p.then(() => {
          self.requireChain(...args);
        }) : p;
      }
  }

  function scriptExists(url) {
    return document.querySelectorAll(`script[src="${url}"]`).length > 0;
  }

  function isElementPastEdge(element) {
    const bounding = element.getBoundingClientRect(),
          l = bounding.left,
          w = bounding.width,
          docH = document.documentElement.clientHeight,
          docW = document.documentElement.clientWidth;

    return (l + w >= docW);
  }

  function formatMoney(cents, format) {
    const moneyFormat = jsFormat.money;

    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || moneyFormat;

    function formatWithDelimiters(
      number,
      precision = 2,
      thousands = ',',
      decimal = '.'
    ) {
      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        `$1${thousands}`
      );
      const centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    isTouch,
    isMobile,
    isDevice,
    debounce,
    makeSticky,
    showHide,
    Toggle,
    toggleClass,
    Accordion,
    fadeToggle,
    fadeOut,
    fadeIn,
    getScrollbarWidth,
    smoothScrollTo,
    wrapIframe,
    wrapTable,
    isOutOfBounds,
    scriptLoader,
    scriptExists,
    isElementPastEdge,
    formatMoney
  };
})();

/* ---- WAU A11Y HELPERS - v1.0 ---- */
WAU.a11yHelpers = (function() {
  let alreadySetUpKeyEvents = false;

  /*
   * @description - Sets up the aria-expanded property to true and false on hover.
   */
  function setUpAriaExpansion() {
    const ariaExpandEls = document.querySelectorAll('.js-aria-expand');

    ariaExpandEls.forEach(function(ariaExpandEl) {
      ariaExpandEl.addEventListener('mouseover', function(event) {
        ariaExpandEl.setAttribute('aria-expanded', 'true');
      });

      ariaExpandEl.addEventListener('mouseout', function(event) {
        ariaExpandEl.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function setUpAriaExpansionClick() {
    const ariaExpandEls = document.querySelectorAll('.js-aria-expand');
    ariaExpandEls.forEach(function(ariaExpandEl) {
      ariaExpandEl.addEventListener('click', function(event) {
        if (ariaExpandEl.getAttribute('aria-expanded') == 'true') {
          ariaExpandEl.setAttribute('aria-expanded', 'false');
        } else {
          ariaExpandEl.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /*
   * @description - Takes a parent element and focuses on the next focusable element inside of there.
   */
  function focusOnElement(parent) {
    var focussableElements = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';

    const elementToFocusOn = parent.querySelector(focussableElements);

    if (elementToFocusOn) {
      elementToFocusOn.focus();
    }

  }

  function findFocusableElement(parent, element, direction) {
    const focusableElementSelectors = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
    const focusableElements = parent.querySelectorAll(focusableElementSelectors);
    const numOfFocusableElements = focusableElements.length;

    var elementIndex = 0;

    for (let i = 0; i < focusableElements.length; i += 1) {
      let currentElement = focusableElements[i];

      if (currentElement === element) {
        elementIndex = i;
      }
    }

    if (direction === 'next') {
      if (elementIndex === (numOfFocusableElements - 1)) {
        return focusableElements[0];
      } else {
        return focusableElements[elementIndex + 1];
      }
    }

    if (direction === 'prev') {
      if (elementIndex === 0) {
        return focusableElements[numOfFocusableElements - 1];
      } else {
        return focusableElements[elementIndex - 1];
      }
    }
  }

  /*
   * @description - Takes a parent and a dom node and returns the next element that is focusable that is not the current element.
   * @param parent:DOMNode
   * @param element:DOMNode
   * @return DOMNode
   */
  function findNextFocusableElement(parent, element) {
    return findFocusableElement(parent, element, 'next');
  }

  function findPreviousFocusableElement(parent, element) {
    return findFocusableElement(parent, element, 'prev');
  }

  /*
   * @description - Enables accessible keyboard navigation throughout the navigation menus.
   */
  function setUpAccessibleNavigationMenus() {

    function closeDropdownMenus() {
      const activeMenuItems = document.querySelectorAll('.navigation__menuitem--active');
      activeMenuItems.forEach(function(activeMenuItem) {
        activeMenuItem.classList.remove('navigation__menuitem--active');
        activeMenuItem.setAttribute('aria-expanded', 'false');
      });
    }

    function closeNestedDropdownMenus() {
      //remove the class that makes the dropdown show... the active class
      const nestedDropdowns = document.querySelectorAll(".js-menuitem-with-nested-dropdown");

      nestedDropdowns.forEach(function(nestedDropdown) {
        nestedDropdown.classList.remove("dropdown__menuitem--active");
        nestedDropdown.setAttribute('aria-expanded', 'false');
      });

    }

    function addEdgeToDropdown(dropdown) {
      setTimeout(function() {
        if (WAU.Helpers.isElementPastEdge(dropdown)) {
          dropdown.classList.add("dropdown--edge");
        } else {
          dropdown.classList.remove("dropdown--edge");
        }
      }, 0);
    }

    if (!alreadySetUpKeyEvents) {
      document.addEventListener('keyup', function(event) {
        if (event.key === 'Escape') {
          const openNestedDropdownMenus = document.querySelectorAll(".dropdown__menuitem--active"),
            openDropdownMenus = document.querySelectorAll(".navigation__menuitem--active");

          event.preventDefault();

          if (openNestedDropdownMenus.length >= 1) {
            closeNestedDropdownMenus();
            return;
          }

          if (openDropdownMenus.length >= 1) {
            closeDropdownMenus();
            return;
          }

        }
      });
    }

    function closeActiveItemsWithSameClass(name) {

     // Bail if no class name passed in.
     if (!name) return false;

     // Get the open elements.
     let openMenuItem = document.querySelectorAll(`.${name}`);

      // Check that we have any "active" menu items with the same name.
      if (openMenuItem.length > 0) {

         // Loop through each menu item.
         openMenuItem.forEach((menuItem) => {

           // We use the parent node because the nested anchor element
           // is what is focused on, no the "li" element.
           if (menuItem !== document.activeElement.parentNode) {
             menuItem.classList.remove(name);
           }
         });
      }
    };

    if (!alreadySetUpKeyEvents) {
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {

          if (document.activeElement.classList.contains("js-open-dropdown-on-key") || document.activeElement.parentNode.classList.contains("js-menuitem-with-nested-dropdown")) {
            event.stopPropagation();
            event.preventDefault();
          }

          if (document.activeElement.parentNode.classList.contains("navigation__menuitem--active")) {
            closeDropdownMenus();
            return;
          }

          if (document.activeElement.parentNode.classList.contains("dropdown__menuitem--active")) {
            closeNestedDropdownMenus();
            return;
          }

          if (document.activeElement.parentNode.classList.contains("js-first-level")) {
            closeDropdownMenus();
          }

          if (document.activeElement.classList.contains("js-open-dropdown-on-key")) {
            document.activeElement.parentNode.classList.add("navigation__menuitem--active"); // Show the menu by adding the appropriate class.
            closeActiveItemsWithSameClass('navigation__menuitem--active');
            return;
          }

          if (document.activeElement.parentNode.classList.contains("js-menuitem-with-nested-dropdown")) {
            document.activeElement.parentNode.classList.add("dropdown__menuitem--active");
            closeActiveItemsWithSameClass('dropdown__menuitem--active');
            addEdgeToDropdown(document.activeElement.parentNode);
            return;
          }

        }
      });
    }

    alreadySetUpKeyEvents = true;

  }

  return {
    setUpAriaExpansion: setUpAriaExpansion,
    setUpAriaExpansionClick: setUpAriaExpansionClick,
    setUpAccessibleNavigationMenus: setUpAccessibleNavigationMenus,
    focusOnElement: focusOnElement
  }
}());

/* ---- WAU SECTIONS - v1.0 ---- */
WAU.Sections = (function() {
	document.querySelectorAll('[data-section-type]').forEach(function(container) {

    // Pre-load vendor before section script
    if (container.hasAttribute('data-preload-vendor')) {
      const loader = new WAU.Helpers.scriptLoader();
      loader.load([container.dataset.preloadVendor]).then(({length}) => {
        // console.log(container.dataset.sectionType + ' script loaded');
      });
    }

    // Load these containers instantly
    if (container.hasAttribute('data-asset-preload')) {
      loadAssets(container);
      if (container.hasAttribute('data-section-loaded') ) {
        container.setAttribute('data-section-loaded', 'true');
      }
    }

		let callback = (entries, observer) => {
			entries.forEach(entry => {
				if ( entry.isIntersecting ) {
					loadAssets(container);
					if (container.hasAttribute('data-section-loaded') ) {
						container.setAttribute('data-section-loaded', 'true');
					}
				}
			});
		};

		let observer = new IntersectionObserver(callback);
		observer.observe(container);

		function loadAssets (container) {
			// Load section assets
			if ( container.dataset.assetUrl ) {
				const loader = new WAU.Helpers.scriptLoader();
				loader.load([container.dataset.assetUrl]).then(({length}) => {
					// console.log(container.dataset.sectionType + ' script loaded');
				});
			}
		}

		document.addEventListener('shopify:section:select', function(event){
			if ( container.dataset.sectionId == event.detail.sectionId ) {
				if (container.hasAttribute('data-section-loaded') ) {
					event.target.classList.add('section--reloaded');
				}
			}
		});
		document.addEventListener('shopify:section:load', function(event){
      loadAssets(event.target.querySelector('[data-section-type]'));
			event.target.classList.add('section--reloaded');
		});

	});
})();

/* ---- WAU PRODUCT GRID VIDEO - v1.0 ---- */
WAU.ProductGridVideo = {
  init: function init() {
    document.querySelectorAll('.js-bg-video-wrapper').forEach(function(element) {
      WAU.ProductGridVideo.initVideo(element);
    });
  },
  initVideo: function initVideo(element) {
    var selectorId = element.dataset.productId,
      videoUrl = element.dataset.videoUrl,
      selector = '.js-bg-video-' + selectorId;

    var options = {
      mp4: videoUrl,
    }
    var instance = new vidbg(selector, options);

    var vid = selector + ' video',
      vid = document.querySelector(vid);
    vid.muted = true;

    document.addEventListener("shopify:section:unload", function(event) {
      WAU.ProductGridVideo.destroyVideo(instance);
    });
    document.addEventListener("shopify:section:select", function(event) {
      WAU.ProductGridVideo.reinitVideo(selector, options);
    });

  },
  destroyVideo: function destroyVideo(element) {
    element.destroy();
  },
  reinitVideo: function reinitVideo(selector, options) {
    var instance = new vidbg(selector, options);
    return instance;
  }
}

/* ---- WAU LOCALIZATION - v1.0 ---- */
WAU.LocalizationForm = function(container) {
  function init() {
    container.querySelector('button').addEventListener('click', openSelector);
    container.querySelector('button').addEventListener('focusout', closeSelector);
    container.addEventListener('keyup', onContainerKeyUp);
    container.querySelectorAll('a').forEach(item => item.addEventListener('click', onItemClick));
  }

  function hidePanel() {
    container.querySelector('button').setAttribute('aria-expanded', 'false');
    container.querySelector('ul').setAttribute('hidden', true);
  }

  function onContainerKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    hidePanel();
    container.querySelector('button').focus();
  }

  function onItemClick(event) {
    event.preventDefault();
    const form = container.querySelector('form');
    container.querySelector('input[name="locale_code"], input[name="country_code"]').value = event.currentTarget.dataset.value;
    if (form) form.submit();
  }

  function openSelector() {
    container.querySelector('button').focus();
    container.querySelector('ul').toggleAttribute('hidden');
    container.querySelector('button').setAttribute('aria-expanded', (container.querySelector('button').getAttribute('aria-expanded') === 'false').toString());
  }

  function closeSelector(event) {
    const shouldClose = event.relatedTarget && event.relatedTarget.nodeName === 'BUTTON';
    if (event.relatedTarget === null || shouldClose) {
      hidePanel();
    }
  }

  return init();
}

/*============================================================================
 Shopify Common
==============================================================================*/

if ((typeof window.Shopify) == 'undefined') {
  window.Shopify = {};
}

Shopify.bind = function(fn, scope) {
  return function() {
    return fn.apply(scope, arguments);
  }
};

Shopify.setSelectorByValue = function(selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function(target, eventName, callback) {
  target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
};

Shopify.postLink = function(path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
  this.countryEl         = document.getElementById(country_domid);
  this.provinceEl        = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function(e) {
    var opt       = this.countryEl.options[this.countryEl.selectedIndex];
    var raw       = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};

/*============================================================================
  Global Events & Helpers
==============================================================================*/
(function WAUInits() {
	WAU.Accordion.init();
  WAU.Slideout.init("searchbox");

  document.querySelectorAll('[data-localization-form]').forEach(function(container){
    WAU.LocalizationForm(container);
  });


	document.addEventListener('DOMContentLoaded', function() {
		if ( document.querySelectorAll('.js-bg-video-wrapper') ) {
			WAU.ProductGridVideo.init();
		}
	});

	document.addEventListener('shopify:section:select', function(event){
		if ( document.querySelectorAll('.js-bg-video-wrapper') ) {
			WAU.ProductGridVideo.init();
		}
    if ( event.target.querySelector('[data-localization-form]') ) {
      WAU.LocalizationForm(event.target.querySelector('[data-localization-form]'));
    }
    WAU.Slideout.init("searchbox");
	});
})();

(function helperRteFormat() {
  WAU.Helpers.wrapIframe({
		iframes: document.querySelectorAll('.rte iframe[src*="youtube.com/embed"]'),
    iframeWrapperClass: 'video-wrapper'
  });

	WAU.Helpers.wrapIframe({
		iframes: document.querySelectorAll('.rte iframe[src*="player.vimeo"]'),
		iframeWrapperClass: 'video-wrapper'
	});

  WAU.Helpers.wrapTable({
		tables: document.querySelectorAll('.rte table'),
    tableWrapperClass: 'table-wrapper'
  });
})();

(function helperThemeVersion() {
  /* Log Theme Version */
  log = function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(console);
      return Function.prototype.bind.apply(console.log, args);
  }

  log("Forge Version 2.3.0 by Underground", {bar: 1})();
})();

(function initModals() {

	if ( document.querySelector('[data-wau-modal="new-address"]') ) {
		WAU.Modal.init("new-address");
	}

	var buildModals = document.querySelectorAll('[data-wau-modal-content]');
	if ( buildModals ) {
		buildModals.forEach((item, i) => {
			var contentType = item.dataset.wauModalContent;
		});
	}

	var modals = document.querySelectorAll('[data-wau-modal]');
	if ( modals ) {
		modals.forEach((item, i) => {
			if (item.dataset.wauModal.includes("edit-address")) {
				WAU.Modal.init(item.dataset.wauModal);
			}
		});
	}

})();

(function formValidation() {
	/* Form Validation */
	var validateForm = function(submitEvent) {
	  if (!submitEvent.target.checkValidity()) {
	    submitEvent.preventDefault();
	    submitEvent.stopImmediatePropagation();
	    submitEvent.stopPropagation();

	    var form = submitEvent.target,
	        elements = form.elements;

	    for (var index = 0, len = elements.length; index < len; index++) {
	      var element = elements[index];
	      if (element.willValidate === true && element.validity.valid !== true) {
	        var message = element.validationMessage,
	            parent  = element.parentNode,
	            div     = document.createElement('small');

	      div.appendChild(document.createTextNode(message));
	       div.classList.add('validation-message');

	       parent.insertBefore(div, element.nextSibling);

	       element.focus();
	       break;
	     }
	    }
	  } else {
	    return true;
	  }
	};

	document.addEventListener('DOMContentLoaded', function() {
	  var forms = document.querySelectorAll('form');

	  for (var index = forms.length - 1; index >= 0; index--) {
	    var form = forms[index];

	    form.noValidate = true;
	    form.addEventListener('submit', validateForm);
	  }
	});
})();
