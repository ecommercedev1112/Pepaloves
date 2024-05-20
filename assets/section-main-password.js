function passwordToggle(container) {
  container.querySelector('.js-toggle-login').addEventListener('click', function(event) {
    event.preventDefault();

    WAU.Helpers.showHide('login-form', 'register-form');
  });

  container.querySelector('.js-toggle-register').addEventListener('click', function(event) {
    event.preventDefault();

    WAU.Helpers.showHide('register-form', 'login-form');
  });
}

document.querySelectorAll('[data-section-type="password-page"]').forEach(function(container){
  passwordToggle(container);
});

document.addEventListener("shopify:section:select", function(event) {
  if ( !event.target.querySelector('[data-section-type="password-page"]') ) return false;
  let context = event.target;
  passwordToggle(context);
});
