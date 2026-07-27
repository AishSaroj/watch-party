const {
    getRoom
} = require("../rooms/roomManager");

function videoEvent(io, socket) {

    // =========================
    // CHANGE VIDEO
    // =========================

    socket.on(
        "change_video",
        ({ roomId, videoId }) => {

            roomId = roomId.trim().toUpperCase();

            const room = getRoom(roomId);

            if (!room)
                return;

            const user =
                room.users.find(
                    u => u.socketId === socket.id
                );

            if (!user)
                return;

            if (
                user.role !== "Host" &&
                user.role !== "Moderator"
            ) {
                socket.emit(
                    "error",
                    "You don't have permission to change video"
                );

                return;
            }

            room.video.videoId = videoId;
            room.video.currentTime = 0;
            room.video.playing = false;

            io.to(roomId).emit(
                "video_changed",
                videoId
            );

            io.to(roomId).emit(
                "room_updated",
                room
            );

            console.log(
                "Video changed by:",
                user.username
            );

        }
    );



    // =========================
    // PLAY VIDEO
    // =========================

    socket.on(
        "play_video",
        ({ roomId, currentTime }) => {

            roomId = roomId.trim().toUpperCase();

            const room =
                getRoom(roomId);

            if (!room)
                return;

            const user =
                room.users.find(
                    u => u.socketId === socket.id
                );

                console.log("PLAY REQUEST");
console.log(user);
                

            if (!user)
                return;

            if (
                user.role !== "Host" &&
                user.role !== "Moderator"
            ) {

                socket.emit(
                    "error",
                    "You don't have permission"
                );

                return;

            }

            room.video.currentTime = currentTime;
            room.video.playing = true;

            socket.to(roomId).emit(
                "play_video",
                {
                    currentTime
                }
            );

            console.log(
                "Play by:",
                user.username
            );

        }
    );



    // =========================
    // PAUSE VIDEO
    // =========================

    socket.on(
        "pause_video",
        ({ roomId, currentTime }) => {

            roomId = roomId.trim().toUpperCase();

            const room =
                getRoom(roomId);

            if (!room)
                return;

            const user =
                room.users.find(
                    u => u.socketId === socket.id
                );

            if (!user)
                return;

            if (
                user.role !== "Host" &&
                user.role !== "Moderator"
            ) {

                socket.emit(
                    "error",
                    "You don't have permission"
                );

                return;

            }

            room.video.currentTime = currentTime;
            room.video.playing = false;

            socket.to(roomId).emit(
                "pause_video",
                {
                    currentTime
                }
            );

            console.log(
                "Pause by:",
                user.username
            );

        }
    );



    // =========================
    // SEEK VIDEO
    // =========================

    socket.on(
        "seek_video",
        ({ roomId, currentTime }) => {

            roomId = roomId.trim().toUpperCase();

            const room =
                getRoom(roomId);

            if (!room)
                return;

            const user =
                room.users.find(
                    u => u.socketId === socket.id
                );

            if (!user)
                return;

            if (
                user.role !== "Host" &&
                user.role !== "Moderator"
            ) {

                socket.emit(
                    "error",
                    "You don't have permission"
                );

                return;

            }

            room.video.currentTime = currentTime;

            socket.to(roomId).emit(
                "seek_video",
                {
                    currentTime
                }
            );

        }
    );



    // =========================
    // CONTINUOUS SYNC
    // =========================

    socket.on(
        "sync_time",
        ({ roomId, currentTime }) => {

            roomId = roomId.trim().toUpperCase();

            const room =
                getRoom(roomId);

            if (!room)
                return;

            const user =
                room.users.find(
                    u => u.socketId === socket.id
                );

            if (!user)
                return;

            if (
                user.role !== "Host" &&
                user.role !== "Moderator"
            ) {
                return;
            }

            room.video.currentTime = currentTime;

            socket.to(roomId).emit(
                "sync_time",
                {
                    currentTime
                }
            );

        }
    );

}

module.exports = videoEvent;