'use client';

import { useEffect, useRef, useState } from 'react';
import { Video, Camera, CameraOff, RotateCcw, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VideoRecorderProps {
  onVideoRecorded: (videoUrl: string) => void;
  onRecordingComplete?: () => void;
  fullScreen?: boolean;
}

const RECORDING_SECONDS = 30; // 30 seconds
const MAX_VIDEO_SIZE_MB = 20;

export function VideoRecorder({ onVideoRecorded, onRecordingComplete, fullScreen = false }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [permissionStatus, setPermissionStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'error'>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimeRef = useRef(0);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [videoSize, setVideoSize] = useState(0);

  // Request camera permission on mount
  useEffect(() => {
    requestCameraPermission();
    return () => {
      stopStream();
    };
  }, []);

  // Recording timer — auto-stops at exactly 1 minute
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          const next = prev + 1;
          recordingTimeRef.current = next;
          if (next >= RECORDING_SECONDS) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const requestCameraPermission = async () => {
    setPermissionStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: true 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setPermissionStatus('granted');
      toast.success('Camera access granted');
    } catch (error) {
      console.error('Camera permission error:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setPermissionStatus('denied');
          toast.error('Camera access denied. Please allow camera access to create a batch.');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          setPermissionStatus('error');
          toast.error('No camera found on this device.');
        } else {
          setPermissionStatus('error');
          toast.error('Failed to access camera. Please try again.');
        }
      } else {
        setPermissionStatus('error');
        toast.error('Failed to access camera. Please try again.');
      }
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      toast.error('Camera not available');
      return;
    }

    try {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
          ? 'video/webm;codecs=vp9' 
          : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4',
        videoBitsPerSecond: 1000000, // 1 Mbps for better quality at 30 seconds
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleRecordingStop;

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      isRecordingRef.current = true;
      setRecordingTime(0);
      recordingTimeRef.current = 0;
      toast.info('Recording started');
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      isRecordingRef.current = false;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleRecordingStop = async () => {
    const blob = new Blob(chunksRef.current, { 
      type: mediaRecorderRef.current?.mimeType || 'video/webm' 
    });
    
    const sizeMB = blob.size / (1024 * 1024);
    setVideoSize(sizeMB);

    if (sizeMB > MAX_VIDEO_SIZE_MB) {
      toast.error(`Video too large (${sizeMB.toFixed(2)}MB). Maximum allowed is ${MAX_VIDEO_SIZE_MB}MB.`);
      setIsProcessing(false);
      return;
    }

    // Use ref for accurate time since onstop fires asynchronously
    const actualTime = recordingTimeRef.current;
    if (actualTime < RECORDING_SECONDS) {
      toast.error(`Recording too short (${actualTime}s). The full ${RECORDING_SECONDS}s is required.`);
      setIsProcessing(false);
      return;
    }

    // Upload video to API route
    const formData = new FormData();
    formData.append('video', blob, 'video.webm');

    try {
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const { url } = await response.json();
      
      setRecordedVideo(url);
      setIsPreviewing(true);
      setIsProcessing(false);
      onVideoRecorded(url);
      toast.success(`Recording completed (${RECORDING_SECONDS}s, ${sizeMB.toFixed(2)}MB)`);
      // Don't auto-advance - let user review and manually submit
    } catch (error) {
      console.error('Video upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload video');
      setIsProcessing(false);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const retakeRecording = () => {
    setRecordedVideo(null);
    setIsPreviewing(false);
    setIsProcessing(false);
    setRecordingTime(0);
    recordingTimeRef.current = 0;
    setVideoSize(0);
    onVideoRecorded('');
    toast.info('Ready to record again');
  };

  const confirmRecording = () => {
    if (recordedVideo) {
      setIsPreviewing(false);
      toast.success('Video confirmed for batch submission');
      // Trigger advance to next step
      if (onRecordingComplete) {
        onRecordingComplete();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (recordingTime / RECORDING_SECONDS) * 100;

  // Camera access denied state
  if (permissionStatus === 'denied') {
    return (
      <div className={`${fullScreen ? 'h-full w-full rounded-none border-none' : 'min-h-[180px]'} border border-dashed border-red-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-red-500/5`}>
        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
          <CameraOff className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-red-600 dark:text-red-400">Camera Access Required</p>
          <p className="text-[10px] text-red-500/70">Camera access is mandatory to create a batch. Please allow camera access in your browser settings and refresh the page.</p>
        </div>
      </div>
    );
  }

  // Camera error state
  if (permissionStatus === 'error') {
    return (
      <div className={`${fullScreen ? 'h-full w-full rounded-none border-none' : 'min-h-[180px]'} border border-dashed border-amber-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-amber-500/5`}>
        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Camera Error</p>
          <p className="text-[10px] text-amber-500/70">Failed to access camera. Please check your device and try again.</p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={requestCameraPermission}
          className="gap-2 text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Retry
        </Button>
      </div>
    );
  }

  // Requesting permission state
  if (permissionStatus === 'requesting') {
    return (
      <div className={`${fullScreen ? 'h-full w-full rounded-none border-none' : 'min-h-[180px]'} border border-dashed border-border/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-muted/10`}>
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Requesting camera access...</p>
      </div>
    );
  }

  // Preview mode
  if (isPreviewing && recordedVideo) {
    return (
      <div className={`${fullScreen ? 'h-full w-full rounded-none border-none p-0' : 'min-h-[180px]'} border border-dashed border-primary/50 rounded-2xl p-4 bg-primary/5 relative overflow-hidden`}>
        <video 
          src={recordedVideo} 
          controls 
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between gap-2">
          <div className="text-white text-[10px] space-y-0.5">
            <p className="font-bold">Duration: {formatTime(recordingTime)}</p>
            <p className="opacity-80">Size: {videoSize.toFixed(2)}MB</p>
          </div>
          <div className="flex gap-2">
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={retakeRecording}
              className="gap-1.5 text-xs bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake
            </Button>
            <Button 
              type="button"
              size="sm" 
              onClick={confirmRecording}
              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              <Check className="w-3.5 h-3.5" /> Submit & Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Recording mode with live camera
  return (
    <div className={`${fullScreen ? 'h-full w-full rounded-none border-none' : 'min-h-[180px]'} border border-dashed border-border/80 rounded-2xl overflow-hidden bg-muted/10 relative`}>
      {/* Live camera preview */}
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        playsInline
        className={`absolute inset-0 w-full h-full object-cover ${isRecording ? '' : 'opacity-60'}`}
      />
      
      {/* Recording overlay */}
      {isRecording && (
        <div className="absolute inset-0 bg-black/20" />
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          REC {formatTime(recordingTime)}
        </div>
      )}

      {/* Progress bar */}
      {isRecording && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
          <div 
            className="h-full bg-red-600 transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        {!isRecording ? (
          <Button 
            type="button"
            onClick={startRecording}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold gap-2 rounded-xl"
          >
            <Camera className="w-4 h-4" />
            Start Recording (30 seconds)
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <div className="text-white text-xs text-center space-y-0.5">
              <p className="font-bold">Recording in progress</p>
              <p className="opacity-80">Auto-ends at 30 seconds</p>
            </div>
          </div>
        )}
      </div>

      {/* Time remaining indicator */}
      {isRecording && (
        <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-mono">
          {formatTime(RECORDING_SECONDS - recordingTime)} remaining
        </div>
      )}
    </div>
  );
}
