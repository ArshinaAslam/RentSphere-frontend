import { useRef, useState, useCallback } from "react";

import { getSocket } from "@/lib/socket";

export type CallType = "audio" | "video";
export type CallStatus = "idle" | "calling" | "incoming" | "connected";

interface IncomingCallData {
  from: string;
  fromName: string;
  offer: RTCSessionDescriptionInit;
  conversationId: string;
  callType: CallType;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export function useCall(currentUserId: string) {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [callType, setCallType] = useState<CallType>("audio");
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(
    null,
  );
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const callStartTimeRef = useRef<number | null>(null);
  const callTypeRef = useRef<CallType>("audio");
  const conversationIdRef = useRef<string>("");
  const senderRoleRef = useRef<"tenant" | "landlord">("tenant");

  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current = null;
    pendingCandidatesRef.current = [];
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setCallStatus("idle");
    setIncomingCall(null);
    setRemoteUserId(null);
    setIsMicMuted(false);
    setIsCameraOff(false);
    callStartTimeRef.current = null;
  }, []);

  const createPeerConnection = useCallback(
    (targetUserId: string, type: CallType) => {
      const pc = new RTCPeerConnection(ICE_SERVERS);

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          getSocket().emit("call:ice-candidate", {
            to: targetUserId,
            candidate: e.candidate.toJSON(),
          });
        }
      };

      pc.ontrack = (e) => {
        const stream = e.streams[0];
        if (!stream) return;
        if (type === "video") {
          if (
            remoteVideoRef.current &&
            remoteVideoRef.current.srcObject !== stream
          ) {
            remoteVideoRef.current.srcObject = stream;
          }
        } else {
          if (
            remoteAudioRef.current &&
            remoteAudioRef.current.srcObject !== stream
          ) {
            remoteAudioRef.current.srcObject = stream;
          }
        }
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          cleanup();
        }
      };

      pcRef.current = pc;
      return pc;
    },
    [cleanup],
  );

  const startCall = useCallback(
    async (
      targetUserId: string,
      conversationId: string,
      callerName: string,
      type: CallType = "audio",
      senderRole: "tenant" | "landlord" = "tenant",
    ) => {
      setCallStatus("calling");
      setCallType(type);
      setRemoteUserId(targetUserId);
      callTypeRef.current = type;
      conversationIdRef.current = conversationId;
      senderRoleRef.current = senderRole;

      try {
        const constraints =
          type === "video" ? { audio: true, video: true } : { audio: true };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;

        stream.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
        stream.getVideoTracks().forEach((track) => {
          track.enabled = true;
        });
        setIsMicMuted(false);
        setIsCameraOff(false);

        if (type === "video" && localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const pc = createPeerConnection(targetUserId, type);
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        getSocket().emit("call:offer", {
          to: targetUserId,
          offer,
          conversationId,
          fromName: callerName,
          callType: type,
          callerRole: senderRole,
        });
      } catch (err) {
        console.error("Media error:", err);
        setCallStatus("idle");
        alert(
          type === "video"
            ? "Camera or microphone access denied."
            : "Microphone access denied.",
        );
      }
    },
    [createPeerConnection],
  );

  const acceptCall = useCallback(
    async (acceptorRole: "tenant" | "landlord" = "tenant") => {
      if (!incomingCall) return;
      setCallStatus("connected");
      setCallType(incomingCall.callType);
      setRemoteUserId(incomingCall.from);
      conversationIdRef.current = incomingCall.conversationId;
      senderRoleRef.current = acceptorRole === "tenant" ? "landlord" : "tenant";
      callTypeRef.current = incomingCall.callType;
      try {
        const constraints =
          incomingCall.callType === "video"
            ? { audio: true, video: true }
            : { audio: true };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;

        stream.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
        stream.getVideoTracks().forEach((track) => {
          track.enabled = true;
        });
        setIsMicMuted(false);
        setIsCameraOff(false);

        if (incomingCall.callType === "video" && localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const pc = createPeerConnection(
          incomingCall.from,
          incomingCall.callType,
        );
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        await pc.setRemoteDescription(
          new RTCSessionDescription(incomingCall.offer),
        );

        for (const candidate of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidatesRef.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        getSocket().emit("call:answer", { to: incomingCall.from, answer });
        callStartTimeRef.current = Date.now();
        setIncomingCall(null);
      } catch (err) {
        console.error("Media error on accept:", err);
        setCallStatus("idle");
        setIncomingCall(null);
        alert("Camera or microphone access denied.");
        getSocket().emit("call:reject", { to: incomingCall.from });
      }
    },
    [incomingCall, createPeerConnection],
  );

  const rejectCall = useCallback(() => {
    if (!incomingCall) return;
    getSocket().emit("call:reject", {
      to: incomingCall.from,
      conversationId: conversationIdRef.current,
      callType: incomingCall.callType,
      senderRole: senderRoleRef.current,
    });
    setIncomingCall(null);
    setCallStatus("idle");
  }, [incomingCall]);

  const endCall = useCallback(() => {
    const duration = callStartTimeRef.current
      ? Math.floor((Date.now() - callStartTimeRef.current) / 1000)
      : 0;

    if (remoteUserId) {
      getSocket().emit("call:end", {
        to: remoteUserId,
        duration,
        callType: callTypeRef.current,
        conversationId: conversationIdRef.current || undefined,
        senderRole: senderRoleRef.current,
      });
    }
    callStartTimeRef.current = null;
    cleanup();
  }, [remoteUserId, cleanup]);

  const setupCallListeners = useCallback(() => {
    const socket = getSocket();

    socket.on("call:incoming", (data: IncomingCallData) => {
      const incomingData = {
        ...data,
        callType: data.callType ?? "audio",
      };

      setIncomingCall(incomingData);
      setCallType(data.callType);
      setCallStatus("incoming");

      conversationIdRef.current = data.conversationId;
      callTypeRef.current = data.callType ?? "audio";
      senderRoleRef.current =
        (data as IncomingCallData & { callerRole?: "tenant" | "landlord" })
          .callerRole ?? "landlord";
    });

    socket.on(
      "call:answered",
      (data: { answer: RTCSessionDescriptionInit }) => {
        void (async () => {
          await pcRef.current?.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
          setCallStatus("connected");
          callStartTimeRef.current = Date.now();

          for (const candidate of pendingCandidatesRef.current) {
            await pcRef.current?.addIceCandidate(
              new RTCIceCandidate(candidate),
            );
          }
          pendingCandidatesRef.current = [];
        })();
      },
    );

    socket.on(
      "call:ice-candidate",
      (data: { candidate: RTCIceCandidateInit }) => {
        if (pcRef.current?.remoteDescription) {
          void pcRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate),
          );
        } else {
          pendingCandidatesRef.current.push(data.candidate);
        }
      },
    );

    socket.on("call:ended", () => cleanup());
    socket.on("call:rejected", () => {
      cleanup();
    });

    return () => {
      socket.off("call:incoming");
      socket.off("call:answered");
      socket.off("call:ice-candidate");
      socket.off("call:ended");
      socket.off("call:rejected");
    };
  }, [cleanup]);

  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMicMuted((prev) => !prev);
  }, []);

  const toggleCamera = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsCameraOff((prev) => !prev);
  }, []);

  return {
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
  };
}
