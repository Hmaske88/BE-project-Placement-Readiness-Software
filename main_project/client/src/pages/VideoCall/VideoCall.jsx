import React, { useState, useCallback, useEffect } from "react";
import { VideoRoom } from '../../components/VideoRoom/VidoRomm';
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";

function VidoCall() {

  // Start of lobby Screen
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [role, setRole] = useState(""); // State to manage the selected role

  const socket = useSocket();
  const navigate = useNavigate();


  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!localStorage.getItem('user')) {
        navigate('/login');
        return;
      }
      const user = JSON.parse(localStorage.getItem('user'));
      socket.emit("room:join", { email:user.email, room, name: user.name, summary: user.Summary, role });
    },
    [email, room, role, socket, navigate]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room, name, summary, role } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  // useEffect(() => {
  //   socket.on("room:join", handleJoinRoom);
  //   return () => {
  //     socket.off("room:join", handleJoinRoom);
  //   };
  // }, [socket, handleJoinRoom]);

  
  // above useEffect is commented and below code is added for ROOM AND ROLE CHECKING
  useEffect(() => {
    socket.on("room:join:error", ({ message }) => {
      alert(message);
    });

    socket.on("room:join:success", ({ room }) => {
      navigate(`/room/${room}`);
    });

    return () => {
      socket.off("room:join:error");
      socket.off("room:join:success");
    };
  }, [socket, navigate]);
  // END OF ROOM AND ROLE CHECKING


  // End of lobby screen


  // const [joined, setJoined] = useState(false);
  return (
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-lg-12 col-xl-11">
        <div className="card text-black" style={{
          borderRadius: '15px',
          position: 'relative',
          backgroundColor: 'transparent',
          backdropFilter: 'blur(55px)',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '20px'
        }}>

          <div className="card-body p-md-5" style={{ padding: '50px', color: 'white' }}>
            <div className="row justify-content-center">
              <div className="col-md-10 col-lg-6 col-xl-10 order-2 order-lg-1">
                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Mock Interview setup</p>

                <div className="d-flex justify-content-center">
                  <form onSubmit={handleSubmitForm} style={{ maxWidth: '300px', margin: 'auto' }}>
                    {/* <div style={{ marginBottom: '15px' }}>
                      <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email ID</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div> */}
                    <div style={{ marginBottom: '15px' }}>
                      <label htmlFor="room" style={{ display: 'block', marginBottom: '5px' }}>Room Number</label>
                      <input
                        type="text"
                        id="room"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label htmlFor="role" style={{ display: 'block', marginBottom: '5px' }}>Select Role</label>
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      >
                        <option value="">Select Role</option>
                        <option value="Interviewer">Interviewer</option>
                        <option value="Interviewee">Interviewee</option>
                      </select>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <button
                      // onClick={handleJoinRoom}
                        style={{
                          backgroundColor: '#007bff',
                          color: '#fff',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        Join Room
                      </button>
                    </div>
                  </form>
                </div>
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VidoCall;