ProductVideo = (function(context, sectionId) {
  var videos = {};

  var hosts = {
    html5: 'html5',
    youtube: 'youtube'
  };

  var selectors = {
    productMediaWrapper: '[data-product-single-media-wrapper]'
  };

  var attributes = {
    enableVideoLooping: 'enable-video-looping',
    videoId: 'video-id'
  };

  function init(videoContainer, sectionId) {
    if (!videoContainer) {
      return;
    }

    var videoElement = videoContainer.querySelector('iframe, video');

    if (!videoElement) {
      return;
    }

    var mediaId = videoContainer.getAttribute('data-media-id');

    videos[mediaId] = {
      mediaId: mediaId,
      sectionId: sectionId,
      host: hostFromVideoElement(videoElement),
      container: videoContainer,
      element: videoElement,
      ready: function() {
        createPlayer(this);
      }
    };

    var video = videos[mediaId];

    switch (video.host) {
      case hosts.html5:
        window.Shopify.loadFeatures([
          {
            name: 'video-ui',
            version: '1.0',
            onLoad: setupPlyrVideos
          }
        ]);
        break;
      case hosts.youtube:
        break;
    }
  }

  function setupPlyrVideos(errors) {
    if (errors) {
      fallbackToNativeVideo();
      return;
    }

    loadVideos(hosts.html5);
  }

  function setupYouTubeVideos() {
    if (!window.YT.Player) return;

    loadVideos(hosts.youtube);
  }

  function createPlayer(video) {
    if (video.player) {
      return;
    }

    var productMediaWrapper = video.container.closest(
      selectors.productMediaWrapper
    );

    var enableLooping = productMediaWrapper.getAttribute(
        'data-' + attributes.enableVideoLooping
      ) === 'true';


    switch (video.host) {
      case hosts.html5:
        // eslint-disable-next-line no-undef
        video.player = new Shopify.Plyr(video.element, {
          loop: { active: enableLooping },
          muted: true,
          hideControlsOnPause: true,
          tooltips: { controls: false, seek: true }
        });
        video.player.on('ready', event => {
          video.container.querySelector('.plyr--full-ui').setAttribute('tabindex', '-1');
          video.container.querySelectorAll('.plyr--full-ui *').forEach((item, i) => {
            item.setAttribute('tabindex', '-1');
          });

        });
        video.player.on('play', event => {
          video.container.querySelectorAll('.plyr__controls *').forEach((item, i) => {
            item.setAttribute("tabIndex", "0");
          });
        });
        break;
      case hosts.youtube:
      var videoId = productMediaWrapper.getAttribute(
        'data-' + attributes.videoId
      );

        video.player = new YT.Player(video.element, {
          videoId: videoId,
          events: {
            onStateChange: function(event) {
              if (event.data === 0 && enableLooping) event.target.seekTo(0);
            },
            onReady: function(event) {
              video.player.mute();
            }
          }
        });
        break;
    }

    var pauseVideo = function() {
      if (!video.player) return;

      if (video.host === hosts.html5) {
        video.player.pause();
      }

      if (video.host === hosts.youtube && video.player.pauseVideo) {
        video.player.pauseVideo();
      }
    };

    productMediaWrapper.addEventListener('mediaHidden', pauseVideo);
    productMediaWrapper.addEventListener('xrLaunch', pauseVideo);

    productMediaWrapper.addEventListener('mediaHidden xrLaunch', function() {
      if (!video.player) return;

      if (video.host === hosts.html5) {
        video.player.pause();
      }
      if (video.host === hosts.youtube && video.player.pauseVideo) {
        video.player.pauseVideo();
      }

    });

    productMediaWrapper.addEventListener('mediaVisible', function() {
      if (WAU.Helpers.isTouch()) return;

      if (!video.player) return;

      if (video.host === hosts.html5) {
        if (window.matchMedia('(min-width: 980px)')) {
          video.player.play();
        }
      }

      if (video.host === hosts.youtube && video.player.playVideo) {
        if (window.matchMedia('(min-width: 980px)')) {
          video.player.playVideo();
        }
      }
    });

  }

  function hostFromVideoElement(video) {
    if (video.tagName === 'VIDEO') {
      return hosts.html5;
    }

    if (video.tagName === 'IFRAME') {
      if (
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(
          video.src
        )
      ) {
        return hosts.youtube;
      }
    }
    return null;
  }

  function loadVideos(host) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];
        if (video.host === host) {
          video.ready();
        }
      }
    }
  }

  function fallbackToNativeVideo() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];

        if (video.nativeVideo) continue;

        if (video.host === hosts.html5) {
          video.element.setAttribute('controls', 'controls');
          video.nativeVideo = true;
        }
      }
    }
  }

  function removeSectionVideos(sectionId) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];

        if (video.sectionId === sectionId) {
          if (video.player) video.player.destroy();
          delete videos[key];
        }
      }
    }
  }

  return {
    init: init,
    hosts: hosts,
    loadVideos: loadVideos,
    removeSectionVideos: removeSectionVideos
  };

})();
