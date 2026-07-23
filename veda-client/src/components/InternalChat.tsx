"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { MessageSquare, X, Send, Minus, Users, ChevronDown } from "lucide-react";
import axios from "@/utils/axiosConfig";

export default function InternalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("GLOBAL"); 
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const [staffList, setStaffList] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState({ id: "", name: "", role: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const isOpenRef = useRef(isOpen);
  const isMinimizedRef = useRef(isMinimized);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { isMinimizedRef.current = isMinimized; }, [isMinimized]);

  useEffect(() => {
    let realId = localStorage.getItem("_id") || localStorage.getItem("id") || localStorage.getItem("userId") || "";
    let name = localStorage.getItem("name") || "Staff";
    let role = localStorage.getItem("role") || "STAFF";

    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        realId = realId || parsedUser._id || parsedUser.id;
        name = parsedUser.name || name;
        role = parsedUser.role || role;
      }
    } catch (err) {}

    // JWT Fallback
    if (!realId || name === "Staff") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          realId = realId || payload.sub || payload._id || payload.id;
          name = payload.name || name;
          role = payload.role || role;
        } catch (error) {}
      }
    }

    if (!realId) realId = `fallback_${Date.now()}`;
    setCurrentUser({ id: realId, name, role });

    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/users", { headers: { Authorization: `Bearer ${token}` } });
        setStaffList(res.data);
      } catch (error) { console.error("Failed to load staff", error); }
    };
    fetchStaff();

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000");
    setSocket(newSocket);

    const registerWithServer = () => {
      if (realId) newSocket.emit("register", { userId: realId, role });
    };

    if (newSocket.connected) registerWithServer();
    newSocket.on("connect", registerWithServer);

    newSocket.on("chatHistory", (history) => setChatHistory(history));

    newSocket.on("newMessage", (msg) => {
      setChatHistory((prev) => {
        if (prev.find(m => m._id === msg._id)) return prev; 
        return [...prev, msg];
      });

      if (msg.senderId !== realId) {
        if (!isOpenRef.current || isMinimizedRef.current) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    });

    return () => { newSocket.disconnect(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isOpen, isMinimized, activeTab]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket || !currentUser.id) return;

    socket.emit("sendMessage", {
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: message,
      channelId: activeTab 
    });

    setMessage(""); 
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const displayMessages = chatHistory.filter(msg => {
    const isPublicChannel = ['GLOBAL', 'DOCTOR', 'RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN', 'TELECALLER', 'PHARMACIST', 'THERAPIST'].includes(activeTab);
    
    if (isPublicChannel) {
      return msg.channelId === activeTab;
    } else {
      const iSentIt = msg.senderId === currentUser.id && msg.channelId === activeTab;
      const theySentIt = msg.senderId === activeTab && msg.channelId === currentUser.id;
      return iSentIt || theySentIt;
    }
  });

  if (!isOpen) {
    return (
      <button 
        onClick={handleOpenChat} 
        // 🚀 FIXED: Removed 'relative' so 'fixed' can actually do its job!
        className="fixed bottom-6 right-6 h-14 w-14 bg-sky-600 text-white rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center z-[9999] hover:bg-sky-700 border-4 border-white group"
      >
        <MessageSquare size={24} className="group-hover:animate-pulse" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed right-6 bottom-6 w-80 md:w-[380px] bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden z-[9999] border border-slate-200 transition-all duration-300 ease-in-out ${isMinimized ? 'h-16 translate-y-0' : 'h-[550px]'}`}>
      
      {/* Header */}
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0 cursor-pointer select-none hover:bg-slate-800 transition-colors" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-sky-500 rounded-full flex items-center justify-center border-2 border-slate-700 relative shadow-inner">
            <MessageSquare size={16} />
            {isMinimized && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full border-2 border-slate-900 shadow-sm animate-pulse"></span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight tracking-wide">Staff Comms Hub</h3>
            <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1 opacity-90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Secure
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="text-slate-400 hover:text-white hover:bg-slate-700 p-1 rounded-md transition-all">
            <Minus size={18}/>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-slate-400 hover:text-rose-400 hover:bg-slate-700 p-1 rounded-md transition-all">
            <X size={18}/>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Channel Dropdown */}
          <div className="bg-slate-50/80 p-3 shrink-0 border-b border-slate-200 relative backdrop-blur-sm z-10">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Users size={14} className="text-slate-400" />
            </div>
            <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value)} 
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-8 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 appearance-none cursor-pointer shadow-sm transition-all"
            >
              <optgroup label="Public Channels">
                <option value="GLOBAL">📢 Global All Staff</option>
                <option value="DOCTOR">🩺 Doctors Only</option>
                <option value="RECEPTIONIST">🖥️ Front Desk</option>
              </optgroup>
              {staffList.length > 0 && (
                <optgroup label="Direct Messages">
                  {staffList.map((staff) => {
                    if (staff._id === currentUser.id) return null;
                    return (
                      <option key={staff._id} value={staff._id}>
                        👤 {staff.name} ({staff.role.replace('_', ' ')})
                      </option>
                    );
                  })}
                </optgroup>
              )}
            </select>
            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>

          {/* Message List */}
          {/* 🚀 ADDED MODERN SCROLLBAR STYLING & OVERFLOW HANDLING */}
          <div className="flex-1 p-4 bg-[#f8fafc] overflow-y-auto space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full">
            {displayMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-60">
                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <MessageSquare size={24} className="text-slate-300" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-center px-4">
                  No Messages Yet
                </p>
              </div>
            ) : (
              displayMessages.map((msg, idx) => {
                // Better matching to ensure your own bubbles always stick to the right
                const isMe = msg.senderId === currentUser.id || msg.senderName === currentUser.name;
                
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`flex items-baseline gap-2 mb-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[10px] font-bold text-slate-500">{isMe ? 'You' : msg.senderName}</span>
                      <span className="text-[8px] font-black text-sky-400 bg-sky-50/80 px-1.5 py-0.5 rounded uppercase tracking-wider">{msg.senderRole.replace('_', ' ')}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    {/* 🚀 ADDED break-words and whitespace-pre-wrap to fix layout breaking */}
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm break-words whitespace-pre-wrap leading-relaxed ${isMe ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0 z-10">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-400"
            />
            <button 
              type="submit" 
              disabled={!message.trim()} 
              className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white h-11 w-11 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-sm"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}