import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import socket from "../socket";
import YouTubePlayer from "../components/YouTubePlayer";
import RoomMembers from "../components/RoomMembers";


function Room() {


    const { roomId } = useParams();


    const playerRef = useRef(null);


    const isRemoteAction = useRef(false);

    const pendingSync = useRef(null);

    const playerReady = useRef(false);

    const currentUserRef = useRef(null);

    const [room, setRoom] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);

    const [videoUrl, setVideoUrl] = useState("");

    const [videoId, setVideoId] = useState("");






    useEffect(() => {


    socket.emit(
        "get_room",
        {
            roomId
        }
    );



    const handleRoomUpdated = (roomData) => {


        console.log(
            "Room Updated",
            roomData
        );


        setRoom(roomData);



        const user =
            roomData.users.find(
                u => u.socketId === socket.id
            );


        setCurrentUser(user);

        currentUserRef.current = user;



        if (roomData.video.videoId) {

            setVideoId(
                roomData.video.videoId
            );

        }

    };



    const handleError = (msg) => {

        alert(msg);

    };



    const handleRemoved = () => {

        alert(
            "You have been removed from the room"
        );

        setRoom(null);

    };



    const handleSyncState = (data) => {


        console.log(
            "SYNC STATE",
            data
        );



        if (!data.videoId)
            return;



        if (!playerReady.current) {


            pendingSync.current = data;

            return;

        }





        isRemoteAction.current = true;




        if (data.playing) {

            playerRef.current.play();

        }
        else {

            playerRef.current.pause();

        }




        setTimeout(() => {

            isRemoteAction.current = false;

        }, 2000);


    };



    const handleVideoChange = (id) => {


    console.log(
        "Video Changed Raw:",
        id
    );


    const cleanId =
        id.split("https://")[0]
        .trim();



    console.log(
        "Clean ID:",
        cleanId
    );


    setVideoId(cleanId);


};



    const handleRemotePlay = ({ currentTime }) => {


        console.log(
            "Remote Play",
            currentTime
        );


        if (!playerRef.current)
            return;



        isRemoteAction.current = true;



        const localTime =
            playerRef.current.getCurrentTime();



        const difference =
            Math.abs(localTime - currentTime);



        console.log(
            "Difference:",
            difference
        );



        if (difference > 1) {

            playerRef.current.seek(
                currentTime
            );

        }



        playerRef.current.play();



        setTimeout(() => {

            isRemoteAction.current = false;

        }, 500);


    };



    const handleRemotePause = ({ currentTime }) => {


        console.log(
            "Remote Pause",
            currentTime
        );



        if (!playerRef.current)
            return;



        isRemoteAction.current = true;



        const localTime =
            playerRef.current.getCurrentTime();



        const difference =
            Math.abs(localTime - currentTime);



        if (difference > 1) {

            playerRef.current.seek(
                currentTime
            );

        }



        playerRef.current.pause();



        setTimeout(() => {

            isRemoteAction.current = false;

        }, 500);


    };




    socket.on(
        "room_updated",
        handleRoomUpdated
    );


    socket.on(
        "error",
        handleError
    );


    socket.on(
        "removed_from_room",
        handleRemoved
    );


    socket.on(
        "sync_state",
        handleSyncState
    );


    socket.on(
        "video_changed",
        handleVideoChange
    );


    socket.on(
        "play_video",
        handleRemotePlay
    );


    socket.on(
        "pause_video",
        handleRemotePause
    );





    return () => {


        socket.off(
            "room_updated",
            handleRoomUpdated
        );


        socket.off(
            "error",
            handleError
        );


        socket.off(
            "removed_from_room",
            handleRemoved
        );


        socket.off(
            "sync_state",
            handleSyncState
        );


        socket.off(
            "video_changed",
            handleVideoChange
        );


        socket.off(
            "play_video",
            handleRemotePlay
        );


        socket.off(
            "pause_video",
            handleRemotePause
        );


    };



}, [roomId]);




    function extractVideoId(url) {


        try {


            const urlObj =
                new URL(url);



            if (
                urlObj.hostname.includes("youtube.com")
            ) {

                return urlObj.searchParams.get("v");

            }



            if (
                urlObj.hostname.includes("youtu.be")
            ) {

                return urlObj.pathname.substring(1);

            }



            return "";


        }
        catch {

            return "";

        }


    }









    function loadVideo() {


    const id =
        extractVideoId(videoUrl);



    if (!id) {

        alert(
            "Invalid YouTube URL"
        );

        return;

    }


    console.log(
        "Changing video:",
        id
    );


    console.log(
        "Current User:",
        currentUserRef.current
    );



    socket.emit(
        "change_video",
        {
            roomId,
            videoId:id
        }
    );


}







    function handlePlayerState(event) {


        if (isRemoteAction.current)
            return;


        console.log("CURRENT ROLE:", currentUserRef.current?.role);

        if (
            currentUserRef.current?.role !== "Host" &&
            currentUserRef.current?.role !== "Moderator"
        ) {
            return;
        }



        if (
            event.data !== 1 &&
            event.data !== 2
        ) {
            return;
        }



        const currentTime =
            playerRef.current.getCurrentTime();



        if (event.data === 1) {


            console.log("LOCAL PLAY:", currentUser.role);


            socket.emit(
                "play_video",
                {
                    roomId,
                    currentTime
                }
            );

        }




        if (event.data === 2) {


            console.log("LOCAL PAUSE:", currentUser.role);


            socket.emit(
                "pause_video",
                {
                    roomId,
                    currentTime
                }
            );

        }


    }








    if (!room) {

    return (

        <div
            className="
            min-h-screen
            bg-gray-950
            flex
            items-center
            justify-center
            text-white
            p-6
            "
        >

            <div
                className="
                bg-gray-900
                rounded-2xl
                shadow-xl
                p-10
                text-center
                max-w-md
                border
                border-gray-700
                "
            >

                <div
                    className="
                    text-5xl
                    mb-5
                    "
                >
                    🚫
                </div>


                <h2
                    className="
                    text-2xl
                    font-bold
                    mb-3
                    "
                >
                    You are no longer in this room
                </h2>


                <p
                    className="
                    text-gray-400
                    mb-6
                    "
                >
                    The host removed you from the watch party.
                    You can join another room or create a new one.
                </p>



                <button
                    onClick={() => window.location.href = "/"}
                    className="
                    bg-blue-600
                    hover:bg-blue-700
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                    "
                >
                    Go to Home
                </button>


            </div>

        </div>

    );

}








    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">

            <div className="flex gap-8">


                {/* LEFT SIDEBAR */}

                <div
    className="
    w-80
    bg-gray-900
    rounded-2xl
    p-6
    shadow-lg
    flex
    flex-col
    max-h-[80vh]
    "
>


    <h2 className="text-2xl font-bold mb-4">
        🎬 Room
    </h2>


    <div className="bg-gray-800 rounded-lg p-3 mb-5">

        <p className="text-gray-400 text-sm">
            Room ID
        </p>

        <p className="font-mono text-lg break-all">
            {room.roomId}
        </p>

    </div>



    <hr className="border-gray-700 mb-5" />



    <div
        className="
        overflow-y-auto
        overflow-x-hidden
        pr-2
        "
    >

        <RoomMembers
            room={room}
            currentUser={currentUser}
        />

    </div>


</div>





                {/* VIDEO SECTION */}


                <div className="flex-1">


                    <div
                        className="
                    bg-gray-900
                    rounded-2xl
                    p-6
                    shadow-lg
                    "
                    >


                        <h2 className="text-2xl font-bold mb-5">
                            ▶️ YouTube Player
                        </h2>




                        <div className="flex gap-3 mb-6">


                            <input

                                type="text"

                                placeholder="Paste YouTube URL"

                                value={videoUrl}

                                onChange={
                                    (e) =>
                                        setVideoUrl(
                                            e.target.value
                                        )
                                }


                                className="
                            flex-1
                            bg-gray-800
                            border
                            border-gray-700
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                            focus:border-blue-500
                            "

                            />




                            <button

                                onClick={loadVideo}

                                className="
                            bg-blue-600
                            hover:bg-blue-700
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                            transition
                            "

                            >

                                Load

                            </button>



                        </div>





                        <div
                            className="
                        rounded-xl
                        overflow-hidden
                        bg-black
                        "
                        >


                            <YouTubePlayer

                                ref={playerRef}


                                videoId={videoId}


                                canControl={
                                    currentUser?.role === "Host" ||
                                    currentUser?.role === "Moderator"
                                }


                                onPlayerStateChange={
                                    handlePlayerState
                                }



                                onReady={() => {


                                    console.log(
                                        "ROOM PLAYER READY"
                                    );


                                    playerReady.current = true;



                                    if (
                                        pendingSync.current
                                    ) {

                                        const data =
                                            pendingSync.current;



                                        if (data.playing) {
                                            playerRef.current.play();
                                        }
                                        else {
                                            playerRef.current.pause();
                                        }



                                        pendingSync.current = null;

                                    }


                                }}

                            />


                        </div>



                    </div>


                </div>



            </div>





        </div>
    );
}

export default Room;