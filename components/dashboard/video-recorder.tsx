'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RotateCcw, Check, AlertTriangle, Loader2, Upload, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VideoRecorderProps {
  onVideoRecorded: (videoUrl: string) => void;
  onRecordingComplete?: () => void;
  fullScreen?: boolean;
  initialVideo?: string | null;
}

const RECORDING_SECONDS = 30; // 30 seconds
const MAX_VIDEO_SIZE_MB = 20;

export function VideoRecorder({ 
  onVideoRecorded, 
  onRecordingComplete, 
  fullScreen = false,
  initialVideo = null 
}: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [permissionStatus, setPermissionStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'error' | 'unsupported'>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimeRef = useRef(0);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(initialVideo || null);
  const [isPreviewing, setIsPreviewing] = useState(!!initialVideo);
  const [videoSize, setVideoSize] = useState(0);

  // Request camera permission on mount if no initial video
  useEffect(() => {
    if (!initialVideo) {
      requestCameraPermission();
    }
    return () => {
      stopStream();
    };
  }, [initialVideo]);

  // Recording timer — auto-stops at exactly 30 seconds
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
    if (typeof window === 'undefined') return;

    // Check if mediaDevices and getUserMedia are supported in the current context
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      setPermissionStatus('unsupported');
      return;
    }

    setPermissionStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: true 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          // Autoplay might be restricted until user interaction
        }
      }
      
      setPermissionStatus('granted');
      toast.success('Camera access granted');
    } catch (error) {
      console.error('Camera permission error:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setPermissionStatus('denied');
          toast.error('Camera access denied. You can record or upload a video file instead.');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          setPermissionStatus('error');
          toast.error('No camera detected. You can upload a video file instead.');
        } else {
          setPermissionStatus('error');
          toast.error('Could not start live camera. You can upload a video file instead.');
        }
      } else {
        setPermissionStatus('error');
      }
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      toast.error('Camera stream is not available');
      return;
    }

    if (typeof MediaRecorder === 'undefined') {
      toast.error('MediaRecorder is not supported in this browser. Please use file upload.');
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
        videoBitsPerSecond: 1000000,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleRecordingStop;

      mediaRecorder.start(1000);
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
    } catch (error) {
      console.error('Video upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload video');
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_VIDEO_SIZE_MB) {
      toast.error(`Video too large (${sizeMB.toFixed(2)}MB). Maximum allowed is ${MAX_VIDEO_SIZE_MB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('video', file);

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
      setVideoSize(sizeMB);
      setIsPreviewing(true);
      setIsProcessing(false);
      onVideoRecorded(url);
      toast.success(`Video attached successfully (${sizeMB.toFixed(2)}MB)`);
    } catch (error) {
      console.error('Video upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload video file');
      setIsProcessing(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
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
    requestCameraPermission();
    toast.info('Ready to record again');
  };

  const confirmRecording = () => {
    if (recordedVideo) {
      setIsPreviewing(false);
      toast.success('Video confirmed for batch submission');
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

  // Hidden file input for native camera or file upload fallback
  const renderFileInput = () => (
    <input 
      ref={fileInputRef}
      type="file"
      accept="video/*"
      capture="environment"
      className="hidden"
      onChange={handleFileUpload}
    />
  );

  // Processing / Uploading state
  if (isProcessing) {
    return (
      <div className={`${fullScreen ? 'h-full w-full rounded-none border-none' : 'min-h-[220px]'} border border-dashed border-amber-500/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 bg-amber-500/5 text-center`}>
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <div className="space-y-1">
          <p className="text-base font-bold text-foreground">Processing & Uploading Video...</p>
          <p className="text-xs text-muted-foreground">Please wait while the verification video is secured on the server.</p>
        </div>
      </div>
    );
  }

  // Preview mode
  if (isPreviewing && recordedVideo) {
    return (
      <div className={`${fullScreen ? 'h-full w-full rounded-none border-none p-0' : 'min-h-[280px]'} border border-primary/50 rounded-2xl p-4 bg-primary/5 relative overflow-hidden flex flex-col justify-between`}>
        {renderFileInput()}
        <video 
          src={recordedVideo} 
          controls 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-md">
            <Check className="w-3.5 h-3.5" /> Video Ready
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-10">
          <div className="text-white text-xs space-y-0.5">
            <p className="font-bold">Verification Video Recorded</p>
            {videoSize > 0 && <p className="opacity-80">Size: {videoSize.toFixed(2)} MB</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={retakeRecording}
              className="flex-1 sm:flex-initial gap-1.5 text-xs bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake
            </Button>
            <Button 
              type="button"
              size="sm" 
              onClick={confirmRecording}
              className="flex-1 sm:flex-initial gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg"
            >
              <Check className="w-3.5 h-3.5" /> Confirm & Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Unsupported context (e.g. HTTP over LAN IP without HTTPS)
  if (permissionStatus === 'unsupported') {
    return (
      <div className={`${fullScreen ? 'h-full w-full rounded-none border-none' : 'min-h-[220px]'} border border-dashed border-primary/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 bg-card/60 text-center`}>
        {renderFileInput()}
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <VideoIcon className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md">
          <p className="text-base font-bold text-foreground">Record Verification Video</p>
          <p className="text-xs text-muted-foreground">
            Live browser streaming requires HTTPS or localhost. You can record or upload a video directly using your mobile or device camera.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
          <Button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="w-full gap-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Camera className="w-4 h-4" /> Open Camera / Upload Video
          </Button>
        </div>
      </div>
    );
  }

  // Camera access denied state
  if (permissionStatus === 'denied') {
    return (
      <div className={`${fullScreen ? 'h-full w-full rounded-none border-none' : 'min-h-[220px]'} border border-dashed border-red-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 bg-red-500/5 text-center`}>
        {renderFileInput()}
        <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500">
          <CameraOff className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md">
          <p className="text-base font-bold text-red-600 dark:text-red-400">Camera Permission Denied</p>
          <p className="text-xs text-muted-foreground">
            Please allow camera access in browser settings, or record/upload a video directly from your device.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
          <Button 
            type="button" 
            variant="outline"
            onClick={requestCameraPermission}
            className="flex-1 gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Try Live Camera
          </Button>
          <Button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 gap-1.5 text-xs bg-primary text-primary-foreground"
          >
            <Upload className="w-3.5 h-3.5" /> Upload / Record
          </Button>
        </div>
      </div>
    );
  }

  // Camera error state
  if (permissionStatus === 'error') {
    return (
      <div className={`${fullScreen ? 'h-full w-full rounded-none border-none' : 'min-h-[220px]'} border border-dashed border-amber-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 bg-amber-500/5 text-center`}>
        {renderFileInput()}
        <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md">
          <p className="text-base font-bold text-amber-600 dark:text-amber-400">Camera Unavailable</p>
          <p className="text-xs text-muted-foreground">
            Failed to connect to live camera stream. You can retry or record/upload using your native device camera.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
          <Button 
            type="button" 
            variant="outline" 
            onClick={requestCameraPermission}
            className="flex-1 gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </Button>
          <Button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 gap-1.5 text-xs bg-primary text-primary-foreground"
          >
            <Upload className="w-3.5 h-3.5" /> Upload / Record
          </Button>
        </div>
      </div>
    );
  }

  // Requesting permission state
  if (permissionStatus === 'requesting') {
    return (
      <div className={`${fullScreen ? 'h-full w-full rounded-none border-none' : 'min-h-[220px]'} border border-dashed border-border/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-muted/10 text-center`}>
        {renderFileInput()}
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Connecting to camera...</p>
      </div>
    );
  }

  // Live recording mode
  return (
    <div className={`${fullScreen ? 'h-full w-full rounded-none border-none' : 'min-h-[280px]'} border border-dashed border-border/80 rounded-2xl overflow-hidden bg-muted/10 relative`}>
      {renderFileInput()}

      {/* Live camera preview */}
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        playsInline
        className={`absolute inset-0 w-full h-full object-cover ${isRecording ? '' : 'opacity-80'}`}
      />
      
      {/* Recording overlay */}
      {isRecording && (
        <div className="absolute inset-0 bg-black/20" />
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
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
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center gap-3">
        {!isRecording ? (
          <div className="w-full max-w-sm space-y-2">
            <Button 
              type="button"
              onClick={startRecording}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold gap-2 rounded-xl shadow-lg"
            >
              <Camera className="w-4 h-4" />
              Start Recording (30 seconds)
            </Button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-center text-xs text-white/80 hover:text-white underline underline-offset-2 py-1 transition-colors"
            >
              Or choose / record video with device camera
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="text-white text-xs text-center space-y-0.5">
              <p className="font-bold">Recording in progress</p>
              <p className="opacity-80">Auto-ends at 30 seconds</p>
            </div>
          </div>
        )}
      </div>

      {/* Time remaining indicator */}
      {isRecording && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-mono backdrop-blur-sm">
          {formatTime(RECORDING_SECONDS - recordingTime)} remaining
        </div>
      )}
    </div>
  );
}
