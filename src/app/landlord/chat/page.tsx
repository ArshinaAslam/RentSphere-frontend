'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Send, MessageSquare, Building2, ArrowLeft } from 'lucide-react';
import { Phone, Video } from 'lucide-react';
import LandlordNavbar  from '@/components/layout/LandlordNavbar';

import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/features/chat/mockData';
import type { Conversation, Message } from '@/features/chat/types';
import { useAppSelector } from '@/store/hooks';

export default function ChatPage() {
  const { userData } = useAppSelector(s => s.auth);
  const [search,          setSearch]          = useState('');
  const [activeConvId,    setActiveConvId]    = useState<string | null>(null);
  const [messages,        setMessages]        = useState<Message[]>([]);
  const [input,           setInput]           = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversations = MOCK_CONVERSATIONS.filter(c =>
    `${c.tenantId.firstName} ${c.tenantId.lastName} ${c.propertyId.title}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const activeConv = conversations.find(c => c._id === activeConvId) ?? null;

  // Load messages when conversation selected
  useEffect(() => {
    if (!activeConvId) return;
    setMessages(MOCK_MESSAGES.filter(m => m.conversationId === activeConvId));
  }, [activeConvId]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeConvId) return;
    const newMsg: Message = {
      _id:            `m${Date.now()}`,
      conversationId: activeConvId,
      senderId:       userData?.id ?? 'l1',
      senderRole:     'landlord',
      content:        input.trim(),
      isRead:         false,
      createdAt:      new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

//   const formatLastSeen = (dateStr: string) => {
//     const diff = Date.now() - new Date(dateStr).getTime();
//     if (diff < 60000)    return 'just now';
//     if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`;
//     if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
//     return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
//   };

const formatLastSeen = (dateStr: string) => {
  const date = new Date(dateStr);
  const now  = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('en-IN', {
      hour:   '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  return date.toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
  }).replace(/\//g, '/');
};

  const getInitials = (conv: Conversation) =>
    `${conv.tenantId.firstName[0]}${conv.tenantId.lastName[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />


      <main className="pt-16 h-screen">
        <div className="h-[calc(100vh-64px)] flex">

          {/* ── LEFT PANEL — Conversation List ── */}
          <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">

            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm">No conversations</p>
                </div>
              ) : (
                conversations.map(conv => {
                  const isActive = conv._id === activeConvId;
                  return (
                    <button
                      key={conv._id}
                      onClick={() => setActiveConvId(conv._id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-slate-50 transition text-left ${
                        isActive ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-11 h-11 rounded-full font-bold text-sm flex items-center justify-center ${
                          isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {conv.tenantId.avatar
                            ? <img src={conv.tenantId.avatar} className="w-full h-full rounded-full object-cover" />
                            : getInitials(conv)
                          }
                        </div>
                        {/* Online dot */}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                      </div>

                     {/* Info */}
<div className="flex-1 min-w-0">
  {/* Name + Time on same line */}
  <div className="flex items-center justify-between mb-0.5">
    <p className={`text-sm font-semibold truncate ${isActive ? 'text-emerald-700' : 'text-slate-900'}`}>
      {conv.tenantId.firstName} {conv.tenantId.lastName}
    </p>
    <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">
      {formatLastSeen(conv.lastMessageAt)}
    </span>
  </div>

  {/* Last message + unread badge on same line */}
  <div className="flex items-center justify-between gap-2">
    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>
      {conv.lastMessage}
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
            </div>
          </div>

          {/* ── RIGHT PANEL — Chat Window ── */}
          <div className="flex-1 flex flex-col bg-[#f0f2f5]">

            {/* No conversation selected */}
            {!activeConv && (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <MessageSquare className="w-9 h-9 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">Your Messages</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Select a conversation from the left to start chatting
                </p>
              </div>
            )}

            {/* Active conversation */}
            {activeConv && (
              <>
                {/* Chat Header */}
<div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-3 flex-shrink-0 shadow-sm">
  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
    {activeConv.tenantId.avatar
      ? <img src={activeConv.tenantId.avatar} className="w-full h-full rounded-full object-cover" />
      : getInitials(activeConv)
    }
  </div>

  {/* Name + Online below */}
  <div className="flex-1">
    <p className="font-bold text-slate-900 text-sm">
      {activeConv.tenantId.firstName} {activeConv.tenantId.lastName}
    </p>
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      <span className="text-xs text-emerald-600 font-medium">Online</span>
    </div>
  </div>

  {/* Audio Call */}
  <button
    title="Audio Call"
    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 text-slate-500 flex items-center justify-center transition-all"
  >
    <Phone size={17} strokeWidth={2} />
  </button>

  {/* Video Call */}
  <button
    title="Video Call"
    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 text-slate-500 flex items-center justify-center transition-all"
  >
    <Video size={17} strokeWidth={2} />
  </button>
</div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">

                  {/* Date label */}
                  <div className="flex justify-center mb-4">
                    <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">
                      {new Date(messages[0]?.createdAt ?? new Date()).toLocaleDateString('en-IN', {
                        weekday: 'long', day: '2-digit', month: 'long',
                      })}
                    </span>
                  </div>

                  {messages.map(msg => {
                    const isMe = msg.senderRole === 'landlord';
                    return (
                      <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex flex-col gap-0.5 max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-br-none'
                              : 'bg-white text-slate-800 rounded-bl-none'
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-slate-400 px-1">
                            {formatTime(msg.createdAt)}
                            {isMe && <span className="ml-1 text-emerald-500">✓✓</span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={bottomRef} />
                </div>

                {/* Input */}
               
<div className="px-4 py-3 flex-shrink-0">
  <div className="bg-white flex items-center gap-3 px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
    <textarea
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type a message..."
      rows={1}
      className="flex-1 resize-none text-sm text-slate-800 outline-none placeholder:text-slate-400 max-h-28 py-1"
    />
    <button
      onClick={handleSend}
      disabled={!input.trim()}
      className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 rounded-xl flex items-center justify-center transition flex-shrink-0"
    >
      <Send className="w-4 h-4 text-white" />
    </button>
  </div>
</div>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}