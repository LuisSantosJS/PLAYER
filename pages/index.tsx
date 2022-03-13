import type { NextPage } from "next";
import Player from "../components/player";

const Home: NextPage = () => {
  return (
    <div>
      <div className="container">
        <Player
          textAdvertisement="Will fresco"
          thumbnail="https://source.unsplash.com/random"
          src="https://storage.googleapis.com/media-session/caminandes/short.mp4#t=1"
       // src="http://127.0.0.1:5500/videoplayback.mp4"
        />
      </div>
    </div>
  );
};

export default Home;
