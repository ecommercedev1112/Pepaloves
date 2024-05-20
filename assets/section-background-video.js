function bgVideo(container) {
  setTimeout(function() {
    if ( instance ) instance.destroy();

    var config = JSON.parse(container.dataset.videoConfig || '{}');

    var selectorId = config.sectionId,
        selector = '.js-bg-video-' + selectorId;

    if ( !config.mp4 ) return false;

    var options = {
      mp4: config.mp4,
      poster: config.poster,
      overlay: config.overlay,
      overlayColor: config.overlayColor,
    }

    var attributes = {
      autoplay: true,
      controls: false,
      loop: true,
      muted: true,
      playsInline: true,
    }

    var instance = new vidbg(selector, options);

    var vid = selector + ' video',
        vid = document.querySelector(vid);
    vid.muted = true;

  }, 200);
}

function onYouTubeIframeAPIReady() {
  VideoTT.playerBuild();
}

VideoTT = {
  init(container) {
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },
  playerBuild() {
    let containers = document.querySelectorAll('[data-section-type="background-video"]');

    containers.forEach( function(container, i) {
      var player;
      var selector = 'js-alternative-yt-' + container.dataset.sectionId;
      var ytcontainer = container.querySelector('#js-alternative-yt-' + container.dataset.sectionId);

      player = new YT.Player(selector, {
        videoId: ytcontainer.dataset.id,
        playerVars: { 'autoplay': 1, 'controls': 0, 'loop': 1, 'playlist': ytcontainer.dataset.id },
        events: {
          'onReady': VideoTT.onPlayerReady
        }
      });

      let playBtn = container.querySelector('.js-play-video');
      playBtn.addEventListener('click', function(event) {
        player.playVideo();
        event.target.style.display = 'none';
      });
    });

  },
  onPlayerReady(event) {
   event.target.mute();
   event.target.playVideo();
  }
}

document.querySelectorAll('[data-section-type="background-video"]').forEach(function(container){
  const loader = new WAU.Helpers.scriptLoader();
  loader.load([container.dataset.vendorAssetUrl]).finally(() => {
    bgVideo(container);

    if ( container.querySelector('.js-has-yt') ) {
      VideoTT.init(container);
    }
  });
});

document.addEventListener("shopify:section:select", function(event) {
  if (event.target.querySelector('[data-section-type="background-video"]')) {
    var container = event.target.querySelector('[data-section-type="background-video"]');
    if ( container.querySelector('.js-has-yt') ) {
      VideoTT.playerBuild();
    }
  }
});

document.addEventListener("shopify:section:load", function(event) {
  if (event.target.querySelector('[data-section-type="background-video"]')) {
    var container = event.target.querySelector('[data-section-type="background-video"]');
    const loader = new WAU.Helpers.scriptLoader();
    loader.load([container.dataset.vendorAssetUrl]).finally(() => {
      bgVideo(container);

      if ( container.querySelector('.js-has-yt') ) {
        VideoTT.init(container);
      }

    });
  }
});
