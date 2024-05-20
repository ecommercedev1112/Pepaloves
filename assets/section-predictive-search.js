PredictiveSearch = {
	init: function init(context) {

		const selectors = {
			input: 'input[type="search"]',
			results: '#predictive-search'
		}

		// Make sure that theme helper methods and the browser supports.
		this.featureDetections();

		// Get data attributes from element
		context.routesPredictiveSearchURL = context.dataset.routes;
		context.showOnlyProducts = context.dataset.showOnlyProducts;
		context.resultsPerResource = context.dataset.resultsPerResource;
		context.inputSelector = context.dataset.inputSelector;
		context.resultsSelector = context.dataset.resultsSelector;

		// Get DOM elements
		context.input = context.querySelector(context.inputSelector) ? context.querySelector(context.inputSelector) : context.querySelector(selectors.input);
		context.predictiveSearchResults = context.querySelector(this.resultsSelector) ? context.querySelector(context.resultsSelector) : context.querySelector(selectors.results);

		// Add event listeners
		context.input.addEventListener('input', WAU.Helpers.debounce((event) => {
			this.onChange(event);
		}, 300).bind(this));
	},
	context: function context() {
		return document.getElementById('predictiveSearch');
	},
	featureDetections: function featureDetections() {
		if ( ! this.isFunction(WAU.Helpers.debounce)) {
			console.log('Error. Missing debouce theme helper method for predictive search.');
			return false;
		}
		if (! window.fetch ) {
			console.log('Error. Web browser does not support fetch required for predictive search');
			return false;
		}
	},
	getTypeOf: function getTypeOf(value) {
		return Object.prototype.toString.call(value);
	},
	isFunction: function isFunction(value) {
		return this.getTypeOf(value) === '[object Function]';
	},
	onChange: function onChange(event) {
		const searchTerm = event.target.value.trim();

		if (!searchTerm.length) {
			var context = this.context();
			this.close(context);
			return;
		}

		this.getSearchResults(searchTerm);
	},
	getSearchResults: function getSearchResults(searchTerm) {
		var context = this.context();

		fetch(`${context.routesPredictiveSearchURL}?q=${encodeURIComponent(searchTerm)}&section_id=predictive-search`)
			.then((response) => {
				if (!response.ok) {
					var error = new Error(response.status);

					var context = this.context();
					this.close(context);

					throw error;
				}

				return response.text();
			})
			.then((text) => {
				const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
				context.predictiveSearchResults.innerHTML = resultsMarkup;

				this.open(context);
			})
			.catch((error) => {
				this.close(context);
				throw error;
			});
	},
	open: function open(context) {
		if (typeof WAU.Helpers.fadeIn === 'function') {
			WAU.Helpers.fadeIn(context.predictiveSearchResults);
		} else {
			context.predictiveSearchResults.style.display = 'block';
		}
	},
	close: function close(context) {
		if (typeof WAU.Helpers.fadeOut === 'function') {
			WAU.Helpers.fadeOut(context.predictiveSearchResults);
		} else {
			context.predictiveSearchResults.style.display = 'none';
		}
	}
}

document.querySelectorAll('[data-section-type="predictive-search"]').forEach(function(container, i){
  PredictiveSearch.init(container);
});

document.addEventListener('shopify:section:select', function(event){
  var container = document.getElementById('predictiveSearch');
  PredictiveSearch.init(container);
});
