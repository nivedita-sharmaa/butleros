// import { useEffect, useRef, useState } from "react";
// import { PhoneCall, PhoneOff } from "lucide-react";
// import socket from "../socket";

// const user = JSON.parse(localStorage.getItem("user") || "null");

// function startRingtone() {
//   const audio = new Audio("/buzzer.mp3");

//   audio.loop = true;
//   audio.volume = 1.0;

//   audio.play()
//   .then(() => {
//     console.log("🔊 BUZZER PLAYING");
//   })
//   .catch((err) => {
//     console.error("❌ BUZZER BLOCKED:", err.name, err.message);
//   });


//   return () => {
//     audio.pause();
//     audio.currentTime = 0;
//   };
// }


// function CallAlertOverlay() {
//   const [incomingCall, setIncomingCall] = useState(null);
//   const stopRingRef = useRef(null);

//   useEffect(() => {
//     if (user?.role !== "Butler") return; // only Butlers get buzzed

//     const handleIncomingCall = (callData) => {
//       console.log("Incoming call:", callData);
//       setIncomingCall(callData);
//       stopRingRef.current = startRingtone();
//     };

//     const handleCallEnded = (endedData) => {
//       setIncomingCall((current) => {
//         if (current && current.callId === endedData.callId) {
//           if (stopRingRef.current) {
//             stopRingRef.current();
//             stopRingRef.current = null;
//           }
//           return null;
//         }
//         return current;
//       });
//     };

//     socket.on("incoming_call", handleIncomingCall);
//     socket.on("call_ended", handleCallEnded);

//     return () => {
//       socket.off("incoming_call", handleIncomingCall);
//       socket.off("call_ended", handleCallEnded);
//       if (stopRingRef.current) stopRingRef.current();
//     };
//   }, []);

//   const handleStop = () => {
//     if (!incomingCall) return;

//     socket.emit("stop_call", {
//       callId: incomingCall.callId,
//       callerId: incomingCall.callerId,
//       stoppedBy: user?.name || "A butler",
//     });

//     if (stopRingRef.current) {
//       stopRingRef.current();
//       stopRingRef.current = null;
//     }

//     setIncomingCall(null);
//   };

//   if (!incomingCall) return null;

//   return (
//     <div className="fixed inset-0 z-[10000] bg-[#172033]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 px-6">
//       <style>{`
//         @keyframes ringPulse {
//           0% { transform: scale(1); opacity: 1; }
//           50% { transform: scale(1.15); opacity: 0.6; }
//           100% { transform: scale(1); opacity: 1; }
//         }
//         .ring-pulse { animation: ringPulse 0.9s ease-in-out infinite; }
//       `}</style>

//       <span className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center ring-pulse">
//         <PhoneCall className="w-10 h-10" />
//       </span>

//       <div className="text-center">
//         <p className="text-slate-400 text-sm font-bold uppercase tracking-wide mb-2">
//           Quick Call
//         </p>
//         <h2 className="text-white text-3xl font-black">{incomingCall.callerName}</h2>
//         <p className="text-slate-400 mt-2">is calling for assistance</p>
//       </div>

//       <button
//         onClick={handleStop}
//         className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-500 text-white font-bold text-lg shadow-lg shadow-red-500/30 hover:opacity-90 active:scale-95 transition-all"
//       >
//         <PhoneOff className="w-5 h-5" />
//         Stop
//       </button>
//     </div>
//   );
// }

// export default CallAlertOverlay;

import { useEffect, useRef, useState } from "react";
import { PhoneCall, PhoneOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import socket from "../socket";

const user = JSON.parse(localStorage.getItem("user") || "null");
const API_URL = import.meta.env.VITE_API_URL;
function startRingtone() {
  const audio = new Audio("/buzzer.mp3");

  audio.loop = true;
  audio.volume = 1.0;

  console.log("🔔 Starting buzzer...");

  audio
    .play()
    .then(() => {
      console.log("🔊 BUZZER PLAYING");
    })
    .catch((err) => {
      console.error("❌ BUZZER FAILED:", err.name, err.message);
    });

  return () => {
    console.log("🔕 Stopping buzzer");

    audio.pause();
    audio.currentTime = 0;
  };
}

function CallAlertOverlay() {
  const { t } = useTranslation();
  const [incomingCall, setIncomingCall] = useState(null);
  const stopRingRef = useRef(null);

  useEffect(() => {
    if (user?.role !== "Butler") return;

    // Check if a call is already active when the app opens
  const checkActiveCall = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/calls/active`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();

            if (data.activeCall) {
                console.log("📞 Found active call on load:", data.activeCall);
                setIncomingCall(data.activeCall);
                stopRingRef.current = startRingtone();
            }
        } catch (err) {
            console.log("Active call check error:", err);
        }
    };

    checkActiveCall();

    const handleIncomingCall = (callData) => {
      console.log("📞 Incoming call:", callData);

      // Stop any previous ringtone first
      if (stopRingRef.current) {
        stopRingRef.current();
        stopRingRef.current = null;
      }

      setIncomingCall(callData);

      stopRingRef.current = startRingtone();
    };

    const handleCallEnded = (endedData) => {
      console.log("📴 Call ended:", endedData);

      setIncomingCall((current) => {
        if (current && current.callId === endedData.callId) {
          if (stopRingRef.current) {
            stopRingRef.current();
            stopRingRef.current = null;
          }

          return null;
        }

        return current;
      });
    };

    socket.on("incoming_call", handleIncomingCall);
    socket.on("call_ended", handleCallEnded);

    return () => {
      socket.off("incoming_call", handleIncomingCall);
      socket.off("call_ended", handleCallEnded);

      if (stopRingRef.current) {
        stopRingRef.current();
        stopRingRef.current = null;
      }
    };
  }, []);

  // const handleStop = () => {
  //   if (!incomingCall) return;

  //   socket.emit("stop_call", {
  //     callId: incomingCall.callId,
  //     callerId: incomingCall.callerId,
  //     stoppedBy: user?.name || "A butler",
  //   });

  //   if (stopRingRef.current) {
  //     stopRingRef.current();
  //     stopRingRef.current = null;
  //   }

  //   setIncomingCall(null);
  // };
  const respondToCall = (accepted) => {
    if (!incomingCall) return;

    socket.emit("respond_call", {
        callId: incomingCall.callId,
        callerId: incomingCall.callerId,
        accepted,
        respondedBy: user?.name || "A butler",
    });

    if (stopRingRef.current) {
        stopRingRef.current();
        stopRingRef.current = null;
    }

    setIncomingCall(null);
};

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-[#172033]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 px-6">

      <style>{`
        @keyframes ringPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.15);
            opacity: 0.6;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .ring-pulse {
          animation: ringPulse 0.9s ease-in-out infinite;
        }
      `}</style>

      <span className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center ring-pulse">
        <PhoneCall className="w-10 h-10" />
      </span>

      <div className="text-center">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-wide mb-2">
          {t("quickCall.overlayLabel")}
        </p>

        <h2 className="text-white text-3xl font-black">
          {incomingCall.callerName}
        </h2>

        <p className="text-slate-400 mt-2">
          {t("quickCall.overlaySubtitle")}
        </p>
      </div>

      {/* <button
        onClick={handleStop}
        className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-500 text-white font-bold text-lg shadow-lg shadow-red-500/30 hover:opacity-90 active:scale-95 transition-all"
      >
        <PhoneOff className="w-5 h-5" />
        Stop
      </button> */}
            <div className="flex gap-4">
        <button
          onClick={() => respondToCall(true)}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/30 hover:opacity-90 active:scale-95 transition-all"
        >
          <PhoneCall className="w-5 h-5" />
         {t("quickCall.accept")}
        </button>

        <button
          onClick={() => respondToCall(false)}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-500 text-white font-bold text-lg shadow-lg shadow-red-500/30 hover:opacity-90 active:scale-95 transition-all"
        >
          <PhoneOff className="w-5 h-5" />
          {t("quickCall.reject")}
        </button>
      </div>

    </div>
  );
}

export default CallAlertOverlay;
