import { useRouter } from "vue-router"

let peerConnection: RTCPeerConnection | undefined = undefined
let webSocket: WebSocket | undefined = undefined
let localOffer: RTCSessionDescriptionInit | undefined = undefined
let localConnectionId: string | undefined = undefined

type Action = "connectionId" | "createCall" | "joinCall" | "fetchCall" | "leaveCall" | "sendMessage" | "update"

interface Message<T> {
    action: Action,
    data: T,
}

const setup = (url: string, configuration: RTCConfiguration) => {
    if (localConnectionId && webSocket && peerConnection) {
        return
    }
    const router = useRouter();
    peerConnection = new RTCPeerConnection(configuration);
    webSocket = new WebSocket(url)

    webSocket.onopen = () => {
        console.log("CONNECTION OPENED")
        if (!webSocket) {
            console.error("websocket does not exist but is connected")
            return
        }
        webSocket.send(JSON.stringify({"action": "connectionId"}))

    }

    webSocket.onclose = () => {
        console.log("CONNECTION CLOSED")
    }

    webSocket.onmessage = (event) => {
        if (!peerConnection || !localConnectionId) {
            return
        }
        const response: string = event.data
        console.log(response)

        const data: Message<any> = JSON.parse(response)
        console.log(data)
        switch (data.action) {
            case "connectionId":
                localConnectionId = data.data.connection_id
                console.log(localConnectionId)
                break
            case "createCall":
                router.push("/" + data.data.call_id)
                break
            case "joinCall":
                router.push("/" + data.data.call_id)
                break
            case "fetchCall":

            case "leaveCall":
            case "sendMessage":
            case "update":
                console.log(data.data)
                for (const sdp of data.data) {
                    peerConnection.setRemoteDescription(sdp)
                }
                break
            default:
                console.log("issue with response")
        }
    }


    console.log("SETUP COMPLETE")
}

const createCall = async () => {
    if (!peerConnection || !webSocket) {
        console.error("peerConnection not setup, please call setup()")
        console.error("or webSocket not setup, please call setup()")
        return
    }
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    const createCallRequest = {
        action: "createCall",
    }

    webSocket.send(JSON.stringify(createCallRequest))
}

const joinCall = async (callId: string) => {
    if (!peerConnection || !webSocket) {
        console.error("please call setup()")
        return
    }

    const offer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(offer)

    webSocket.send(JSON.stringify({
        "action": "joinCall",
        "data": {}
    }))

}

const fetchCall = async (callId: string) => {
    if (!peerConnection || !webSocket) {
        console.error("please call setup()")
        return
    }

    webSocket.send(JSON.stringify(
        {
            "action": "fetchCall",
            "call_id": callId,
        }
    ))
}

const closeConnection = () => {
    if (webSocket) {
        webSocket.close()
    }
}


export {setup, createCall, closeConnection, joinCall}