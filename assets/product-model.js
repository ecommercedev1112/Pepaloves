ProductModel = (function() {
  var modelJsonSections = {};
  var models = {};
  var xrButtons = {};

  var selectors = {
    mediaGroup: '[data-product-single-media-group]',
    xrButton: '[data-shopify-xr]'
  };

  function init(modelViewerContainers, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false
    };

    modelViewerContainers.forEach(function(modelViewerContainer, index) {
      var mediaId = modelViewerContainer.getAttribute('data-media-id');
      var modelViewerElement = modelViewerContainer.querySelector(
        'model-viewer'
      );
      var modelId = modelViewerElement.getAttribute('data-model-id');

      if (index === 0) {
        var mediaGroup = modelViewerContainer.closest(selectors.mediaGroup);
        var xrButton = mediaGroup.querySelector(selectors.xrButton);
        xrButtons[sectionId] = {
          element: xrButton,
          defaultId: modelId
        };
      }

      models[mediaId] = {
        modelId: modelId,
        sectionId: sectionId,
        container: modelViewerContainer,
        element: modelViewerElement
      };
    });

    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi
      }
    ]);
  }

  function setupShopifyXr(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function() {
        setupShopifyXr();
      });
      return;
    }

    for (var sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        var modelSection = modelJsonSections[sectionId];

        if (modelSection.loaded) continue;

        var modelJson = document.querySelector('#ModelJson-' + sectionId);

        window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
        modelSection.loaded = true;
      }
    }
    window.ShopifyXR.setupXRElements();
  }

  function setupModelViewerUi(errors) {
    if (errors) return;

    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.element);
        }
        setupModelViewerListeners(model);
      }
    }
  }

  function setupModelViewerListeners(model) {
    var xrButton = xrButtons[model.sectionId];

    model.container.addEventListener('mediaVisible', function() {
      xrButton.element.setAttribute('data-shopify-model3d-id', model.modelId);

			if (window.matchMedia('(min-width: 980px)').matches) {
			  model.modelViewerUi.play();
			}
    });

    model.container.addEventListener('mediaHidden', function() {
      xrButton.element.setAttribute(
        'data-shopify-model3d-id',
        xrButton.defaultId
      );
      model.modelViewerUi.pause();
    });

    model.container.addEventListener('xrLaunch', function() {
      model.modelViewerUi.pause();
    });
  }

  function removeSectionModels(sectionId) {
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (model.sectionId === sectionId) {
          models[key].modelViewerUi.destroy();
          delete models[key];
        }
      }
    }
    delete modelJsonSections[sectionId];
  }

  return {
    init: init,
    removeSectionModels: removeSectionModels
  };
})();
