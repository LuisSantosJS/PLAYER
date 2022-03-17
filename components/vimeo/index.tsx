import React, { useCallback, useContext, useEffect, useState } from "react";
import Player from "@vimeo/player";
interface PlayerProps {
  url: string;
  textAdvertisement?: string;
  thumbnail?: string;
  width: number;
}

const VimeoPlayer: React.FC<PlayerProps> = (props) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>("00:00");
  const [currentTimeP, setCurrentTimeP] = useState<number>(0);
  const [durationTime, setDurationTime] = useState<string>("00:00");
  const [durationTimeP, setDurationTimeP] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [isMove, setIsMove] = useState<boolean>(false);


  useEffect(() => {
    //@ts-ignore
    window.PLAYERVIMEO = new Player("youtube-player-vimeo", {
      id: 19231868,
      width: props.width,
      height: props.width / 1.77,
      muted: false,
      controls: false,
      url: props.url,
      loop: true,
      pip: true,
      playsinline: false,
      
      
    });
  }, []);

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

  const changePlaying = () => {
    if (playing) {
      //@ts-ignore
      window?.PLAYERVIMEO.pause();

      setPlaying(false);
    } else {
      //@ts-ignore
      window?.PLAYERVIMEO.play();
      //@ts-ignore
      setPlaying(true);
    }
  };

  function showControls() {
    setShowProgress(true);
  }

  const timerTime = async () => {
    //@ts-ignore
    const currentTime = await window?.PLAYERVIMEO?.getCurrentTime();

    setCurrentTime(fmtMSS(Math.round(currentTime as any)));
    //@ts-ignore
    setVolume(await window?.PLAYERVIMEO?.getVolume());

    setCurrentTimeP(currentTime);
    if (durationTime == "00:00") {
      //@ts-ignore
      const durationTime = await window.PLAYERVIMEO.getDuration();
      setDurationTime(fmtMSS(Math.round(durationTime as any)));

      setDurationTimeP(durationTime);
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

  const requestPictureInPicture = async () =>{
    //@ts-ignore

   await window?.PLAYERVIMEO?.requestPictureInPicture();
  }

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
        <div className={'advertisementleftbottomm'}>
          <img height={70} src="/logo.png"/>
        </div>
        <div onClick={changePlaying}>
          <div
            id={`youtube-player-vimeo`}
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
              max={durationTimeP}
              //@ts-ignore
              value={currentTimeP}
            ></progress>
            <input
              className="seek"
              id="seek"
              //@ts-ignore
              max={durationTimeP}
              //@ts-ignore
              {...(!isMove ? { value: currentTimeP } : {})}
              //@ts-ignore
              defaultValue={currentTimeP}
              //@ts-ignore
              onChange={async (e) => {
                //@ts-ignore
                await window.PLAYERVIMEO?.setCurrentTime(e.target.value);
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
              <button
                onClick={() => {
                  //@ts-ignore
                  changePlaying();
                }}
                data-title="Play (k)"
              >
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
                  onClick={async () =>
                    //@ts-ignore
                    await window?.PLAYERVIMEO?.setVolume(
                      //@ts-ignore
                      volume === 0 ? 1 : 0
                    )
                  }
                >
                  <svg>
                    {volume == 0 && (
                      <use className="" href="#volume-mute"></use>
                    )}
                    {volume < 0.5 && volume > 0 && (
                      <use className="" href="#volume-low"></use>
                    )}
                    {volume >= 0.5 && <use href="#volume-high"></use>}
                  </svg>
                </button>

                <input
                  className="volume"
                  defaultValue={1}
                  data-mute="0.5"
                  onMouseEnter={() => setIsMove(true)}
                  onMouseOut={async (e) => {
                    //@ts-ignore
                    await window?.PLAYERVIMEO?.setVolume(e.currentTarget.value);
                    setIsMove(false);
                  }}
                  type="range"
                  max="1"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="time">
                <time id="time-elapsed">{currentTime} </time>
                <span> / </span>
                <time id="duration">{durationTime}</time>
              </div>
            </div>
            {/* <div className="right-controls">
              <button
                data-title="PIP (p)"
                className="pip-button"
              //@ts-ignore
                onClick={requestPictureInPicture}
              >
                <svg>
                  <use href="#pip"></use>
                </svg>
              </button>
            </div> */}
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

          <symbol id="pip" viewBox="0 0 24 24">
            <path d="M21 19.031v-14.063h-18v14.063h18zM23.016 18.984q0 0.797-0.609 1.406t-1.406 0.609h-18q-0.797 0-1.406-0.609t-0.609-1.406v-14.016q0-0.797 0.609-1.383t1.406-0.586h18q0.797 0 1.406 0.586t0.609 1.383v14.016zM18.984 11.016v6h-7.969v-6h7.969z"></path>
          </symbol>
        </defs>
      </svg>
    </>
  );
};

export default VimeoPlayer;
