import React, { useCallback, useContext, useEffect, useState } from "react";

interface PlayerProps {
  videoId: string;
  textAdvertisement?: string;
  thumbnail?: string;
  width: number;
}

const YouTubePlayer: React.FC<PlayerProps> = (props) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>("00:00");
  const [durationTime, setDurationTime] = useState<string>("00:00");
  const [isMove, setIsMove] = useState<boolean>(false);
  const [isAovivo, setIsAoVivo] = useState<boolean>(false);

  let seekTime: any;

  useEffect(() => {
    if (typeof document !== undefined && typeof window !== undefined) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      //@ts-ignore
      window?.onYouTubeIframeAPIReady = loadVideo;

      document.addEventListener("keyup", keyboardShortcuts);

      const firstScriptTag: any = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      //@ts-ignore
      if (!!window?.YT) {
        loadVideo();
      }
    }

    return () => {};
    //@ts-ignore
  }, [typeof document !== undefined, typeof window]);

  function keyboardShortcuts(event: any) {
    const { key, keyCode } = event;
    if (keyCode == 32) {
      changePlaying();
    }
    switch (key) {
      case "k":
        changePlaying();
        break;
      case "m":
        //@ts-ignore
        window?.PLAYER?.setVolume(
          //@ts-ignore  toggleMute();
          window?.PLAYER?.getVolume() == 0 ? 100 : 0
        );
        break;
    }
  }

  const loadVideo = () => {
    //@ts-ignore
    window.PLAYER = new window.YT.Player(`youtube-player`, {
      videoId: props.videoId,
      height: props.width / 1.77,
      width: props.width,
      rel: 0,
      playerVars: {
        controls: 0,
        showinfo: 0,
        playsinline: 0,
        autoplay: 1,
        fs: 0,
        iv_load_policy: 3,
        loop: 1,
        modestbranding: 1,
        rel: "0",
        enablejsapi: 1,
        "picture-in-picture": 1,
      },

      events: {
        onReady: onPlayerReady,
        onPlaybackRateChange: (a: any) => {
          console.log(a);
        },
        onStateChange: function (event: any) {
          switch (event.data) {
            // Stop the video on ending so recommended videos don't pop up
            case 0: // ended
              //@ts-ignore
              window?.PLAYER.stopVideo();
              break;
            case -1: // unstarted
            case 1: // playing
            case 2: // paused
            case 3: // buffering
            case 5: // video cued
            default:
              break;
          }
        },
        onPlayerStateChange: (e: any) => {
          if (e.data === 0) {
            //@ts-ignore
          }
        },
      },
    });
  };

  const onPlayerReady = (event: any) => {
    event.target.playVideo();
  };

  const changePlaying = () => {
    if (playing) {
      //@ts-ignore
      window?.PLAYER.pauseVideo();

      setPlaying(false);
    } else {
      //@ts-ignore
      window?.PLAYER.playVideo();
      //@ts-ignore
      setPlaying(true);
    }
  };

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

  useEffect(() => {
    const id = setInterval(timer, 3000);
    return () => clearInterval(id);
  }, [currentCount]);

  function hideControls() {
    setShowProgress(false);
  }

  function showControls() {
    setShowProgress(true);
  }

  const timerTime = () => {
    //@ts-ignore
    if ((typeof window?.PLAYER?.getCurrentTime() as any) !== undefined) {
      //@ts-ignore
      setCurrentTime(
        //@ts-ignore
        fmtMSS(Math.round(window?.PLAYER?.getCurrentTime() as any))
      );
      if (durationTime == "00:00") {
        //@ts-ignore
        setDurationTime(
          //@ts-ignore
          fmtMSS(Math.round(window?.PLAYER?.getDuration() as any))
        );
        //@ts-ignore
        if (window?.PLAYER?.getCurrentTime() >= window?.PLAYER?.getDuration()) {
          setIsAoVivo(true);
        }
      }
    }
  };

  function fmtMSS(s: any) {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
  }

  useEffect(() => {
    const id = setInterval(timerTime, 1000);
    return () => clearInterval(id);
  }, [currentTime]);

  const getStatusHidden = useCallback(() => {
    if (!showProgress && playing) return "hidden";
    return "";
  }, [showProgress]);

  return (
    <>
      <div
        style={{
          width: props.width + "px",
          height: props.width / 1.77 + "px",
        }}
        //@ts-ignore

        onMouseOver={() => showControls()}
        onMouseOut={() => hideControls()}
        className="video-container"
        id="video-container"
      >
        <div className={textClassName[currentCount]}>
          {props?.textAdvertisement || "Advertisement"}
        </div>
        <div onClick={changePlaying}>
          <div
            id={`youtube-player`}
            style={{ pointerEvents: "none" }}
            className={"video"}
          />
        </div>
        <div
          className={`video-controls ${getStatusHidden()}`}
          id="video-controls"
        >
          <div className="video-progress">
            <progress
              //@ts-ignore
              max={window?.PLAYER?.getDuration()}
              //@ts-ignore
              value={window?.PLAYER?.getCurrentTime()}
            ></progress>
            <input
              className="seek"
              id="seek"
              //@ts-ignore
              max={window?.PLAYER?.getDuration()}
              //@ts-ignore
              {...(!isMove ? { value: window?.PLAYER?.getCurrentTime() } : {})}
              //@ts-ignore
              defaultValue={window?.PLAYER?.getCurrentTime()}
              //@ts-ignore
              onChange={(e) => {
                if(isAovivo) return;
                 //@ts-ignore
                window.PLAYER?.seekTo(e.target.value)
              }}
              onMouseEnter={() => setIsMove(true)}
              onMouseOut={() => setIsMove(false)}
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
              <button onClick={changePlaying} data-title="Play (k)">
                <svg className="playback-icons">
                  {!playing ? (
                    <use href="#play-icon"></use>
                  ) : (
                    <use href="#pause"></use>
                  )}
                </svg>
              </button>

              <div className="volume-controls">
                <button
                  data-title="Mute (m)"
                  className="volume-button"
                  //@ts-ignore
                  onClick={() =>
                    //@ts-ignore
                    window?.PLAYER?.setVolume(
                      //@ts-ignore
                      window?.PLAYER?.getVolume() == 0 ? 100 : 0
                    )
                  }
                >
                  <svg>
                    {
                      //@ts-ignore
                      window?.PLAYER?.getVolume() == 0 && (
                        <use className="" href="#volume-mute"></use>
                      )
                    }
                    {
                      //@ts-ignore
                      window?.PLAYER?.getVolume() <= 50 &&
                        //@ts-ignore
                        window?.PLAYER?.getVolume() > 0 && (
                          <use className="" href="#volume-low"></use>
                        )
                    }
                    {
                      //@ts-ignore
                      window?.PLAYER?.getVolume() > 50 && (
                        <use href="#volume-high"></use>
                      )
                    }
                  </svg>
                </button>

                <input
                  className="volume"
                  //@ts-ignore
                  defaultValue={window?.PLAYER?.getVolume()}
                  data-mute="0.5"
                  onMouseEnter={() => setIsMove(true)}
                  onMouseOut={() => setIsMove(false)}
                  type="range"
                  //@ts-ignore
                  {...(!isMove ? { value: window?.PLAYER?.getVolume() } : {})}
                  max="100"
                  min="0"
                  //@ts-ignore
                  onChange={(e) => window?.PLAYER?.setVolume(e.target.value)}
                  step="0.01"
                />
              </div>

              <div className="time">
                {isAovivo ? (
                  "AO VIVO"
                ) : (
                  <>
                    {" "}
                    <time id="time-elapsed">{currentTime} </time>
                    <span> / </span>
                    <time id="duration">{durationTime}</time>
                  </>
                )}
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

export default YouTubePlayer;
