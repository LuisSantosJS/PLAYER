import type { NextPage } from "next";
import Player from "../components/player";

const Home: NextPage = () => {
  return (
    <div>
      <div className="container">
        <Player
          textAdvertisement="Will fresco"
          thumbnail="https://im2.ezgif.com/tmp/ezgif-2-15d7f72170-jpg/ezgif-frame-028.jpg"
          src="https://storage.googleapis.com/media-session/caminandes/short.mp4#t=88"
        />
      </div>
    </div>
  );
};

export default Home;
