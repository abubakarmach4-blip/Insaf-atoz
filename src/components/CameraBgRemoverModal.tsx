import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, Sliders, AlertCircle, Sparkles, Upload, Eye } from 'lucide-react';
import { processImageBackgroundRemoval } from '../utils/backgroundRemoval';

interface CameraBgRemoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCaptured: (dataUrl: string) => void;
  lang: 'ur' | 'en';
}

export const CameraBgRemoverModal: React.FC<CameraBgRemoverModalProps> = ({
  isOpen,
  onClose,
  onImageCaptured,
  lang,
}) => {
  const isUrdu = lang === 'ur';

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rawCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Snapshot & Processing state
  const [capturedRawUrl, setCapturedRawUrl] = useState<string | null>(null);
  const [isolatedUrl, setIsolatedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tolerance, setTolerance] = useState<number>(38);
  const [detectMode, setDetectMode] = useState<'auto' | 'light' | 'dark' | 'green'>('auto');
  const [autoCrop, setAutoCrop] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'transparent' | 'original' | 'compare'>('transparent');

  // Start Camera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('WebRTC Camera API is not supported on this browser or context.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: cameraFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      const errMsg = err instanceof Error ? err.message : 'Camera could not be accessed.';
      setCameraError(
        isUrdu
          ? 'کیمرہ شروع نہیں ہو سکا۔ برائے مہربانی کیمرہ کی اجازت دیں یا نیچے فائل اپلوڈ کا استعمال کریں۔'
          : `Camera error: ${errMsg}. You can also upload a photo below.`
      );
      setCameraActive(false);
    }
  }, [cameraFacing, isUrdu]);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (isOpen && !capturedRawUrl) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedRawUrl, startCamera, stopCamera]);

  // Handle Switch Camera
  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Run Background Removal
  const runRemoval = useCallback(
    (sourceCanvas: HTMLCanvasElement, currentTolerance: number, mode: 'auto' | 'light' | 'dark' | 'green', crop: boolean) => {
      setIsProcessing(true);
      setTimeout(() => {
        try {
          const res = processImageBackgroundRemoval(sourceCanvas, {
            tolerance: currentTolerance,
            detectMode: mode,
            autoCrop: crop,
            featherRadius: 2,
          });
          setIsolatedUrl(res.dataUrl);
        } catch (e) {
          console.error('Removal failed', e);
        } finally {
          setIsProcessing(false);
        }
      }, 50);
    },
    []
  );

  // Capture snapshot from video stream
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If mirrored user camera
    if (cameraFacing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    rawCanvasRef.current = canvas;
    const rawUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedRawUrl(rawUrl);

    // Stop active camera to save resources
    stopCamera();

    // Immediately isolate background
    runRemoval(canvas, tolerance, detectMode, autoCrop);
  };

  // Re-run removal when sliders change
  const handleToleranceChange = (newTolerance: number) => {
    setTolerance(newTolerance);
    if (rawCanvasRef.current) {
      runRemoval(rawCanvasRef.current, newTolerance, detectMode, autoCrop);
    }
  };

  const handleModeChange = (newMode: 'auto' | 'light' | 'dark' | 'green') => {
    setDetectMode(newMode);
    if (rawCanvasRef.current) {
      runRemoval(rawCanvasRef.current, tolerance, newMode, autoCrop);
    }
  };

  const handleAutoCropToggle = () => {
    const nextCrop = !autoCrop;
    setAutoCrop(nextCrop);
    if (rawCanvasRef.current) {
      runRemoval(rawCanvasRef.current, tolerance, detectMode, nextCrop);
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedRawUrl(null);
    setIsolatedUrl(null);
    rawCanvasRef.current = null;
    startCamera();
  };

  // Confirm and inject into form
  const handleSaveToForm = () => {
    if (isolatedUrl) {
      onImageCaptured(isolatedUrl);
      onClose();
    }
  };

  // File Upload Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          rawCanvasRef.current = canvas;
          setCapturedRawUrl(canvas.toDataURL('image/jpeg', 0.9));
          stopCamera();
          runRemoval(canvas, tolerance, detectMode, autoCrop);
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0e1017] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-600/20 via-[#131622] to-amber-600/20 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-urdu">
                <span>لائیو کیمرہ و بیک گراؤنڈ ریموور</span>
                <span className="text-xs text-amber-400 font-brand">AI Studio Tool</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isUrdu
                  ? 'پروڈکٹ کی تصویر لیں، خودکار طریقے سے پس منظر ہٹائیں اور ٹرانسپیرنٹ PNG محفوظ کریں۔'
                  : 'Capture product photo, automatically remove background and generate a clean transparent PNG.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          
          {/* Main Stage: Either Live Video OR Captured Result */}
          {!capturedRawUrl ? (
            /* Live Camera Viewfinder */
            <div className="relative bg-black rounded-xl overflow-hidden border border-slate-800 aspect-video max-h-[380px] flex items-center justify-center">
              {cameraError ? (
                <div className="text-center p-6 max-w-md">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-300 mb-4">{cameraError}</p>
                  
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer text-xs">
                    <Upload className="w-4 h-4" />
                    <span>{isUrdu ? 'موبائل یا کمپیوٹر سے فوٹو منتخب کریں' : 'Choose Photo from Device'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Framing Overlay Guide */}
                  <div className="absolute inset-8 pointer-events-none border-2 border-dashed border-amber-400/60 rounded-xl flex items-center justify-center">
                    <div className="text-center bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-300 text-xs font-urdu">
                      {isUrdu ? 'آئل بوتل یا فلٹر کو فریم کے اندر سیدھا رکھیں' : 'Place product centered inside box'}
                    </div>
                  </div>

                  {/* Camera Controls on bottom */}
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4 pointer-events-auto">
                    {/* Switch Front/Back camera */}
                    <button
                      onClick={toggleCameraFacing}
                      className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-transform active:rotate-180"
                      title={isUrdu ? 'کیمرہ تبدیل کریں' : 'Switch Camera'}
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>

                    {/* Snap & Remove Background Button */}
                    <button
                      onClick={captureSnapshot}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:brightness-110 active:scale-95 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/30 transition-all border border-amber-300"
                    >
                      <Sparkles className="w-5 h-5 text-slate-950" />
                      <span>{isUrdu ? 'تصویر لیں اور بیک گراؤنڈ صاف کریں' : 'Capture & Remove Background'}</span>
                    </button>

                    {/* Upload File directly */}
                    <label
                      className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md cursor-pointer"
                      title={isUrdu ? 'گیلری سے اپلوڈ' : 'Upload File'}
                    >
                      <Upload className="w-5 h-5" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Result Preview Screen with Transparent Isolation */
            <div className="flex flex-col gap-4">
              
              {/* Preview Canvas Display */}
              <div className="relative rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950 min-h-[300px] flex items-center justify-center">
                
                {/* Transparency Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #1f2430 25%, transparent 25%), linear-gradient(-45deg, #1f2430 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2430 75%), linear-gradient(-45deg, transparent 75%, #1f2430 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  }}
                />

                {isProcessing ? (
                  <div className="relative z-10 flex flex-col items-center gap-2 text-amber-400">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="text-sm font-semibold">{isUrdu ? 'بیک گراؤنڈ صاف ہو رہا ہے...' : 'Removing background...'}</span>
                  </div>
                ) : (
                  <div className="relative z-10 p-4 max-h-[320px] flex items-center justify-center">
                    {viewMode === 'transparent' && isolatedUrl && (
                      <img
                        src={isolatedUrl}
                        alt="Isolated product"
                        className="max-h-[300px] max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                      />
                    )}
                    {viewMode === 'original' && capturedRawUrl && (
                      <img
                        src={capturedRawUrl}
                        alt="Original capture"
                        className="max-h-[300px] max-w-full object-contain"
                      />
                    )}
                    {viewMode === 'compare' && (
                      <div className="grid grid-cols-2 gap-3 max-h-[300px]">
                        <div className="text-center">
                          <span className="text-[11px] text-slate-400 block mb-1">اصل تصویر (Original)</span>
                          <img src={capturedRawUrl || ''} alt="raw" className="max-h-[250px] object-contain rounded-lg border border-slate-700" />
                        </div>
                        <div className="text-center">
                          <span className="text-[11px] text-amber-400 font-bold block mb-1">صاف شدہ PNG (Isolated)</span>
                          <img src={isolatedUrl || ''} alt="isolated" className="max-h-[250px] object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* View Mode Toggle Pill */}
                <div className="absolute top-3 right-3 z-20 flex bg-slate-900/90 backdrop-blur-md rounded-lg p-1 border border-slate-700 text-xs">
                  <button
                    onClick={() => setViewMode('transparent')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      viewMode === 'transparent' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                    }`}
                  >
                    {isUrdu ? 'ٹرانسپیرنٹ' : 'Transparent'}
                  </button>
                  <button
                    onClick={() => setViewMode('original')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      viewMode === 'original' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                    }`}
                  >
                    {isUrdu ? 'اصل' : 'Original'}
                  </button>
                  <button
                    onClick={() => setViewMode('compare')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      viewMode === 'compare' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                    }`}
                  >
                    {isUrdu ? 'موازنہ' : 'Compare'}
                  </button>
                </div>
              </div>

              {/* Sensitivity & Fine-Tuning Controls */}
              <div className="bg-[#12141e] border border-slate-800 rounded-xl p-3.5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>{isUrdu ? 'بیک گراؤنڈ ریموول کنٹرول (Tolerance)' : 'Sensitivity & Backdrop Tuning'}</span>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">{tolerance}%</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-slate-400">{isUrdu ? 'کم' : 'Low'}</span>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={tolerance}
                    onChange={(e) => handleToleranceChange(Number(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400">{isUrdu ? 'زیادہ' : 'High'}</span>
                </div>

                {/* Detection preset modes */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">{isUrdu ? 'پس منظر کی قسم:' : 'Backdrop:'}</span>
                    {(['auto', 'light', 'dark', 'green'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => handleModeChange(mode)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                          detectMode === mode
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {mode === 'auto' ? (isUrdu ? 'خودکار (Auto)' : 'Auto') : mode}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
                    <input
                      type="checkbox"
                      checked={autoCrop}
                      onChange={handleAutoCropToggle}
                      className="accent-amber-500 rounded"
                    />
                    <span>{isUrdu ? 'خودکار کٹائی (Auto Crop)' : 'Auto Crop to Product'}</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons: Retake vs Use Image */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isUrdu ? 'دوبارہ تصویر لیں' : 'Retake Photo'}</span>
                </button>

                <button
                  onClick={handleSaveToForm}
                  disabled={!isolatedUrl || isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:brightness-110 active:scale-98 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isUrdu ? 'یہ تصویر پروڈکٹ میں شامل کریں' : 'Save Transparent PNG to Product'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
