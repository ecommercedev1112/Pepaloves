!function(e){var n;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var t=window.Cookies,o=window.Cookies=e();o.noConflict=function(){return window.Cookies=t,o}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(e){return e.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}return function t(o){function r(){}function i(n,t,i){if("undefined"!=typeof document){"number"==typeof(i=e({path:"/"},r.defaults,i)).expires&&(i.expires=new Date(1*new Date+864e5*i.expires)),i.expires=i.expires?i.expires.toUTCString():"";try{var c=JSON.stringify(t);/^[\{\[]/.test(c)&&(t=c)}catch(e){}t=o.write?o.write(t,n):encodeURIComponent(String(t)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var f="";for(var u in i)i[u]&&(f+="; "+u,!0!==i[u]&&(f+="="+i[u].split(";")[0]));return document.cookie=n+"="+t+f}}function c(e,t){if("undefined"!=typeof document){for(var r={},i=document.cookie?document.cookie.split("; "):[],c=0;c<i.length;c++){var f=i[c].split("="),u=f.slice(1).join("=");t||'"'!==u.charAt(0)||(u=u.slice(1,-1));try{var a=n(f[0]);if(u=(o.read||o)(u,a)||n(u),t)try{u=JSON.parse(u)}catch(e){}if(r[a]=u,e===a)break}catch(e){}}return e?r[e]:r}}return r.set=i,r.get=function(e){return c(e,!1)},r.getJSON=function(e){return c(e,!0)},r.remove=function(n,t){i(n,"",e(t,{expires:-1}))},r.defaults={},r.withConverter=t,r}(function(){})});

const Popup = (function() {

  const defaults = {
    selectors: {
      popupContainer: ".newsletter__popup-container",
      popupOverlay: ".newsletter__popup-overlay",
      popupCloseButton: ".newsletter__popup-container-close"
    },
    classes: {
      visible: "is-visible",
    },
    viewportWidth: 740, // Viewport must be greater than this number to open
    overlay: true,      // Enabled overlay
    defaultFrequency: 5,  // Days
    defaultPopupDelay: 5000, // Milliseconds
    cookieSetName: "popupShown", // What cookie sets
    debug: false,
    escape: true, // Listen to escape button to close the pop up
    successMessage: false, // Show popup on success ?customer_posted=true
    fadeAnimation: false, // Use fade functions from theme helpers
    formId: '#mailing-popup-form' // Used to differentiate popup form from other forms
  };

  let lastFocus, popupTestMode, popupFrequency;
  const publicAPIs = {};

  /*
   * @description check URL query string. Determines if customer post success is true or not
   */
  const checkURLQueryString = () => {

    if (settings.debug) {
      console.log(`checkURLQueryString() ran`);
    }

    if (settings.successMessage) {
      const url = new URL(location);
      if (url.hash == settings.formId && url.searchParams.get('customer_posted') == 'true') {
        return true;
      }
    }
    return false;
  };

  /*
   * @description return the viewport width
   */
  const getViewportWidth = () => window.innerWidth || document.documentElement.clientWidth;

  /*
   * @description handle overlay click event to exit overlay
   */
  const handleOverlayEvent = (event) => {
    if (event.target === document.querySelector(`${settings.selectors.popupOverlay}.${settings.classes.visible}`)) {
        publicAPIs.close();
    }
  };

  /*
   * @description handle escape keyboard event
   */
  const handleEscapeKeyboardEvent = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      publicAPIs.close();
    }
  };

  /*
   * @description handle close button event
   */
  const handleCloseButtonEvent = (event) => {
    publicAPIs.close(event);
  };

  /*
   * @description check if working in the theme editor
   */
  const themeEditorCheck = () => Shopify.designMode;

  /*
   * @description open the pop up
   */
  publicAPIs.open = () => {

    if (getViewportWidth() < settings.viewportWidth) {
      return;
    }

    if (settings.overlay && document.querySelector(settings.selectors.popupOverlay)) document.querySelector(settings.selectors.popupOverlay).classList.add(settings.classes.visible);

    if (document.querySelector(settings.selectors.popupContainer)) {
      document.querySelector(settings.selectors.popupContainer).style.display = "block";
    }

    // Don't set cookie when inside the theme editor
    if (themeEditorCheck() !== true) {
      Cookies.set(settings.cookieSetName, 'yes', { expires: popupFrequency });
    }

    if (typeof WAU.a11yHelpers.focusOnElement === 'function') {
      WAU.a11yHelpers.focusOnElement(document.querySelector(settings.selectors.popupContainer));
    }
  };

  /*
   * @description close the pop up
   */
  publicAPIs.close = event => {

    if (document.querySelector(settings.selectors.popupContainer)) document.querySelector(settings.selectors.popupContainer).style.display = "none";

    if (settings.overlay && document.querySelector(settings.selectors.popupOverlay)) document.querySelector(settings.selectors.popupOverlay).classList.remove(settings.classes.visible);

    // If there was an event passed in, prevent it from redirecting
    if (event) event.preventDefault();

    // If there is a lastFocus element then focus on it
    if (lastFocus) lastFocus.focus();
  };

  /*
   * @description initialize the pop up
   */
  publicAPIs.init = (options) => {

    settings = Object.assign({}, defaults, options);

    popupFrequency = document.querySelector(settings.selectors.popupContainer).getAttribute('data-popup-frequency') ? Number(document.querySelector(settings.selectors.popupContainer).getAttribute('data-popup-frequency')) : settings.defaultFrequency;

    const popupDelayAttribute = document.querySelector(settings.selectors.popupContainer).getAttribute('data-popup-delay');

    let popupDelay = (Number(popupDelayAttribute) != 0) ? Number(popupDelayAttribute) * 1000 : settings.defaultPopupDelay;

    const popupCloseEl = document.querySelector(settings.selectors.popupCloseButton);

    if (!popupCloseEl) {
      if (settings.debug) console.log('err. no popup close button');
    }

    const popupEnabledAttribute = document.querySelector(settings.selectors.popupContainer).getAttribute('data-popup-enabled');

    const popupEnabled = popupEnabledAttribute == 'true' ? true : false;

    // Register events
    popupCloseEl.addEventListener('click', handleCloseButtonEvent)

    if (settings.escape) {
      document.addEventListener('keyup', handleEscapeKeyboardEvent);
    }

    if (settings.overlay) {
      document.addEventListener('click', handleOverlayEvent);
    }

    // Bail if working inside the theme editor
    if (themeEditorCheck() || !popupEnabled ) return;

    if (checkURLQueryString()) {
      popupDelay = 10;
    }

    setTimeout(function() {

      // if (themeEditorCheck() == true || checkURLQueryString() ) {
      if ( checkURLQueryString() ) {

        lastFocus = document.activeElement;

        publicAPIs.open();

      } else {

        const popUpShownCookie = Cookies.get(settings.cookieSetName);

        if (!popUpShownCookie) {
          lastFocus = document.activeElement;
          publicAPIs.open();
        }
      }
    }, popupDelay);
  };

  return publicAPIs;

})();

document.addEventListener('DOMContentLoaded', function() {

  document.querySelectorAll('[data-section-type="mailing-popup"]').forEach(function(container){
    // Initialize pop up
    Popup.init({
      selectors: {
        popupContainer: ".js-popup",
        popupOverlay: ".js-popup-overlay",
        popupCloseButton: ".js-popup-close",
      },
      overlay: true,
      successMessage: true
    });
  });

  document.addEventListener("shopify:section:select", function(event) {
    if ( !event.target.querySelector('[data-section-type="mailing-popup"]') ) return false;
    Popup.open();
  });

  document.addEventListener("shopify:section:deselect", function(event) {
    if ( !event.target.querySelector('[data-section-type="mailing-popup"]') ) return false;
    Popup.close();
  });

});
