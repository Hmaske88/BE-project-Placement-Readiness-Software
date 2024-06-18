import React, { useEffect, useCallback, useState, useRef } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import AiComponent from "../components/AiComponent/AiComponent";
import { useNavigate, useParams } from "react-router-dom";
import studyGroupHeroBackground from "../assets/Backgrounds/studygroup-grid-background.svg";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const navigate = useNavigate();
  const [remoteEmailId, setRemoteEmailId] = useState(null);
  const [remoteName, setRemoteName] = useState(null);
  const [remoteSummary, setRemoteSummary] = useState(null);
  const [remoteRole, setRemoteRole] = useState(null);

  // for full screen below 2 lines
  const interviewerVideoRef = useRef(null);
  const intervieweeVideoRef = useRef(null);

  // Added for checking if the room and role are same 
  const { roomId } = useParams();
  useEffect(() => {
    socket.emit("room:joined", { room: roomId });

    socket.on("room:user-joined", ({ email }) => {
      console.log(`${email} joined the room.`);
    });

    return () => {
      socket.emit("room:left", { room: roomId });
    };
  }, [socket, roomId]);
  // End of Room and Role Checking
  

  const handleUserJoined = useCallback(({ email, id ,name, summary, role}) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
    setRemoteEmailId(email);
    setRemoteName(name);
    setRemoteSummary(summary);
    setRemoteRole(role);
  }, []);

  // Function to handle full screen
  const handleVideoClick = (ref) => {
    const videoElement = ref.current?.getInternalPlayer(); // Using method provided by ReactPlayer
    if (videoElement) {
      toggleFullScreen(videoElement);
    }
  };

  // for turning on the camera and audio of the 1st user
  // to set the stream
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    const user = JSON.parse(localStorage.getItem('user'));
    // for sending the offer to other user
    socket.emit("user:call", { to: remoteSocketId, offer, email: user.email, name: user.name, summary: user.summary, toRole:remoteRole });
    setMyStream(stream);
  }, [remoteSocketId,remoteRole, socket]);


  // for accepting call
  const handleIncommingCall = useCallback(
    async ({ from, offer, email, name, summary, fromRole }) => {
      setRemoteSocketId(from);
      setRemoteEmailId(email);
      setRemoteName(name);
      setRemoteSummary(summary);
      setRemoteRole(fromRole);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer,email,name,fromRole);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans, email, name, summary,torole: fromRole });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);


  // Added from interview page
  const [interviewerVideo, setInterviewerVideo] = useState('');
  const [intervieweeVideo, setIntervieweeVideo] = useState('');

  const handleInterviewerChange = (e) => {
    setInterviewerVideo(URL.createObjectURL(e.target.files[0]));
  }

  const handleIntervieweeChange = (e) => {
    setIntervieweeVideo(URL.createObjectURL(e.target.files[0]));
  }


  
  const handleLeaveCall = useCallback(() => {
    console.log("Leaving call...");

    if (remoteSocketId) {
      socket.emit("leave:call", { to: remoteSocketId });
    }

    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
      setMyStream(null);
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }

    setRemoteSocketId(null);
    setRemoteEmailId(null);
    setRemoteName(null);
    setRemoteSummary(null);
    setRemoteRole(null);

    navigate("/");
    window.location.reload();  // This line will refresh the website

  }, [navigate, myStream, remoteSocketId, remoteStream, socket]);


  //  Used for stopping the video after leaving the call
  useEffect(() => {
    // Listen for leave call message from the other user
    socket.on("leave:call", handleLeaveCall);

    return () => {
      socket.off("leave:call", handleLeaveCall);
    };
  }, [socket, handleLeaveCall]);

  
  const toggleFullScreen = (videoElement) => {
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) { /* Firefox */
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) { /* IE/Edge */
      videoElement.msRequestFullscreen();
    }
  };

  // interview page end

  return (
    <div>
      <h4 style={{textAlign:"center"}}>{remoteSocketId ? "Connected" : "No one in room"}</h4>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', backgroundImage: `url(${studyGroupHeroBackground})`, color: 'white' }}>
        
        <div style={{textAlign:"center"}}>
          <div style={{ display: 'flex', flexDirection: 'row',justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '10px' }}>
              {myStream && (
                <button
                  onClick={sendStreams}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                  Send Stream
                </button>
              )}
              {remoteSocketId && (
                <button
                  onClick={handleCallUser}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                  CALL
                </button>
              )}
          </div>
        </div>

      <div style={{ flex: '1', display: 'flex' }}>
        
      {myStream && (
        <div style={{ width: '50%', padding: '10px', boxSizing: 'border-box', textAlign: 'center' }}>
          <p style={{color:"black"}}>Interviewer</p>
          <div style={{ border: '5px solid #ccc', borderRadius: '10px', padding: '0px', backgroundColor: '#326b6d' }}>

            <ReactPlayer
            ref={interviewerVideoRef}
            playing
            muted
            height=""
            width="100%"
            // borderRadius='6px'
            onClick={() => handleVideoClick(interviewerVideoRef)}
            url={myStream}
          />

          </div>
        </div>
      )}

{remoteStream && (
        <div style={{ width: '50%', padding: '10px', boxSizing: 'border-box', textAlign: 'center' }}>
          <p style={{color:"black"}}>Interviewee</p>
          <div style={{ border: '5px solid #ccc', borderRadius: '10px', padding: '0px', backgroundColor: '#326b6d' }}>
            <ReactPlayer
            ref={intervieweeVideoRef}
            playing
            muted
            height=""
            width="100%"
            onClick={() => handleVideoClick(intervieweeVideoRef)}
            url={remoteStream}
          />
          </div>
        </div>
)}
      </div>
      <AiComponent remoteSocketId={remoteSocketId} remoteEmailId={remoteEmailId} remoteName={remoteName} remoteSummary={remoteSummary} remoteRole={remoteRole}/>
      <button
        style={{
          alignSelf: 'center',
          background: '#f44336',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 20px',
          marginTop: '20px',
          cursor: 'pointer'
        }}
        onClick={handleLeaveCall}
      >
        Leave Call
      </button>
    </div>
    </div>
  );
};

export default RoomPage;
