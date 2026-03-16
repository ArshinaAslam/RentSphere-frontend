'use client';

import { Phone, Video, PhoneIncoming, PhoneMissed, PhoneOutgoing } from 'lucide-react';

import type { Conversation, Message } from '@/features/chat/types';

interface Props {
  callMessages:   Message[];
  conversations:  Conversation[];
  currentRole:    'landlord' | 'tenant';
  onlineUsers:    Set<string>;
  onCallAudio:    (targetId: string, convId: string, name: string) => void;
  onCallVideo:    (targetId: string, convId: string, name: string) => void;
  formatLastSeen: (date: string) => string;
}

interface CallRecord {
  convId:     string;
  targetId:   string;
  name:       string;
  initials:   string;
  callType:   'Voice call' | 'Video call';
  status:     'answered' | 'rejected' | 'no answer';
  duration:   string | null;
  time:       string;
  isOutgoing: boolean;
  isOnline:   boolean;
}

export default function CallHistoryList({
  callMessages,
  conversations,
  currentRole,
  onlineUsers,
  onCallAudio,
  onCallVideo,
  formatLastSeen,
}: Props) {

 



  const callRecords: CallRecord[] = callMessages.map((msg) => {
   const convId = typeof msg.conversationId === 'object' && msg.conversationId !== null
  ? String((msg.conversationId as { _id: string })._id)
  : String(msg.conversationId);

const conv = conversations.find(c => String(c._id) === convId);
    const other = conv
      ? (currentRole === 'landlord' ? conv.tenantId : conv.landlordId)
      : null;

    const callType  = msg.content.startsWith('Video call') ? 'Video call' : 'Voice call';
    const parts     = msg.content.split(' • ');
    const statusStr = parts[1] ?? '';

    let status: CallRecord['status'] = 'answered';
    let duration: string | null = null;

    if (statusStr === 'Rejected')       status = 'rejected';
    else if (statusStr === 'No answer') status = 'no answer';
    else { status = 'answered'; duration = statusStr; }

    return {
      convId:     msg.conversationId,
      targetId:   other ? String(other._id) : '',
      name:       other ? `${other.firstName} ${other.lastName}` : 'Unknown',
      initials:   other ? `${other.firstName[0]}${other.lastName[0]}`.toUpperCase() : '?',
      isOnline:   other ? onlineUsers.has(String(other._id)) : false,
      callType:   callType ,
      status,
      duration,
      time:       msg.createdAt,
      isOutgoing: msg.senderRole === currentRole,
    };
  });

  if (callRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center py-16">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <Phone className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-slate-500 text-sm font-medium">No call history</p>
        <p className="text-slate-400 text-xs mt-1">Your calls will appear here</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-50">
      {callRecords.map((record, idx) => (
        <div key={idx} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition">

       
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center">
              {record.initials}
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              record.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
            }`} />
          </div>

     
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{record.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {record.status === 'rejected' || record.status === 'no answer' ? (
                <PhoneMissed className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              ) : record.isOutgoing ? (
                <PhoneOutgoing className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              ) : (
                <PhoneIncoming className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              )}
              <span className={`text-xs ${
                record.status === 'rejected' || record.status === 'no answer'
                  ? 'text-red-500'
                  : 'text-slate-500'
              }`}>
                {record.callType}
                {record.duration    && ` • ${record.duration}`}
                {record.status === 'rejected'   && ' • Rejected'}
                {record.status === 'no answer'  && ' • No answer'}
              </span>
            </div>
          </div>

          
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="text-[11px] text-slate-400">{formatLastSeen(record.time)}</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => onCallAudio(record.targetId, record.convId, record.name)}
                className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center justify-center transition"
                title="Audio call"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
              </button>
              <button
                onClick={() => onCallVideo(record.targetId, record.convId, record.name)}
                className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center justify-center transition"
                title="Video call"
              >
                <Video className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}