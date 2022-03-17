import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import JitsiPlayer from "../components/jitsi";
import Player from "../components/player";
import VimeoPlayer from "../components/vimeo";
import YouTubePlayer from "../components/youtube";

const DynamicComponent = dynamic(() => import("../components/youtube"), {
  ssr: false,
});

const DynamicComponentVimeo = dynamic(() => import("../components/vimeo"), {
  ssr: false,
});


const DynamicComponentJitisi = dynamic(() => import("../components/jitsi"), {
  ssr: false,
});
const Home: NextPage = () => {
  return (
    <div>
      <div style={{ flexDirection: "column" }} className="container">
        <br />
        <span>MP4</span>
        <br />
        <Player
          textAdvertisement="teste mp4"
          width={720}
          thumbnail=" https://source.unsplash.com/800x300"
          src="https://storage.googleapis.com/media-session/caminandes/short.mp4#t=1"
        />
        <br />
        {/* <iframe
          width="560"
          height="315"
          style={{ overflow: "visible" }}
          src="https://www.youtube-nocookie.com/embed/FQeCadblPb8?controls=0&showinfo=0&autohide=1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; nobranding; picture-in-picture"
          allowFullScreen
        ></iframe> */}
        <span>youtube</span>
        <br />
        <DynamicComponent
          videoId="J-63ZcacXc4"
          textAdvertisement="teste youtube"
          width={720}
        />
        <br />
        <span>vimeo</span>
        <br />
        <DynamicComponentVimeo
          url="https://player.vimeo.com/video/76979871?h=8272103f6e"
          textAdvertisement="teste vimeo"
          width={720}
        />
        <br></br>
        <span>jitsi</span>
        <br/>
<DynamicComponentJitisi width={720}/>
      </div>
    </div>
  );
};

export default Home;
