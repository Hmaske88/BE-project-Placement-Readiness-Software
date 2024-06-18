import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from '../VidoePlayer/VideoPlayer';

const APP_ID = '1a1806e579c44f5bb3d2536f3f354415';
const TOKEN =
  '007eJxTYHA2uB3y545F/eq5O/f9eXmuM77l8FWf9jeNN0te5/DxrmBUYDBMNLQwMEs1NbdMNjFJM01KMk4xMjU2SzNOMzY1MTE0rbn6ObUhkJHh+IoPDIxQCOKzMJSk5hYwMAAAS0EjKw==';
const CHANNEL = 'temp';

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

export const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === 'audio') {
      // user.audioTrack.play()
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  // useEffect(() => {
  //   client.on('user-published', handleUserJoined);
  //   client.on('user-left', handleUserLeft);
  //   let trackst;
  //   client
  //     .join(APP_ID, CHANNEL, TOKEN, null)
  //     .then((uid) =>
  //       Promise.all([
  //         AgoraRTC.createMicrophoneAndCameraTracks(),
  //         uid,
  //       ])
  //     )
  //     .then(([tracks, uid]) => {
  //       trackst = tracks;
  //       const [audioTrack, videoTrack] = tracks;
  //       setLocalTracks(tracks);
  //       setUsers((previousUsers) => [
  //         ...previousUsers,
  //         {
  //           uid,
  //           videoTrack,
  //           audioTrack,
  //         },
  //       ]);
  //       client.publish(tracks);
  //     });

  //   return () => {
  //     for (let localTrack of localTracks) {
  //       localTrack.stop();
  //       localTrack.close();
  //     }
  //     client.off('user-published', handleUserJoined);
  //     client.off('user-left', handleUserLeft);
  //     client.unpublish(trackst).then(() => client.leave());
  //   };
  // }, []);

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 200px)',
        }}
      >
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};