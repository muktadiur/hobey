const socket = io("/");
const videoGrid = document.getElementById("video-container");
const meetVideo = document.createElement("video");
meetVideo.muted = true;
const peers = {};
const meetPeer = new Peer(undefined, {
  host: window.location.hostname,
  port: 3001,
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => video.play());
  videoGrid.append(video);
};

const handleCall = (call, stream) => {
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => addVideoStream(video, userVideoStream));
};

const handleUserConnected = (userId, stream) => {
  const call = meetPeer.call(userId, stream);
  call.on("close", () => video.remove());
  peers[userId] = call;
};

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

meetPeer.on("open", (id) => {
  socket.emit("join-channel", CHANNEL_ID, id);
});

async function initializeMedia() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    addVideoStream(meetVideo, stream);

    meetPeer.on("call", (call) => {
      call.answer(stream);
      handleCall(call, stream);
    });

    socket.on("user-connected", (userId) => handleUserConnected(userId, stream));
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
}

initializeMedia();

