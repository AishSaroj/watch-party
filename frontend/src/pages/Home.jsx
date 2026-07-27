import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import watchImage from "../assets/image.png";


function Home() {


  const navigate = useNavigate();


  const [username, setUsername] = useState("");

  const [roomId, setRoomId] = useState("");





  useEffect(() => {


    const handleRoomCreated = (room) => {


      navigate(
        `/room/${room.roomId}`,
        {
          state: {
            room,
            username
          }
        }
      );

    };





    const handleJoinSuccess = (room) => {


      navigate(
        `/room/${room.roomId}`,
        {
          state: {
            room,
            username
          }
        }
      );

    };






    const handleError = (msg) => {

      alert(msg);

    };





    socket.on(
      "room_created",
      handleRoomCreated
    );


    socket.on(
      "join_success",
      handleJoinSuccess
    );


    socket.on(
      "error",
      handleError
    );





    return () => {


      socket.off(
        "room_created",
        handleRoomCreated
      );


      socket.off(
        "join_success",
        handleJoinSuccess
      );


      socket.off(
        "error",
        handleError
      );


    };



  }, [navigate, username]);









  function createRoom() {


    if (!username.trim()) {

      alert("Enter username");

      return;

    }



    socket.emit(
      "create_room",
      {
        username
      }
    );


  }







  function joinRoom() {


    if (!username.trim()) {

      alert("Enter username");

      return;

    }



    if (!roomId.trim()) {

      alert("Enter room code");

      return;

    }



    socket.emit(
      "join_room",
      {
        roomId,
        username
      }
    );


  }









  return (

    <div className="
    min-h-screen
    flex
    overflow-hidden
    bg-gray-100
">





      {/* LEFT IMAGE */}

      <div className="
        w-1/2
        h-screen
        overflow-hidden
    ">


        <img

          src={watchImage}

          alt="Watch Party"

          className="
                w-full
                h-full
                object-cover
            "

        />


      </div>







      {/* RIGHT SIDE */}

      <div className="
        w-1/2
        h-screen
        flex
        items-center
        justify-center
bg-gray-950
        p-10
    ">





        <div className="
            w-[450px]
            bg-white
            rounded-3xl
            p-12
            shadow-[0_20px_50px_rgba(0,0,0,0.15)]
            border
            border-gray-200
        ">




          <h1 className="
                text-5xl
                font-extrabold
                text-center
                mb-4
                text-gray-900
            ">
            🎬 Watch Party
          </h1>





          <p className="
                text-center
                text-gray-500
                mb-8
                text-lg
            ">
            Watch YouTube together in real time
          </p>







          <input

            placeholder="Enter username"

            value={username}

            onChange={
              (e) => setUsername(e.target.value)
            }

            className="
                    w-full
                    px-5
                    py-4
                    mb-5
                    rounded-xl
                    border
                    border-gray-300
                    text-gray-900
                    outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                "

          />







          <button

            onClick={createRoom}

            className="
                    w-full
                    py-4
                    rounded-xl
                    bg-indigo-600
                    hover:bg-indigo-700
                    text-white
                    font-semibold
                    text-lg
                    transition
                "

          >
            Create Room
          </button>








          <div className="
                flex
                items-center
                gap-3
                my-7
            ">


            <div className="
                    flex-1
                    h-px
                    bg-gray-300
                "></div>


            <span className="
                    text-gray-400
                    text-sm
                ">
              OR
            </span>


            <div className="
                    flex-1
                    h-px
                    bg-gray-300
                "></div>


          </div>







          <input

            placeholder="Room Code"

            value={roomId}

            onChange={
              (e) =>
                setRoomId(
                  e.target.value.toUpperCase()
                )
            }

            className="
                    w-full
                    px-5
                    py-4
                    mb-5
                    rounded-xl
                    border
                    border-gray-300
                    text-gray-900
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                "

          />







          <button

            onClick={joinRoom}

            className="
                    w-full
                    py-4
                    rounded-xl
                    bg-green-500
                    hover:bg-green-600
                    text-white
                    font-semibold
                    text-lg
                    transition
                "

          >
            Join Room
          </button>





        </div>




      </div>





    </div>


  );


}


export default Home;