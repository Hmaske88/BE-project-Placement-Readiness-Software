import React, { useState } from 'react';
import AiComponent from '../components/AiComponent/AiComponent';
export const Interview = () => {
  const [interviewerVideo, setInterviewerVideo] = useState('');
  const [intervieweeVideo, setIntervieweeVideo] = useState('');

  const handleInterviewerChange = (e) => {
    setInterviewerVideo(URL.createObjectURL(e.target.files[0]));
  }

  const handleIntervieweeChange = (e) => {
    setIntervieweeVideo(URL.createObjectURL(e.target.files[0]));
  }

  const handleLeaveCall = () => {
    console.log('Left call');
  }

  
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', background: 'linear-gradient(to top left, #ccff99 0%, #99ffcc 100%)' }}>
      <div style={{ flex: '1', display: 'flex' }}>
        <div style={{ width: '50%', padding: '10px', boxSizing: 'border-box', textAlign: 'center' }}>
          {/* <p style={{color:"black"}}>Interviewer</p> */}
          <div style={{ border: '5px solid #ccc', borderRadius: '10px', padding: '0px', backgroundColor: '#326b6d' }}>
            <video
              controls
              src={interviewerVideo}
              style={{ width: '100%', height: '70vh', borderRadius: '6px', cursor: 'pointer' }}
              onClick={() => toggleFullScreen(document.getElementById('interviewerVideo'))}
              id="interviewerVideo"
            />
          </div>
          {/* <input
            type="file"
            accept="video/*"
            onChange={handleInterviewerChange}
            style={{ marginTop: '10px' }}
          /> */}
        </div>
        <div style={{ width: '50%', padding: '10px', boxSizing: 'border-box', textAlign: 'center' }}>
          {/* <p style={{color:"black"}}>Interviewee</p> */}
          <div style={{ border: '5px solid #ccc', borderRadius: '10px', padding: '0px', backgroundColor: '#326b6d' }}>
            <video
              controls
              src={intervieweeVideo}
              style={{ width: '100%', height: '70vh', borderRadius: '6px', cursor: 'pointer' }}
              onClick={() => toggleFullScreen(document.getElementById('intervieweeVideo'))}
              id="intervieweeVideo"
            />
          </div>
          {/* <input
            type="file"
            accept="video/*"
            onChange={handleIntervieweeChange}
            style={{ marginTop: '10px' }}
          /> */}
        </div>
      </div>
      
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
  );
}
