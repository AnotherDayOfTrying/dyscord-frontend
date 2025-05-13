import { closeConnection } from "./websocket"

export default {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
    websocketURL: "wss://6fbdn3byml.execute-api.us-east-2.amazonaws.com/dev/",
    dialog: (ev: BeforeUnloadEvent) => {
      ev.preventDefault()
      closeConnection()
      return true
    }
  }