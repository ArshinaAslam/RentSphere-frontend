"use client";

import { useState, useRef, useEffect, useCallback } from "react";

import EmojiPicker from "emoji-picker-react";
import {
  Search,
  Send,
  MessageSquare,
  Phone,
  Video,
  Loader2,
  PhoneOff,
  PhoneIncoming,
  PhoneMissed,
  VideoOff,
  MicOff,
  Mic,
  Paperclip,
  Smile,
  X,
} from "lucide-react";

import CallHistoryList from "@/components/chat/CallHistoryList";
import VoiceMessage from "@/components/chat/VoiceMessage";
import LandlordNavbar from "@/components/layout/LandlordNavbar";
import {
  setActiveConversation,
  appendMessage,
  clearUnread,
  resetActiveConversation,
  markMessagesAsRead,
} from "@/features/chat/chatSlice";
import {
  markAsReadThunk,
  fetchLandlordConversations,
  fetchMessages,
  uploadVoiceMessageThunk,
  fetchCallHistory,
  uploadAttachmentThunk,
} from "@/features/chat/chatThunk";
import type { Conversation, Message } from "@/features/chat/types";
import { useCall } from "@/hooks/useCall";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((s) => s.auth);
  const {
    conversations,
    messages,
    isLoadingConvos,
    isLoadingMessages,
    activeConversation,
  } = useAppSelector((s) => s.chat);

  const {
    callStatus,
    callType,
    incomingCall,
    isMicMuted,
    isCameraOff,
    remoteAudioRef,
    localVideoRef,
    remoteVideoRef,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMic,
    toggleCamera,
    setupCallListeners,
  } = useCall(userData?.id ?? "");

  const {
    recordingState,
    duration,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecorder,
    formatDuration,
  } = useVoiceRecorder();

  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    previewUrl: string;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConversationRef = useRef(activeConversation);

  const [activeTab, setActiveTab] = useState<"messages" | "calls">("messages");

  const [callHistory, setCallHistory] = useState<Message[]>([]);
  const [isLoadingCalls, setIsLoadingCalls] = useState(false);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    if (!userData?.id) return;

    connectSocket(userData.id);
    const socket = getSocket();

    socket.on("message:receive", (message: Message) => {
      dispatch(appendMessage(message));
      if (
        message.conversationId === activeConversationRef.current?._id &&
        userData?.id
      ) {
        void dispatch(
          markAsReadThunk({
            conversationId: message.conversationId,
            userId: userData.id,
          }),
        ).then(() => {
          getSocket().emit("messages:read", {
            conversationId: message.conversationId,
            userId: userData.id,
          });
          void dispatch(fetchLandlordConversations(userData.id));
        });
      } else {
        void dispatch(fetchLandlordConversations(userData.id));
      }
    });

    socket.on("typing:start", () => setIsTyping(true));
    socket.on("typing:stop", () => setIsTyping(false));

    socket.on(
      "user:status",
      ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          if (isOnline) {
            next.add(userId);
          } else {
            next.delete(userId);
          }
          return next;
        });
      },
    );

    socket.on(
      "messages:read",
      ({ conversationId }: { conversationId: string }) => {
        if (conversationId === activeConversationRef.current?._id) {
          dispatch(markMessagesAsRead(conversationId));
        }
      },
    );

    socket.on("conversation:updated", () => {
      if (userData?.id) void dispatch(fetchLandlordConversations(userData.id));
    });
    const cleanupCall = setupCallListeners();
    return () => {
      socket.off("message:receive");
      socket.off("typing:start");
      socket.off("typing:stop");
      socket.off("user:status");
      socket.off("conversation:updated");
      socket.off("messages:read");
      cleanupCall();
      disconnectSocket();
    };
  }, [userData?.id, dispatch]);

  useEffect(() => {
    if (!userData?.id) return;
    dispatch(resetActiveConversation());
    void dispatch(fetchLandlordConversations(userData.id));
  }, [userData?.id, dispatch]);

  useEffect(() => {
    if (!activeConversation?._id) return;
    const socket = getSocket();
    socket.emit("conversation:join", activeConversation._id);
    void dispatch(fetchMessages({ conversationId: activeConversation._id }));

    return () => {
      socket.emit("conversation:leave", activeConversation._id);
    };
  }, [activeConversation?._id, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (activeTab === "calls" && userData?.id) {
      setIsLoadingCalls(true);
      void dispatch(fetchCallHistory())
        .then((result) => {
          if (fetchCallHistory.fulfilled.match(result)) {
            setCallHistory(result.payload);
          }
        })
        .finally(() => setIsLoadingCalls(false));
    }
  }, [activeTab, userData?.id, dispatch]);

  const handleSelectConv = (conv: Conversation) => {
    dispatch(setActiveConversation(conv));
    dispatch(clearUnread(conv._id));
    if (userData?.id) {
      void dispatch(
        markAsReadThunk({
          conversationId: conv._id,
          userId: userData.id,
        }),
      ).then(() => {
        getSocket().emit("messages:read", {
          conversationId: conv._id,
          userId: userData.id,
        });
        void dispatch(fetchLandlordConversations(userData.id));
      });
    }
  };

  const handleSend = useCallback(() => {
    if (!input.trim() || !activeConversation || !userData?.id) return;
    const socket = getSocket();

    setIsSending(true);
    socket.emit("message:send", {
      conversationId: activeConversation._id,
      senderId: userData.id,
      senderRole: "landlord",
      content: input.trim(),
      recipientId: activeConversation.tenantId._id,
    });

    socket.emit("typing:stop", {
      conversationId: activeConversation._id,
      userId: userData.id,
    });

    setInput("");
    setIsSending(false);
  }, [input, activeConversation, userData?.id]);

  const handleSendVoice = useCallback(async () => {
    if (!audioBlob || !activeConversation || !userData?.id) return;
    setIsSending(true);

    try {
      const result = await dispatch(uploadVoiceMessageThunk(audioBlob));

      if (uploadVoiceMessageThunk.fulfilled.match(result)) {
        const url = result.payload;
        const socket = getSocket();
        socket.emit("message:send", {
          conversationId: activeConversation._id,
          senderId: userData.id,
          senderRole: "landlord",
          content: `voice:${url}`,
          recipientId: activeConversation.tenantId._id,
        });
        resetRecorder();
      }
    } catch (err) {
      console.error("Voice send error:", err);
    } finally {
      setIsSending(false);
    }
  }, [audioBlob, activeConversation, userData?.id, dispatch, resetRecorder]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(".emoji-picker-container") ||
        target.closest(".emoji-btn")
      )
        return;
      setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile({ file, previewUrl, name: file.name });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [],
  );

  const handleSendAttachment = useCallback(async () => {
    if (!selectedFile || !activeConversation || !userData?.id) return;
    setIsUploading(true);
    try {
      const result = await dispatch(uploadAttachmentThunk(selectedFile.file));
      if (uploadAttachmentThunk.fulfilled.match(result)) {
        const { url, originalName } = result.payload;
        const socket = getSocket();
        socket.emit("message:send", {
          conversationId: activeConversation._id,
          senderId: userData.id,
          senderRole: "landlord",
          content: `attachment:${url}|${originalName}`,
          recipientId: activeConversation.tenantId._id,
        });
        setSelectedFile(null);
      }
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, activeConversation, userData?.id, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (!activeConversation || !userData?.id) return;

    const socket = getSocket();
    socket.emit("typing:start", {
      conversationId: activeConversation._id,
      userId: userData.id,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", {
        conversationId: activeConversation._id,
        userId: userData.id,
      });
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatLastSeen = (dateStr: string) => {
    const date = new Date(dateStr);
    const isToday = date.toDateString() === new Date().toDateString();
    if (isToday)
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getInitials = (conv: Conversation) =>
    `${conv.tenantId.firstName[0]}${conv.tenantId.lastName[0]}`.toUpperCase();

  const isTenantOnline = activeConversation
    ? onlineUsers.has(String(activeConversation.tenantId._id))
    : false;

  const filteredConvos = conversations.filter((c: Conversation) =>
    `${c.tenantId.firstName} ${c.tenantId.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const formatLastMessage = (msg: string) => {
    if (msg.startsWith("attachment:")) {
      const parts = msg.split("|");
      const filename = parts[1] ?? "";
      const isImg = /\.(jpg|jpeg|png|gif|webp)/i.test(filename);
      return isImg ? "📷 Photo" : `📎 ${filename || "Attachment"}`;
    }
    if (msg.startsWith("voice:")) return "🎤 Voice message";
    if (msg.startsWith("Video call")) return "📹 Video call";
    if (msg.startsWith("Voice call")) return "📞 Voice call";
    return msg;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />

      <main className="pt-16 h-screen">
        <div className="h-[calc(100vh-64px)] flex">
          {/* ── LEFT PANEL ── */}
          <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
            <div className="px-5 pt-4 pb-0 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                {activeTab === "messages" ? "Messages" : "Calls"}
              </h2>

              <div className="flex gap-0">
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`flex-1 pb-2.5 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === "messages"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 inline mr-1.5 mb-0.5" />
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab("calls")}
                  className={`flex-1 pb-2.5 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === "calls"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Phone className="w-4 h-4 inline mr-1.5 mb-0.5" />
                  Calls
                </button>
              </div>
            </div>

            {/* Search */}
            {activeTab === "messages" && (
              <div className="px-5 py-3 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {activeTab === "messages" ? (
                <>
                  {isLoadingConvos ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                  ) : filteredConvos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                      <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-slate-400 text-sm">No conversations</p>
                    </div>
                  ) : (
                    filteredConvos.map((conv: Conversation) => {
                      const isActive = conv._id === activeConversation?._id;
                      const tenantOnline = onlineUsers.has(
                        String(conv.tenantId._id),
                      );
                      return (
                        <button
                          key={conv._id}
                          onClick={() => handleSelectConv(conv)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-slate-50 transition text-left ${
                            isActive
                              ? "bg-emerald-50 border-l-4 border-l-emerald-500"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="relative flex-shrink-0">
                            <div
                              className={`w-11 h-11 rounded-full font-bold text-sm flex items-center justify-center ${
                                isActive
                                  ? "bg-emerald-600 text-white"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {getInitials(conv)}
                            </div>
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                tenantOnline ? "bg-emerald-500" : "bg-slate-300"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p
                                className={`text-sm font-semibold truncate ${isActive ? "text-emerald-700" : "text-slate-900"}`}
                              >
                                {conv.tenantId.firstName}{" "}
                                {conv.tenantId.lastName}
                              </p>
                              <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">
                                {formatLastSeen(conv.lastMessageAt)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={`text-xs truncate ${conv.unreadCount > 0 ? "font-semibold text-slate-700" : "text-slate-400"}`}
                              >
                                {formatLastMessage(conv.lastMessage)}
                              </p>
                              {conv.unreadCount > 0 && (
                                <span className="w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </>
              ) : /* ── Calls tab ── */
              isLoadingCalls ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
              ) : (
                <CallHistoryList
                  callMessages={callHistory}
                  conversations={conversations}
                  currentRole="landlord"
                  onlineUsers={onlineUsers}
                  onCallAudio={(targetId, convId, name) =>
                    void startCall(targetId, convId, name, "audio", "landlord")
                  }
                  onCallVideo={(targetId, convId, name) =>
                    void startCall(targetId, convId, name, "video", "landlord")
                  }
                  formatLastSeen={formatLastSeen}
                />
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="flex-1 flex flex-col bg-[#f0f2f5]">
            {!activeConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <MessageSquare className="w-9 h-9 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">
                  Your Messages
                </h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Select a conversation from the left to start chatting
                </p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-3 flex-shrink-0 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {getInitials(activeConversation)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">
                      {activeConversation.tenantId.firstName}{" "}
                      {activeConversation.tenantId.lastName}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {isTyping ? (
                        <span className="text-xs text-emerald-600 font-medium italic">
                          typing...
                        </span>
                      ) : (
                        <>
                          <span
                            className={`w-2 h-2 rounded-full ${isTenantOnline ? "bg-emerald-500" : "bg-slate-300"}`}
                          />
                          <span
                            className={`text-xs font-medium ${isTenantOnline ? "text-emerald-600" : "text-slate-400"}`}
                          >
                            {isTenantOnline ? "Online" : "Offline"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!activeConversation || !userData?.id) return;

                      if (callStatus === "connected") {
                        endCall();
                      } else {
                        void startCall(
                          String(activeConversation.tenantId._id),
                          activeConversation._id,
                          `${userData.fullName} `,
                          "audio",
                          "landlord",
                        );
                      }
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      callStatus === "connected"
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 text-slate-500"
                    }`}
                  >
                    {callStatus === "connected" ? (
                      <PhoneOff size={17} strokeWidth={2} />
                    ) : (
                      <Phone size={17} strokeWidth={2} />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (!activeConversation) return;
                      if (callStatus === "connected" && callType === "video") {
                        endCall();
                        return;
                      }
                      void startCall(
                        String(activeConversation.tenantId._id),
                        activeConversation._id,
                        `${activeConversation.landlordId.firstName} ${activeConversation.landlordId.lastName}`,
                        "video",
                        "landlord",
                      );
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      callStatus === "connected" && callType === "video"
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 text-slate-500"
                    }`}
                  >
                    {callStatus === "connected" && callType === "video" ? (
                      <VideoOff size={17} strokeWidth={2} />
                    ) : (
                      <Video size={17} strokeWidth={2} />
                    )}
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center mb-4">
                        <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">
                          {messages[0]
                            ? new Date(
                                messages[0].createdAt,
                              ).toLocaleDateString("en-IN", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                              })
                            : "Today"}
                        </span>
                      </div>

                      {messages.map((msg: Message) => {
                        const isMe = msg.senderRole === "landlord";
                        const isCallMsg =
                          msg.content.startsWith("Voice call") ||
                          msg.content.startsWith("Video call");
                        const isVideoCall =
                          msg.content.startsWith("Video call");

                        const isVoiceMsg = msg.content.startsWith("voice:");
                        if (isVoiceMsg) {
                          const audioSrc = msg.content.replace("voice:", "");
                          return (
                            <div
                              key={msg._id}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <VoiceMessage
                                src={audioSrc}
                                isMe={isMe}
                                time={formatTime(msg.createdAt)}
                              />
                            </div>
                          );
                        }

                        const isAttachment =
                          msg.content.startsWith("attachment:");

                        if (isAttachment) {
                          const parts = msg.content
                            .replace("attachment:", "")
                            .split("|");
                          const url = parts[0] ?? "";
                          const filename = parts[1] ?? "Attachment";
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                            url,
                          );
                          return (
                            <div
                              key={msg._id}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`flex flex-col gap-0.5 max-w-[65%] ${isMe ? "items-end" : "items-start"}`}
                              >
                                <div
                                  className={`rounded-2xl overflow-hidden shadow-sm ${isMe ? "rounded-br-none" : "rounded-bl-none"}`}
                                >
                                  {isImage ? (
                                    <img
                                      src={url}
                                      alt={filename}
                                      className="max-w-xs max-h-60 object-cover cursor-pointer"
                                      onClick={() => window.open(url, "_blank")}
                                    />
                                  ) : (
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`flex items-center gap-3 px-4 py-3 ${isMe ? "bg-emerald-600 text-white" : "bg-white text-slate-700"}`}
                                    >
                                      <Paperclip className="w-4 h-4 flex-shrink-0" />
                                      <span className="text-sm font-medium truncate max-w-[180px]">
                                        {filename}
                                      </span>
                                    </a>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 px-1">
                                  {formatTime(msg.createdAt)}
                                </span>
                              </div>
                            </div>
                          );
                        }

                        if (isCallMsg) {
                          return (
                            <div
                              key={msg._id}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-sm ${
                                  isMe
                                    ? "bg-emerald-600 text-white"
                                    : "bg-white text-slate-700"
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isMe ? "bg-emerald-500" : "bg-emerald-100"
                                  }`}
                                >
                                  {isVideoCall ? (
                                    <Video
                                      className={`w-4 h-4 ${isMe ? "text-white" : "text-emerald-600"}`}
                                    />
                                  ) : (
                                    <Phone
                                      className={`w-4 h-4 ${isMe ? "text-white" : "text-emerald-600"}`}
                                    />
                                  )}
                                </div>
                                <div>
                                  <p
                                    className={`text-sm font-semibold ${isMe ? "text-white" : "text-slate-800"}`}
                                  >
                                    {msg.content.split(" • ")[0]}
                                  </p>
                                  <p
                                    className={`text-xs ${isMe ? "text-emerald-100" : "text-slate-400"}`}
                                  >
                                    {msg.content.split(" • ")[1]}
                                  </p>
                                </div>
                                <span
                                  className={`text-[10px] ml-1 ${isMe ? "text-emerald-100" : "text-slate-400"}`}
                                >
                                  {formatTime(msg.createdAt)}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={msg._id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`flex flex-col gap-0.5 max-w-[65%] ${isMe ? "items-end" : "items-start"}`}
                            >
                              <div
                                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                  isMe
                                    ? "bg-emerald-600 text-white rounded-br-none"
                                    : "bg-white text-slate-800 rounded-bl-none"
                                }`}
                              >
                                {msg.content}
                              </div>
                              <span className="text-[10px] text-slate-400 px-1">
                                {formatTime(msg.createdAt)}
                                {isMe && (
                                  <span
                                    className={`ml-1 ${msg.isRead ? "text-emerald-500" : "text-slate-400"}`}
                                  >
                                    ✓✓
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={bottomRef} />
                    </>
                  )}
                </div>

                <div className="px-4 py-3 flex-shrink-0 relative">
                  <div className="bg-white flex items-center gap-3 px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
                    {recordingState === "idle" && (
                      <>
                        {selectedFile && (
                          <div className="absolute bottom-full left-0 right-0 mb-1 mx-0">
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                              {/\.(jpg|jpeg|png|gif|webp)$/i.test(
                                selectedFile.name,
                              ) ? (
                                <img
                                  src={selectedFile.previewUrl}
                                  alt={selectedFile.name}
                                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-100"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                  <Paperclip className="w-6 h-6 text-blue-500" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                  {selectedFile.name}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {(selectedFile.file.size / 1024).toFixed(1)}{" "}
                                  KB
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedFile(null);
                                  URL.revokeObjectURL(selectedFile.previewUrl);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => void handleSendAttachment()}
                                disabled={isUploading}
                                className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 rounded-xl flex items-center justify-center transition flex-shrink-0"
                              >
                                {isUploading ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                                ) : (
                                  <Send className="w-4 h-4 text-white" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Emoji picker */}
                        {showEmojiPicker && (
                          <div className="absolute bottom-full left-4 mb-2 z-50 emoji-picker-container">
                            <EmojiPicker
                              onEmojiClick={(emojiData) =>
                                setInput((prev) => prev + emojiData.emoji)
                              }
                              height={350}
                              width={350}
                            />
                          </div>
                        )}

                        {/* Emoji button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEmojiPicker((p) => !p);
                          }}
                          className="emoji-btn w-9 h-9 bg-slate-100 hover:bg-yellow-100 hover:text-yellow-500 text-slate-500 rounded-xl flex items-center justify-center transition flex-shrink-0"
                        >
                          <Smile className="w-4 h-4" />
                        </button>

                        <textarea
                          value={input}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Type a message..."
                          rows={1}
                          className="flex-1 resize-none text-sm text-slate-800 outline-none placeholder:text-slate-400 max-h-28 py-1"
                        />

                        {/* Attachment button */}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="w-9 h-9 bg-slate-100 hover:bg-blue-100 hover:text-blue-500 text-slate-500 rounded-xl flex items-center justify-center transition flex-shrink-0"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileSelect}
                        />

                        {!input.trim() ? (
                          <button
                            onClick={() => void startRecording()}
                            className="w-9 h-9 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 text-slate-500 rounded-xl flex items-center justify-center transition flex-shrink-0"
                          >
                            <Mic className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={handleSend}
                            disabled={isSending}
                            className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 rounded-xl flex items-center justify-center transition flex-shrink-0"
                          >
                            {isSending ? (
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : (
                              <Send className="w-4 h-4 text-white" />
                            )}
                          </button>
                        )}
                      </>
                    )}

                    {recordingState === "recording" && (
                      <div className="flex-1 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                        <span className="text-sm text-red-500 font-medium">
                          {formatDuration(duration)}
                        </span>
                        <span className="text-xs text-slate-400 flex-1">
                          Recording...
                        </span>
                        <button
                          onClick={cancelRecording}
                          className="text-xs text-slate-400 hover:text-slate-600 px-2"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={stopRecording}
                          className="w-9 h-9 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center transition flex-shrink-0"
                        >
                          <MicOff className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}

                    {recordingState === "preview" && audioUrl && (
                      <div className="flex-1 flex items-center gap-3">
                        <audio controls src={audioUrl} className="flex-1 h-8" />
                        <button
                          onClick={cancelRecording}
                          className="text-xs text-slate-400 hover:text-red-500 px-2"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => void handleSendVoice()}
                          disabled={isSending}
                          className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 rounded-xl flex items-center justify-center transition flex-shrink-0"
                        >
                          {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          ) : (
                            <Send className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <audio ref={remoteAudioRef} autoPlay />

      {callStatus === "calling" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl w-72">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
              {callType === "video" ? (
                <Video className="w-7 h-7 text-emerald-600" />
              ) : (
                <Phone className="w-7 h-7 text-emerald-600" />
              )}
            </div>
            <p className="font-bold text-slate-800 text-lg">
              {callType === "video" ? "Video Calling..." : "Calling..."}
            </p>
            <p className="text-slate-500 text-sm">
              {activeConversation?.tenantId.firstName}{" "}
              {activeConversation?.tenantId.lastName}
            </p>
            <button
              onClick={endCall}
              className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition"
            >
              {callType === "video" ? (
                <VideoOff className="w-6 h-6 text-white" />
              ) : (
                <PhoneOff className="w-6 h-6 text-white rotate-[135deg]" />
              )}
            </button>
          </div>
        </div>
      )}

      {callStatus === "incoming" && incomingCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl w-72">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
              {incomingCall.callType === "video" ? (
                <Video className="w-7 h-7 text-emerald-600" />
              ) : (
                <PhoneIncoming className="w-7 h-7 text-emerald-600" />
              )}
            </div>
            <p className="font-bold text-slate-800 text-lg">
              {incomingCall.callType === "video"
                ? "Incoming Video Call"
                : "Incoming Call"}
            </p>
            <p className="text-slate-700 text-sm font-semibold">
              {incomingCall.fromName}
            </p>
            <p className="text-slate-400 text-xs">is calling you...</p>
            <div className="flex gap-4">
              <button
                onClick={rejectCall}
                className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition"
              >
                {incomingCall.callType === "video" ? (
                  <VideoOff className="w-6 h-6 text-white" />
                ) : (
                  <PhoneMissed className="w-6 h-6 text-white" />
                )}
              </button>
              <button
                onClick={() => {
                  void acceptCall("landlord");
                }}
                className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center transition"
              >
                {incomingCall.callType === "video" ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <Phone className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed inset-0 bg-black z-50 ${
          callStatus === "connected" && callType === "video" ? "flex" : "hidden"
        } items-center justify-center`}
      >
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="absolute bottom-28 right-4 w-36 h-24 rounded-2xl object-cover border-2 border-white shadow-lg"
        />

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur px-6 py-3 rounded-full">
          <button
            onClick={toggleMic}
            title={isMicMuted ? "Unmute" : "Mute"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMicMuted
                ? "bg-slate-600 hover:bg-slate-500"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {isMicMuted ? (
              <MicOff className="w-5 h-5 text-slate-300" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>

          <button
            onClick={endCall}
            title="End call"
            className="w-16 h-16 bg-red-500 hover:bg-red-600 active:scale-95 rounded-full flex items-center justify-center transition-all shadow-xl"
          >
            <PhoneOff className="w-7 h-7 text-white rotate-[135deg]" />
          </button>

          <button
            onClick={toggleCamera}
            title={isCameraOff ? "Turn on camera" : "Turn off camera"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isCameraOff
                ? "bg-slate-600 hover:bg-slate-500"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {isCameraOff ? (
              <VideoOff className="w-5 h-5 text-slate-300" />
            ) : (
              <Video className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {callStatus === "connected" && callType === "audio" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur text-white px-8 py-4 rounded-full flex items-center gap-5 shadow-2xl z-50">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Call connected</span>

          <button
            onClick={toggleMic}
            title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isMicMuted
                ? "bg-slate-600 hover:bg-slate-500"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {isMicMuted ? (
              <MicOff className="w-5 h-5 text-slate-300" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>

          <button
            onClick={endCall}
            title="End call"
            className="w-14 h-14 bg-red-500 hover:bg-red-600 active:scale-95 rounded-full flex items-center justify-center transition-all shadow-lg"
          >
            <PhoneOff className="w-6 h-6 text-white rotate-[135deg]" />
          </button>
        </div>
      )}
    </div>
  );
}
