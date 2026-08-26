// import { useEffect, useRef, useState } from "react";
// import { PhoneCall, Loader2, CheckCircle2 } from "lucide-react";
// import socket from "../socket";

// const user = JSON.parse(localStorage.getItem("user") || "null");

// function QuickCallButton() {
//   const [status, setStatus] = useState("idle"); // idle | calling | answered
//   const [answeredBy, setAnsweredBy] = useState("");
//   const activeCallIdRef = useRef(null);
//   const resetTimerRef = useRef(null);

//   useEffect(() => {
//     const handleCallEnded = (endedData) => {
//       setStatus("answered");
//       setAnsweredBy(endedData.stoppedBy);
//       clearTimeout(resetTimerRef.current);

//       resetTimerRef.current = setTimeout(() => {
//         setStatus("idle");
//         activeCallIdRef.current = null;
//       }, 3000);
//     };

//     socket.on("call_ended", handleCallEnded);
//     return () => {
//       socket.off("call_ended", handleCallEnded);
//       clearTimeout(resetTimerRef.current);
//     };
//   }, []);

//   const handleCall = () => {
//     if (status === "calling") return;

//     setStatus("calling");

//     socket.emit("call_butler", {
//       callerId: user?.id,
//       callerName: user?.name || "A team member",
//     });

//     clearTimeout(resetTimerRef.current);
//     resetTimerRef.current = setTimeout(() => {
//       setStatus("idle"); // fallback if nobody answers within 60s
//     }, 60000);
//   };

//   return (
//     <button
//       onClick={handleCall}
//       disabled={status === "calling"}
//       className={`w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-base shadow-lg transition-all active:scale-[0.98] ${
//         status === "answered"
//           ? "bg-emerald-500 text-white shadow-emerald-200"
//           : status === "calling"
//           ? "bg-orange-400 text-white shadow-orange-200 cursor-wait"
//           : "bg-red-500 text-white shadow-red-200 hover:opacity-90"
//       }`}
//     >
//       {status === "calling" && (
//         <>
//           <Loader2 className="w-5 h-5 animate-spin" />
//           Calling a butler…
//         </>
//       )}
//       {status === "answered" && (
//         <>
//           <CheckCircle2 className="w-5 h-5" />
//           {answeredBy} is on it
//         </>
//       )}
//       {status === "idle" && (
//         <>
//           <PhoneCall className="w-5 h-5" />
//           Quick Call a Butler
//         </>
//       )}
//     </button>
//   );
// }

// export default QuickCallButton;
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import {
  PhoneCall,
  PhoneOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import socket from "../socket";

const user = JSON.parse(localStorage.getItem("user") || "null");

function QuickCallButton() {
   const { t } = useTranslation();
  const [status, setStatus] = useState("idle");
  // idle | calling | answered

  const [answeredBy, setAnsweredBy] = useState("");

  const activeCallIdRef = useRef(null);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    const handleCallStarted = (callData) => {
        console.log("Call started:", callData);
        if (callData?.callId) {
            activeCallIdRef.current = callData.callId;
        }
    };

    const handleCallResponded = (responseData) => {
        console.log("Call responded:", responseData);

        if (
            activeCallIdRef.current &&
            responseData?.callId &&
            activeCallIdRef.current !== responseData.callId
        ) {
            return;
        }

        clearTimeout(resetTimerRef.current);

        setStatus(responseData.accepted ? "accepted" : "rejected");
        setAnsweredBy(responseData?.respondedBy || "Butler");

        resetTimerRef.current = setTimeout(() => {
            setStatus("idle");
            setAnsweredBy("");
            activeCallIdRef.current = null;
        }, 3000);
    };

    const handleCallEnded = (endedData) => {
        console.log("Call ended:", endedData);

        if (
            activeCallIdRef.current &&
            endedData?.callId &&
            activeCallIdRef.current !== endedData.callId
        ) {
            return;
        }

        // If the caller ended it themselves, or nobody responded (fallback),
        // just reset — call_responded already handles the accept/reject case.
        if (endedData?.endedBy === "caller") {
            clearTimeout(resetTimerRef.current);
            setStatus("idle");
            setAnsweredBy("");
            activeCallIdRef.current = null;
        }
    };

    socket.on("call_started", handleCallStarted);
    socket.on("call_responded", handleCallResponded);
    socket.on("call_ended", handleCallEnded);

    return () => {
        socket.off("call_started", handleCallStarted);
        socket.off("call_responded", handleCallResponded);
        socket.off("call_ended", handleCallEnded);
        clearTimeout(resetTimerRef.current);
    };
}, []);

  // useEffect(() => {
  //   // ==========================================
  //   // BACKEND CONFIRMS CALL WAS CREATED
  //   // ==========================================
  //   const handleCallStarted = (callData) => {
  //     console.log("Call started:", callData);

  //     if (callData?.callId) {
  //       activeCallIdRef.current = callData.callId;
  //     }
  //   };

  //   // ==========================================
  //   // CALL ENDED
  //   // ==========================================
  //   const handleCallEnded = (endedData) => {
  //     console.log("Call ended:", endedData);

  //     // Ignore events for another call
  //     if (
  //       activeCallIdRef.current &&
  //       endedData?.callId &&
  //       activeCallIdRef.current !== endedData.callId
  //     ) {
  //       return;
  //     }

  //     clearTimeout(resetTimerRef.current);

  //     // ==========================================
  //     // CALLER ENDED THE CALL
  //     // ==========================================
  //     if (endedData?.endedBy === "caller") {
  //       setStatus("idle");
  //       setAnsweredBy("");
  //       activeCallIdRef.current = null;
  //       return;
  //     }

  //     // ==========================================
  //     // BUTLER STOPPED / ANSWERED THE CALL
  //     // ==========================================
  //     setStatus("answered");
  //     setAnsweredBy(endedData?.stoppedBy || "Butler");

  //     resetTimerRef.current = setTimeout(() => {
  //       setStatus("idle");
  //       setAnsweredBy("");
  //       activeCallIdRef.current = null;
  //     }, 3000);
  //   };

  //   socket.on("call_started", handleCallStarted);
  //   socket.on("call_ended", handleCallEnded);

  //   return () => {
  //     socket.off("call_started", handleCallStarted);
  //     socket.off("call_ended", handleCallEnded);

  //     clearTimeout(resetTimerRef.current);
  //   };
  // }, []);

  // ==========================================
  // CALL BUTLER
  // ==========================================
  const handleCall = () => {
    if (status === "calling") return;

    clearTimeout(resetTimerRef.current);

    setStatus("calling");
    setAnsweredBy("");

    // Remove old call ID
    activeCallIdRef.current = null;

    socket.emit("call_butler", {
      callerId: user?.id,
      callerName: user?.name || "A team member",
    });

    // Fallback after 60 seconds
    resetTimerRef.current = setTimeout(() => {
      setStatus("idle");
      activeCallIdRef.current = null;
    }, 60000);
  };

  // ==========================================
  // END CALL FROM CALLER SIDE
  // ==========================================
  const handleEndCall = () => {
    const callId = activeCallIdRef.current;

    if (!callId) {
      console.log("No active call ID found");
      setStatus("idle");
      return;
    }

    console.log("Caller ending call:", callId);

    socket.emit("stop_call", {
      callId,
      callerId: user?.id,
      stoppedBy: user?.name || "Caller",
      endedBy: "caller",
    });

    clearTimeout(resetTimerRef.current);

    setStatus("idle");
    setAnsweredBy("");
    activeCallIdRef.current = null;
  };

  return (
  <button
  onClick={status === "calling" ? handleEndCall : handleCall}
  className={`w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-base shadow-lg transition-all active:scale-[0.98] ${
    status === "accepted"
      ? "bg-emerald-500 text-white shadow-emerald-200"
      : status === "rejected"
      ? "bg-slate-500 text-white shadow-slate-200"
      : status === "calling"
      ? "bg-red-600 text-white shadow-red-200 hover:bg-red-700"
      : "bg-red-500 text-white shadow-red-200 hover:opacity-90"
  }`}
>
  {status === "calling" && (
    <>
      <PhoneOff className="w-5 h-5" />
       {t("quickCall.buttonCalling")}
    </>
  )}

  {status === "accepted" && (
    <>
      <CheckCircle2 className="w-5 h-5" />
      {t("quickCall.buttonAccepted", { name: answeredBy })}
    </>
  )}

  {status === "rejected" && (
    <>
      <PhoneOff className="w-5 h-5" />
      {t("quickCall.buttonRejected", { name: answeredBy })}
    </>
  )}

  {status === "idle" && (
    <>
      <PhoneCall className="w-5 h-5" />
      {t("quickCall.buttonIdle")}
    </>
  )}
</button>
  );
}

export default QuickCallButton;