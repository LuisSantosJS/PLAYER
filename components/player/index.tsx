import React, { useEffect, useState } from "react";

interface PlayerProps {
  src: string;
  textAdvertisement?: string;
  thumbnail?: string;
}
const Player: React.FC<PlayerProps> = (props) => {
  const textClassName = [
    "displaynone",
    "advertisementlefttop",
    "advertisementleftbottom",
    "advertisementrighttop",
    "advertisementrightbottom",
  ];
  const [currentCount, setCount] = useState(0);
  const timer = () =>
    setCount(Math.floor(Math.random() * textClassName.length));

  let video: any = undefined;
  let videoControls: any;
  let playButton: any;
  let playbackIcons: any;
  let timeElapsed: any;
  let duration: any;
  let progressBar: any;
  let seek: any;
  let seekTooltip: any;
  let volumeButton: any;
  let volumeIcons: any;
  let volumeMute: any;
  let volumeLow: any;
  let volumeHigh: any;
  let volume: any;
  let playbackAnimation: any;
  let videoContainer: any;
  let pipButton: any;

  useEffect(() => {
    const id = setInterval(timer, 3000);
    return () => clearInterval(id);
  }, [currentCount]);

  useEffect(() => {
    if (typeof document !== undefined) {
      video = document.getElementById("video");
      videoControls = document.getElementById("video-controls");
      playButton = document.getElementById("play");
      playbackIcons = document.querySelectorAll(".playback-icons use");
      timeElapsed = document.getElementById("time-elapsed");
      duration = document.getElementById("duration");
      progressBar = document.getElementById("progress-bar");
      seek = document.getElementById("seek");
      seekTooltip = document.getElementById("seek-tooltip");
      volumeButton = document.getElementById("volume-button");
      volumeIcons = document.querySelectorAll(".volume-button use");
      volumeMute = document.querySelector('use[href="#volume-mute"]');
      volumeLow = document.querySelector('use[href="#volume-low"]');
      volumeHigh = document.querySelector('use[href="#volume-high"]');
      volume = document.getElementById("volume");
      playbackAnimation = document.getElementById("playback-animation");
      videoContainer = document.getElementById("video-container");
      pipButton = document.getElementById("pip-button");

      const videoWorks = !!document.createElement("video").canPlayType;
      if (videoWorks) {
        video.controls = false;
        videoControls.classList.remove("hidden");
      }
    }
  }, [typeof document !== undefined, currentCount]);

  useEffect(() => {
    if (typeof video !== undefined && video !== undefined) {
      // Add eventlisteners here
      playButton.addEventListener("click", togglePlay);
      video.addEventListener("play", updatePlayButton);
      video.addEventListener("pause", updatePlayButton);
      video.addEventListener("loadedmetadata", initializeVideo);
      initializeVideo();
      video.addEventListener("timeupdate", updateTimeElapsed);
      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("volumechange", updateVolumeIcon);
      video.addEventListener("click", togglePlay);
      video.addEventListener("click", animatePlayback);
      video.addEventListener("mouseenter", showControls);
      video.addEventListener("mouseleave", hideControls);
      videoControls.addEventListener("mouseenter", showControls);
      videoControls.addEventListener("mouseleave", hideControls);
      seek.addEventListener("mousemove", updateSeekTooltip);
      seek.addEventListener("input", skipAhead);
      volume.addEventListener("input", updateVolume);
      volumeButton.addEventListener("click", toggleMute);
      document.addEventListener("keyup", keyboardShortcuts);
      console.log(video.metadata);
    }
  }, [video, currentCount]);

  function togglePlay() {
    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  }

  function updatePlayButton() {
    playbackIcons.forEach((icon: any) => icon.classList.toggle("hidden"));

    if (video.paused) {
      playButton.setAttribute("data-title", "Play (k)");
    } else {
      playButton.setAttribute("data-title", "Pause (k)");
    }
  }

  function formatTime(timeInSeconds = 0) {
    const result = new Date((timeInSeconds | 0) * 1000)
      .toISOString()
      .substring(11, 8);

    return {
      minutes: result.substring(3, 2),
      seconds: result.substring(6, 2),
    };
  }

  function initializeVideo() {
    const videoDuration = Math.round(video.duration);
    seek.setAttribute("max", videoDuration);
    progressBar.setAttribute("max", videoDuration);
    duration.innerText = `${fmtMSS(videoDuration)}`;
    duration.setAttribute(
      "datetime",
      `${fmtMSS(videoDuration).split(":")[0]}m ${
        fmtMSS(videoDuration).split(":")[1]
      }s`
    );
  }

  function updateTimeElapsed() {
    const time = Math.round(video.currentTime);
    timeElapsed.innerText = `${fmtMSS(time)}`;
    timeElapsed.setAttribute(
      "datetime",
      `${fmtMSS(time).split(":")[0]}m ${fmtMSS(time).split(":")[1]}s`
    );
  }

  function updateProgress() {
    seek.value = Math.floor(video.currentTime);
    progressBar.value = Math.floor(video.currentTime);
  }

  function updateSeekTooltip(event: any) {
    const skipTo = Math.round(
      (event.offsetX / event.target.clientWidth) *
        parseInt(event.target.getAttribute("max"), 10)
    );
    seek.setAttribute("data-seek", skipTo);
    const t = formatTime(skipTo);
    seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
    const rect = video.getBoundingClientRect();
    seekTooltip.style.left = `${event.pageX - rect.left}px`;
  }

  function skipAhead(event: any) {
    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;

    video.currentTime = skipTo || 0.0;
    progressBar.value = skipTo || 0.0;
    seek.value = skipTo || 0.0;
  }

  function updateVolume() {
    if (video.muted) {
      video.muted = false;
    }

    video.volume = volume.value;
  }

  function updateVolumeIcon() {
    volumeIcons.forEach((icon: any) => {
      icon.classList.add("hidden");
    });

    volumeButton.setAttribute("data-title", "Mute (m)");

    volume.setAttribute("data-volume", volume.value);

    if (video.muted || video.volume === 0) {
      volumeMute.classList.remove("hidden");
      volumeButton.setAttribute("data-title", "Unmute (m)");
    } else if (video.volume > 0 && video.volume <= 0.5) {
      volumeLow.classList.remove("hidden");
    } else {
      volumeHigh.classList.remove("hidden");
    }
  }

  function toggleMute() {
    video.muted = !video.muted;

    if (video.muted) {
      volume.value = 0;
    } else {
      volume.value = volume.dataset.volume;
    }
  }

  function animatePlayback() {
    playbackAnimation.animate(
      [
        {
          opacity: 1,
          transform: "scale(1)",
        },
        {
          opacity: 0,
          transform: "scale(1.3)",
        },
      ],
      {
        duration: 500,
      }
    );
  }
  function hideControls() {
    if (video.paused) {
      return;
    }

    videoControls.classList.add("hide");
  }

  function showControls() {
    videoControls.classList.remove("hide");
  }

  function keyboardShortcuts(event: any) {
    const { key } = event;
    switch (key) {
      case "k":
        togglePlay();
        animatePlayback();
        if (video.paused) {
          showControls();
        } else {
          setTimeout(() => {
            hideControls();
          }, 2000);
        }
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        // toggleFullScreen();
        break;
      case "p":
        // togglePip();
        break;
    }
  }

  function fmtMSS(s: any) {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
  }

  return (
    <>
      <div className="video-container" id="video-container">
        <div className="playback-animation" id="playback-animation">
          <svg className="playback-icons">
            <use className="hidden" href="#play-icon"></use>
            <use href="#pause"></use>
          </svg>
        </div>

        <video
          className="video"
          id="video"
          preload="metadata"
          controls={false}
          disablePictureInPicture
          poster={props?.thumbnail}
          controlsList="nodownload nofullscreen"
        >
          <source onLoad={initializeVideo} src={props.src} type="video/mp4"></source>
        </video>
        <div className={textClassName[currentCount]}>
          {props?.textAdvertisement || "Advertisement"}
        </div>
        <div className="video-controls hidden" id="video-controls">
          <div className="video-progress">
            <progress id="progress-bar" value="0"></progress>
            <input
              className="seek"
              id="seek"
              value="0"
              min="0"
              type="range"
              step="1"
            />
            <div className="seek-tooltip" id="seek-tooltip">
              00:00
            </div>
          </div>
          <div className="bottom-controls">
            <div className="left-controls">
              <button data-title="Play (k)" id="play">
                <svg className="playback-icons">
                  <use href="#play-icon"></use>
                  <use className="hidden" href="#pause"></use>
                </svg>
              </button>

              <div className="volume-controls">
                <button
                  data-title="Mute (m)"
                  className="volume-button"
                  id="volume-button"
                >
                  <svg>
                    <use className="hidden" href="#volume-mute"></use>
                    <use className="hidden" href="#volume-low"></use>
                    <use href="#volume-high"></use>
                  </svg>
                </button>

                <input
                  className="volume"
                  id="volume"
                  value={volume?.value}
                  data-mute="0.5"
                  type="range"
                  max="1"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="time">
                <time id="time-elapsed">00:00</time>
                <span> / </span>
                <time id="duration">00:00</time>
              </div>
            </div>
          </div>
        </div>
      </div>

      <svg style={{ display: "none" }}>
        <defs>
          <symbol id="pause" viewBox="0 0 24 24">
            <path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
          </symbol>

          <symbol id="play-icon" viewBox="0 0 24 24">
            <path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
          </symbol>

          <symbol id="volume-high" viewBox="0 0 24 24">
            <path d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path>
          </symbol>

          <symbol id="volume-low" viewBox="0 0 24 24">
            <path d="M5.016 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6zM18.516 12q0 2.766-2.531 4.031v-8.063q1.031 0.516 1.781 1.711t0.75 2.32z"></path>
          </symbol>

          <symbol id="volume-mute" viewBox="0 0 24 24">
            <path d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.203-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q1.031 0.516 1.758 1.688t0.727 2.344z"></path>
          </symbol>
        </defs>
      </svg>
    </>
  );
};
export default Player;
