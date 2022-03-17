import React from "react";
//@ts-ignore
import { useJitsi, Jutsu } from "react-jutsu";

interface Props {
  width: number;
}
const JitsiPlayer: React.FC<Props> = (props) => {
  return (
    <>
       <script async src='https://meet.jit.si/external_api.js'/>
      <Jutsu
        subject="fan"
        containerStyles={{
          width: props?.width + "px",
          height: props?.width / 1.77 + "px",
        }}
        roomName="naruto"
        password="dattebayo"
        displayName="uzumaki"
        onMeetingEnd={() => console.log("Meeting has ended")}
      />
    </>
  );
};

export default JitsiPlayer;
