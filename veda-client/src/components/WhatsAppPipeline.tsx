"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Lock, MessageCircle, RefreshCw, AlertCircle, Check, CheckCheck, Paperclip, X } from "lucide-react";
import axios from "@/utils/axiosConfig";
import { toast } from "react-hot-toast"; 

interface Props {
  leadId: string;
  leadName: string;
  leadPhone: string;
  isPremium: boolean; // We receive this from parent, but we will double check it!
}

export default function WhatsAppPipeline({ leadId, leadName, leadPhone, isPremium: initialPremium }: Props) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  // 🚀 THE FIX: Local state to hold the verified premium status
  const [isVerifiedPremium, setIsVerifiedPremium] = useState(initialPremium);
  const [verifying, setVerifying] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🚀 NEW: Double check the actual plan from the backend when this opens
  useEffect(() => {
    const verifyPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/hospitals/my-plan", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.plan === "PREMIUM") {
          setIsVerifiedPremium(true);
        }
      } catch (error) {
        console.error("Failed to verify plan status");
      } finally {
        setVerifying(false);
      }
    };
    verifyPlan();
  }, []);

  // FETCH HISTORY
  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/whatsapp/${leadId}`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatHistory(res.data);
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  };

  // 🚀 FIXED: Now depends on our verified premium state
  useEffect(() => {
    if (isVerifiedPremium && leadId) {
      fetchChatHistory(); 
      const interval = setInterval(fetchChatHistory, 5000); 
      return () => clearInterval(interval);
    }
  }, [leadId, isVerifiedPremium]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Loading state while checking plan
  if (verifying) {
    return (
      <div className="h-[400px] w-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <RefreshCw size={24} className="animate-spin text-slate-400 mb-2" />
        <p className="text-sm text-slate-500">Connecting to WhatsApp Hub...</p>
      </div>
    );
  }

  // THE PREMIUM PAYWALL UI
  if (!isVerifiedPremium) {
    return (
      <div className="h-[400px] w-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] pointer-events-none"></div>
        <div className="h-16 w-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg mb-4 text-white">
          <Lock size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Unlock Native WhatsApp</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          Stop switching tabs. Chat with leads directly inside Veda ERP and auto-save the history to their file.
        </p>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2">
          <MessageCircle size={16} /> Upgrade to Premium
        </button>
      </div>
    );
  }

  // SEND MESSAGE LOGIC
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && !selectedFile) || isSending) return;

    if (!leadPhone) {
      toast.error("Cannot send message. Patient phone number is missing.");
      return;
    }

    setIsSending(true);
    try {
      const token = localStorage.getItem("token");

      if (selectedFile) {
        const formData = new FormData();
        formData.append("leadId", leadId);
        formData.append("phone", String(leadPhone));
        if (message.trim()) formData.append("text", message);
        formData.append("file", selectedFile);

        await axios.post('/whatsapp/send-media', formData, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        });
      } else {
        await axios.post('/whatsapp/send', 
          { leadId, phone: String(leadPhone), text: message }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setMessage("");
      setSelectedFile(null); 
      if (fileInputRef.current) fileInputRef.current.value = ""; 
      await fetchChatHistory(); 
    } catch (error: any) {
      console.error("WhatsApp send failed", error);
      toast.error(error.response?.data?.message || "Failed to send message via Meta API.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[400px] flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
      <div className="bg-emerald-500 p-3 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} />
          <span className="font-bold text-sm">WhatsApp: {leadName}</span>
        </div>
        <span className="text-[10px] bg-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
          <RefreshCw size={10} className="animate-spin" /> Live
        </span>
      </div>

      {!leadPhone && (
        <div className="bg-rose-50 p-2 text-rose-600 text-xs font-bold flex justify-center items-center gap-2 border-b border-rose-100">
          <AlertCircle size={14} /> Lead has no phone number attached.
        </div>
      )}

      <div ref={chatContainerRef} className="flex-1 p-4 bg-[#efeae2] overflow-y-auto space-y-3 custom-scrollbar relative">
        {chatHistory.length === 0 ? (
          <p className="text-center text-xs text-slate-500 bg-white/60 py-1 px-3 rounded-full w-max mx-auto shadow-sm">
            This chat is encrypted and saved to the lead's file.
          </p>
        ) : (
          chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender !== 'PATIENT' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 text-sm rounded-lg shadow-sm max-w-[80%] ${
                msg.sender !== 'PATIENT' ? 'bg-[#d9fdd3] text-slate-800 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                
                {msg.mediaUrl && (
                  <div className="mb-2">
                    {msg.messageType === 'IMAGE' && (
                      <a href={`http://localhost:3000${msg.mediaUrl}`} target="_blank" rel="noreferrer">
                        <img 
                          src={`http://localhost:3000${msg.mediaUrl}`} 
                          alt="Patient upload" 
                          className="w-48 h-auto rounded-md object-cover border border-black/10 hover:opacity-90 transition-opacity cursor-pointer"
                        />
                      </a>
                    )}
                    {msg.messageType === 'VIDEO' && (
                      <video controls className="w-48 rounded-md border border-black/10">
                        <source src={`http://localhost:3000${msg.mediaUrl}`} type="video/mp4" />
                      </video>
                    )}
                    {msg.messageType === 'AUDIO' && (
                      <audio controls className="w-48">
                        <source src={`http://localhost:3000${msg.mediaUrl}`} type="audio/ogg" />
                      </audio>
                    )}
                    {msg.messageType === 'DOCUMENT' && (
                      <a href={`http://localhost:3000${msg.mediaUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sky-600 hover:underline font-bold bg-sky-50 p-2 rounded-lg text-xs">
                        📄 View Document
                      </a>
                    )}
                  </div>
                )}

                {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                
                <span className="text-[9px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  
                  {msg.sender !== 'PATIENT' && (
                    <span className="ml-1 inline-flex items-center">
                      {(msg.status === 'SENT' || !msg.status) && <Check size={12} className="text-slate-400" />}
                      {msg.status === 'DELIVERED' && <CheckCheck size={12} className="text-slate-400" />}
                      {msg.status === 'READ' && <CheckCheck size={12} className="text-primary-500" />}
                    </span>
                  )}
                </span>
                
              </div>
            </div>
          ))
        )}
      </div>

      {selectedFile && (
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]">
            📎 {selectedFile.name}
          </span>
          <button 
            type="button"
            onClick={() => { setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
            className="text-rose-500 hover:bg-rose-100 p-1 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="p-3 bg-slate-50 flex gap-2 shrink-0 border-t border-slate-200 items-center">
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*,video/*,application/pdf"
        />
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
          disabled={isSending || !leadPhone}
        >
          <Paperclip size={20} />
        </button>

        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder={selectedFile ? "Add a caption..." : `Message ${leadPhone || 'Patient'}...`}
          className="flex-1 px-4 py-2 rounded-xl text-sm outline-none border border-slate-200 focus:border-emerald-500 transition-colors"
          disabled={isSending || !leadPhone}
        />
        <button 
          type="submit" 
          disabled={(!message.trim() && !selectedFile) || isSending || !leadPhone}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0"
        >
          <Send size={16} className="ml-0.5" />
        </button>
      </form>
    </div>
  );
}