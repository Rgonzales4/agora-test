import "./App.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useState } from "react";

const secrets = {
  appId: `${process.env.REACT_APP_APP_ID}` || "insert app id here",
  channelName: `${process.env.REACT_APP_CHANNEL_NAME}` || "insert channel name here",
  token: `${process.env.REACT_APP_TOKEN}` || "insert token here",
};

const rtc = {
  client: null,
  localVideoTrack: null,
  localAudioTrack: null,
};

async function join() {
  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8", App: secrets.appId, token: secrets.token });
  await rtc.client.join(secrets.appId, "main", secrets.token).then(() => startVideo());
}

async function leaveCall() {
  await stopVideo();
  rtc.client.leave();
}

const startVideo = async () => {
  rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  console.log("Connection State: ", rtc.client.connectionState);
  if (rtc.client.connectionState === "CONNECTED") {
    rtc.client.publish(rtc.localVideoTrack);
    rtc.localVideoTrack.play("videoContainer", { fit: "fill" });
  }
};

const stopVideo = async () => {
  rtc.localVideoTrack.close();
  rtc.localVideoTrack.stop();
  rtc.client.unpublish(rtc.localVideoTrack);
};

async function startCall() {
  await join();
}

const App = () => {
  const [videoOn, setVideoOn] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleCamera = () => {
    if (videoOn) {
      stopVideo();
      setVideoOn(false);
    } else {
      startVideo();
      setVideoOn(true);
    }
  };

  return (
    <div>
      <h1>Hello</h1>
      {!joined ? (
        <button
          onClick={() => {
            startCall();
            setJoined(true);
            setVideoOn(true);
          }}
        >
          Join Call
        </button>
      ) : (
        <button
          onClick={() => {
            leaveCall();
            setJoined(false);
            setVideoOn(false);
          }}
        >
          End Call
        </button>
      )}
      {joined && <button onClick={handleCamera}>Turn {videoOn ? "off" : "on"} Video</button>}
      <div id="videoContainer"></div>
    </div>
  );
};

export default App;
