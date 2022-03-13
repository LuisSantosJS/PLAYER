import type { NextPage } from "next";
import Player from "../components/player";

const Home: NextPage = () => {
  return (
    <div>
      <div className="container">
        <Player
          textAdvertisement="Will fresco"
          thumbnail="https://storage.googleapis.com/media-session/caminandes/short.mp4#t=90"
          src="https://storage.googleapis.com/media-session/caminandes/short.mp4#t=88"
        />
      </div>
    </div>
  );
};

export default Home;
