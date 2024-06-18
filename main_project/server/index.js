const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});


const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
const roomToUsersMap = new Map();

// NEW CODE FOR ROOM AND ROLE CHECKING
io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  socket.on("room:join", (data) => {
    const { email, room, name, summary, role } = data;
    
    if (!roomToUsersMap.has(room)) {
      roomToUsersMap.set(room, []);
    }

    const usersInRoom = roomToUsersMap.get(room);

    // Check if a user with the same role already exists in the room
    const existingUserWithSameRole = usersInRoom.find(user => user.role === role);

    if (existingUserWithSameRole) {
      io.to(socket.id).emit("room:join:error", { message: "Users cannot have the same role in the same room." });
      return;
    }

    // If no conflict, add user to the room
    usersInRoom.push({ email, socketId: socket.id, role });
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    socket.join(room);

    io.to(room).emit("user:joined", { email, id: socket.id, name, summary, role });
    io.to(socket.id).emit("room:join:success", { room });
  });
  // END OF NEW CODE FOR ROOM AND ROLE CHECKING

  // socket.on("room:join", (data) => {
  //   const { email, room, name, summary, role } = data;
  //   emailToSocketIdMap.set(email, socket.id);
  //   socketidToEmailMap.set(socket.id, email);
  //   io.to(room).emit("user:joined", { email, id: socket.id, name, summary, role});
  //   socket.join(room);
  //   io.to(socket.id).emit("room:join", data);
  // });

  // kisi ko call kare toh konsa data aayega
  socket.on("user:call", ({ to, offer, email, name , summary, toRole }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer, email, name, summary, fromRole: (toRole === "Interviewer") ? "Interviewee" : "Interviewer" });
  });

  socket.on("call:accepted", ({ to, ans , email, name, summary, toRole}) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans, email, name, summary, fromRole: (toRole === "Interviewer") ? "Interviewee" : "Interviewer"});
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  // code added while dealing with removing user's data from the room as it was not allowing to join user same room even after leaving the room
  socket.on("leave:call", ({ to }) => {
    handleUserLeaving(socket);
    io.to(to).emit("leave:call");
  });

  // BELOW CODE IS ADDED WHILE ROOM AND ROLE CHECKING

  // socket.on("disconnect", () => {
  //   const email = socketidToEmailMap.get(socket.id);
  //   if (email) {
  //     emailToSocketIdMap.delete(email);
  //     socketidToEmailMap.delete(socket.id);

  //     for (const [room, users] of roomToUsersMap.entries()) {
  //       const index = users.findIndex(user => user.socketId === socket.id);
  //       if (index !== -1) {
  //         users.splice(index, 1);
  //         if (users.length === 0) {
  //           roomToUsersMap.delete(room);
  //         }
  //         else {
  //           io.to(room).emit("user:left", { email, id: socket.id });
  //         }
  //         break;
  //       }
  //     }
  //   }
  //   console.log(`Socket Disconnected`, socket.id);
  // });

  // END OF ROOM AND ROLE CHECKING


  // above code is commented and added below code
  socket.on("disconnect", () => {
    handleUserLeaving(socket);
    console.log(`Socket Disconnected`, socket.id);
  });

  const handleUserLeaving = (socket) => {
    const email = socketidToEmailMap.get(socket.id);
    if (email) {
      emailToSocketIdMap.delete(email);
      socketidToEmailMap.delete(socket.id);

      for (const [room, users] of roomToUsersMap.entries()) {
        const index = users.findIndex(user => user.socketId === socket.id);
        if (index !== -1) {
          users.splice(index, 1);
          if (users.length === 0) {
            roomToUsersMap.delete(room);
          } else {
            io.to(room).emit("user:left", { email, id: socket.id });
          }
          break;
        }
      }
    }
    
  };
  

});
