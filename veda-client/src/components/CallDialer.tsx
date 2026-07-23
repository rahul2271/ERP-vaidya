"use client";

import { useState, useEffect, useRef } from "react";
import { Device } from "@twilio/voice-sdk";
import { PhoneOff, Mic, MicOff, X, PhoneCall, Loader2 } from "lucide-react";
import axios from "@/utils/axiosConfig";

interface CallDialerProps {
  phoneNumber: string;
  patientName: string;
  onClose: () => void;
}

export default function CallDialer({ phoneNumber, patientName, onClose }: CallDialerProps) {
  const [callStatus, setCallStatus] = useState("Initializing...");
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<any>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === "On Call") {
      timer = setInterval(() => setDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  useEffect(() => {
    const startCall = async () => {
      try {
        const { data } = await axios.get("/calls/token");

        const device = new Device(data.token, {
          logLevel: 1,
          edge: 'ashburn',
        });
        deviceRef.current = device;

        await device.register();

        let formattedNumber = String(phoneNumber).trim().replace(/[\s-]/g, '');
        if (!formattedNumber.startsWith("+")) {
          if (formattedNumber.startsWith("0")) {
             formattedNumber = formattedNumber.substring(1);
          }
          formattedNumber = `+91${formattedNumber}`; 
        }

        // 🚀 THE FIX: Get BOTH User ID and Hospital ID for isolation
        const userStr = localStorage.getItem("user");
        const userData = userStr ? JSON.parse(userStr) : {};
        const currentUserId = userData.userId || userData._id || userData.id || "000000000000000000000000";
        const currentHospitalId = userData.hospitalId || "000000000000000000000000";

        // Initiate the call and pass IDs to Twilio
        const call = await device.connect({ 
          params: { 
            To: formattedNumber,
            telecallerId: currentUserId,
            hospitalId: currentHospitalId // 🔒 Pass hospital identity
          } 
        });
        callRef.current = call;

        call.on("accept", () => setCallStatus("On Call"));
        call.on("disconnect", () => {
          setCallStatus("Disconnected");
          setTimeout(onClose, 2000);
        });
        call.on("reject", () => {
          setCallStatus("Rejected");
          setTimeout(onClose, 2000);
        });
        call.on("error", (twilioError) => {
          console.error("Twilio Call Error:", twilioError);
          setCallStatus("Connection Failed");
        });

      } catch (err) {
        console.error("VOIP Error:", err);
        setCallStatus("Connection Failed");
      }
    };

    startCall();

    return () => {
      callRef.current?.disconnect();
      deviceRef.current?.destroy();
    };
  }, [phoneNumber]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-8 right-8 z-[999] w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {callStatus === "On Call" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${callStatus === "On Call" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
            </span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">{callStatus}</p>
          </div>
          <h3 className="text-xl font-black text-white truncate">{patientName}</h3>
          <p className="text-sm font-bold text-slate-400 tracking-tight">{phoneNumber}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
          <X size={20} />
        </button>
      </div>

      {callStatus === "On Call" && (
        <div className="text-center mb-8">
          <p className="text-4xl font-black text-white tabular-nums tracking-tighter">{formatTime(duration)}</p>
        </div>
      )}

      <div className="flex justify-center items-center gap-5">
        <button 
          onClick={() => {
            const newMute = !isMuted;
            callRef.current?.mute(newMute);
            setIsMuted(newMute);
          }}
          disabled={callStatus !== "On Call"}
          className={`p-4 rounded-3xl transition-all ${isMuted ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          {isMuted ? <MicOff size={24}/> : <Mic size={24}/>}
        </button>
        
        <button 
          onClick={() => {
            callRef.current?.disconnect();
            onClose();
          }}
          className="p-6 bg-rose-600 hover:bg-rose-500 text-white rounded-[2rem] shadow-xl shadow-rose-900/40 transition-transform active:scale-95 group"
        >
          <PhoneOff size={32} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
}