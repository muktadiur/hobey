class VideoChat {
  constructor() {
    this.socket = io("/");
    this.videoGrid = document.getElementById("video-container");
    this.meetVideo = this.createVideoElement(true);
    this.peers = {};
    this.meetPeer = new Peer(undefined, {
      host: window.location.hostname,
      port: 3001,
    });
    this.registerSocketEvents();
    this.initializeMedia();
  }

  registerSocketEvents() {
    this.socket.on("user-disconnected", (userId) => {
      if (this.peers[userId]) this.peers[userId].close();
    });

    this.meetPeer.on("open", (id) => {
      this.socket.emit("join-channel", CHANNEL_ID, id);
    });
  }

  async initializeMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.addVideoStream(this.meetVideo, stream);

      this.meetPeer.on("call", (call) => {
        call.answer(stream);
        this.handleCall(call, stream);
      });

      this.socket.on("user-connected", (userId) => this.handleUserConnected(userId, stream));
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }

  handleUserConnected(userId, stream) {
    const call = this.meetPeer.call(userId, stream);
    call.on("close", () => this.meetVideo.remove());
    this.peers[userId] = call;
  }

  handleCall(call, stream) {
    const video = this.createVideoElement();
    call.on("stream", (userVideoStream) => this.addVideoStream(video, userVideoStream));
  }

  addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => video.play());
    this.videoGrid.append(video);
  }

  createVideoElement(muted = false) {
    const video = document.createElement("video");
    video.muted = muted;
    return video;
  }
}

// Create a new VideoChat instance
new VideoChat();
