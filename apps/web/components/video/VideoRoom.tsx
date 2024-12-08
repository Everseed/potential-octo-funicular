'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp } from 'lucide-react'

interface VideoRoomProps {
  sessionId: string
  isMentor: boolean
  onEndCall: () => void
}

export default function VideoRoom({ sessionId, isMentor, onEndCall }: VideoRoomProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        // Obtenir la configuration ICE de l'API
        const response = await fetch('/api/video/config')
        const { iceServers } = await response.json()

        // Configurer la connexion WebRTC
        peerConnection.current = new RTCPeerConnection({ iceServers })

        // Obtenir le flux médial local
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setLocalStream(stream)

        // Afficher le flux local
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Ajouter les tracks au peer connection
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream)
        })

        // Gérer le flux distant
        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
            setRemoteStream(event.streams[0])
          }
        }

        // ... Plus de configuration WebRTC
      } catch (error) {
        console.error('Failed to initialize media:', error)
      }
    }

    initializeMedia()

    return () => {
      // Nettoyage
      localStream?.getTracks().forEach(track => track.stop())
      remoteStream?.getTracks().forEach(track => track.stop())
      peerConnection.current?.close()
    }
  }, [])

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      audioTrack.enabled = !audioTrack.enabled
      setIsAudioEnabled(audioTrack.enabled)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      videoTrack.enabled = !videoTrack.enabled
      setIsVideoEnabled(videoTrack.enabled)
    }
  }

  const toggleRecording = () => {
    if (!isRecording && remoteStream) {
      // Commencer l'enregistrement
      const combinedStream = new MediaStream([
        ...localStream!.getTracks(),
        ...remoteStream.getTracks()
      ])
      
      const recorder = new MediaRecorder(combinedStream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        // Ici, vous pouvez implémenter la logique pour sauvegarder l'enregistrement
        // par exemple, l'uploader vers un service de stockage
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } else if (mediaRecorder) {
      // Arrêter l'enregistrement
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Vidéo locale */}
      <Card className="relative">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-lg"
        />
        <div className="absolute bottom-4 left-4 text-white">Vous</div>
      </Card>

      {/* Vidéo distante */}
      <Card className="relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg"
        />
        <div className="absolute bottom-4 left-4 text-white">Participant</div>
      </Card>

      {/* Contrôles */}
      <div className="col-span-2 flex justify-center gap-4">
        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="icon"
          onClick={toggleAudio}
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </Button>

        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="icon"
          onClick={toggleVideo}
        >
          {isVideoEnabled ? <Video /> : <VideoOff />}
        </Button>

        {isMentor && (
          <Button
            variant={isRecording ? "destructive" : "default"}
            size="icon"
            onClick={toggleRecording}
          >
            <MonitorUp />
          </Button>
        )}

        <Button
          variant="destructive"
          size="icon"
          onClick={onEndCall}
        >
          <PhoneOff />
        </Button>
      </div>
    </div>
  )
}