const SearchFilters = {
  init: function init(container, sectionId) {
    WAU.Slideout.init("search-filters");

    this.typeToggle(container);
    this.drawerFilters();
    this.currentFilters();

    if ( container.querySelector("[data-filters-price-range]") ) {
      this.priceRange();
      this.priceSlider();
    }
    this.filterData = [];
  },
  priceRange: function priceRange() {
    const priceInputs = document.querySelectorAll('input.js-filter-range-input');
    setMinAndMaxValues(priceInputs);

    priceInputs.forEach((element) => {
      element.addEventListener('change', (event) => {
        onRangeChange(event);
        setFilter(event);
      });
    });

    function onRangeChange(event) {
      adjustToValidValues(event.currentTarget);
      setMinAndMaxValues();
    }

    function setMinAndMaxValues() {
      const minInput = priceInputs[0];
      const maxInput = priceInputs[1];

      if (maxInput.value) minInput.setAttribute('max', parseInt(maxInput.value).toFixed());
      if (minInput.value) maxInput.setAttribute('min', parseInt(minInput.value).toFixed());

      let maxRound = parseInt(maxInput.getAttribute('max')).toFixed();
      if (minInput.value === '') maxInput.setAttribute('min', 0);
      if (maxInput.value === '') minInput.setAttribute('max', maxRound);
    }

    function adjustToValidValues(input) {
      const value = Number(input.value);
      const min = Number(input.getAttribute('min'));
      const max = Number(input.getAttribute('max'));

      if (value < min) input.value = min;
      if (value > max) input.value = max;
    }

    function setFilter(event) {
      setTimeout(function() {
        const formData = new FormData(event.target.closest('form'));
        const searchParams = new URLSearchParams(formData).toString();

        SearchFilters.renderPage(searchParams);
      }, 3000);
    }
  },
  priceSlider: function priceSlider() {
    var parents = document.querySelectorAll(".js-price-range");

    if ( !parents ) return false;

    parents.forEach((parent, i) => {
      var rangeS = parent.querySelectorAll("input[type=range]"),
          numberS = parent.querySelectorAll("input[type=number]");

      rangeS.forEach(function(el) {
        el.oninput = function() {
          var slide1 = parseFloat(rangeS[0].value),
              slide2 = parseFloat(rangeS[1].value);

          var slide1Dec = (Math.round(slide1 * 100) / 100).toFixed(),
              slide2Dec = (Math.round(slide2 * 100) / 100).toFixed();

          if (parseFloat(slide1Dec) > parseFloat(slide2Dec)) { [slide1Dec, slide2Dec] = [slide2Dec, slide1Dec] }

          numberS[0].value = slide1Dec;
          numberS[1].value = slide2Dec;
        }
      });

      rangeS[0].onchange = function() {
        numberS[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      rangeS[1].onchange = function() {
        numberS[1].dispatchEvent(new Event('change', { bubbles: true }));
      }

    });
  },
  currentFilters: function currentFilters() {
    const filters = document.querySelectorAll('.js-current-filter');

    filters.forEach((item, i) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        SearchFilters.onActiveFilterClick(event);
      });
    });
  },
  typeToggle: function typeToggle(container) {
    container.querySelectorAll('[data-toggle-menu').forEach((toggle) => {
      toggle.addEventListener('click', e => {
        container.querySelectorAll('[data-menu-handle]').forEach((menu) => menu.style.display = "none");

        let activeMenu = container.querySelector(`[data-menu-handle="${e.target.dataset.toggleMenu}"]`);
        activeMenu.style.display = "block";
      });
    });
  },
  drawerFilters: function drawerFilters() {
    const filters = document.querySelectorAll('.js-filter');

    filters.forEach((item, i) => {

      item.addEventListener('click', (event) => {
        event.preventDefault();

        if ( item.querySelector('input[type="checkbox"]').checked ) {
          item.classList.remove('current');
          item.querySelector('input[type="checkbox"]').checked = false;
        } else {
          item.classList.add('current');
          item.querySelector('input[type="checkbox"]').checked = true;
        }

        const formData = new FormData(item.closest('form'));
        const searchParams = new URLSearchParams(formData).toString();
        var searchString = window.location.search.toString(),
            searchString = searchString.replace('?', '');
        const finalParams = searchString + '&' + searchParams;

        SearchFilters.renderPage(finalParams);
      });
    });
  },
  renderFilters: function renderFilters() {
    var container = document.querySelector('[data-section-type="search-template"]');
    WAU.Slideout.init("search-filters");
    WAU.Slideout._closeByName("search-filters");

    this.typeToggle(container);
    this.drawerFilters();
    this.currentFilters();

    if ( container.querySelector("[data-filters-price-range]") ) {
      this.priceRange();
      this.priceSlider();
    }

    WAU.Quickshop.init();
    WAU.ProductGridVideo.init();
  },
  renderSectionFromFetch: function renderSectionFromFetch(url, section) {
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        this.filterData = [...this.filterData, { html, url }];
        this.renderSearchGrid(html);
        this.renderFilters();
      });
  },
  renderSectionFromCache: function renderSectionFromCache(filterDataUrl, section) {
    const html = this.filterData.find(filterDataUrl).html;
    this.renderSearchGrid(html);
    this.renderFilters();
  },
  renderPage: function renderPage(searchParams, updateURLHash = true) {
    const sections = this.getSections();
    console.log(sections)
    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;
      console.log(url)
      this.filterData.some(filterDataUrl) ?
        this.renderSectionFromCache(filterDataUrl, section) :
        this.renderSectionFromFetch(url, section);
    });

    if (updateURLHash) this.updateURLHash(searchParams);
  },
  renderSearchGrid: function renderSearchGrid(html) {
    const innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('searchResultsWrapper').innerHTML;

    document.getElementById('searchResultsWrapper').innerHTML = innerHTML;
  },
  onActiveFilterClick: function onActiveFilterClick(event) {
    event.preventDefault();
    const searchParams = new URL(event.currentTarget.href).searchParams.toString();
    const searchString = new URL(window.location).searchParams.get('q');

    var finalSearchParams = ( searchParams.includes('q=') ) ? searchParams : 'q=' + searchString;

    SearchFilters.renderPage(finalSearchParams);
  },
  updateURLHash: function updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  },
  getSections: function getSections() {
    return [
      {
        id: 'main-search-results',
        section: document.getElementById('main-search-results').dataset.id,
      }
    ]
  }
}

document.querySelectorAll('[data-section-type="search-template"]').forEach(function(container){
  WAU.Slideout.init("search-filters");

  if ( container.querySelector("[data-filters]") ) {
    SearchFilters.init(container, container.dataset.sectionId);
  }
});

document.addEventListener("shopify:section:load", function(event) {
  if (event.target.querySelector('[data-section-type="search-template"]')) {
    var container = event.target.querySelector('[data-section-type="search-template"]');
    WAU.Slideout.init("search-filters");
    if ( container.querySelector("[data-filters]") ) {
      SearchFilters.init(container, container.dataset.sectionId);
    }
  }
});
