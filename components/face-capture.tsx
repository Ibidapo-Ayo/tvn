"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, X, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Configuration for face detection requirements
const FACE_DETECTION_CONFIG = {
  requireFaceDetection: false, // Set to true to enable face detection requirements
  detectionInterval: 200, // Face detection check interval in ms
  skinToneThreshold: 0.25, // Minimum skin tone ratio for face detection
  minSamplePixels: 50, // Minimum sample pixels for detection
}

interface FaceCaptureProps {
  onCapture: (imageData: string) => void
  onClose: () => void
  isOpen: boolean
}

export function FaceCapture({ onCapture, onClose, isOpen }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)

  const { toast } = useToast()

  // Initialize camera and face detection
  const initializeCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      setCameraReady(false)

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in this browser")
      }

      // Request camera permission with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 480 },
          height: { ideal: 480, min: 360 },
          facingMode: "user",
          frameRate: { ideal: 30, min: 15 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                setCameraReady(true)
                setIsLoading(false)
                startFaceDetection()

                toast({
                  title: "Camera Ready",
                  description: "Position your face in the camera view",
                })
              })
              .catch((playError) => {
                console.error("Video play error:", playError)
                setError("Failed to start camera preview")
                setIsLoading(false)
              })
          }
        }

        videoRef.current.onerror = (videoError) => {
          console.error("Video error:", videoError)
          setError("Camera stream error occurred")
          setIsLoading(false)
        }
      }
    } catch (err) {
      console.error("Camera initialization error:", err)
      let errorMessage = "Failed to access camera. "

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage += "Please allow camera access and try again."
        } else if (err.name === "NotFoundError") {
          errorMessage += "No camera found on this device."
        } else if (err.name === "NotReadableError") {
          errorMessage += "Camera is being used by another application."
        } else {
          errorMessage += err.message
        }
      } else {
        errorMessage += "Please check camera permissions and try again."
      }

      setError(errorMessage)
      setIsLoading(false)

      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [toast])

  // Face detection using Canvas and basic image processing
  const detectFace = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return false

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return false

    try {
      // Set canvas size to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Get image data for basic face detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Simple face detection based on skin tone and face-like regions
      const faceDetected = performBasicFaceDetection(imageData)

      return faceDetected
    } catch (error) {
      console.error("Face detection error:", error)
      return false
    }
  }, [cameraReady])

  // Basic face detection algorithm (simplified)
  const performBasicFaceDetection = (imageData: ImageData): boolean => {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height

    let skinPixels = 0
    let totalPixels = 0

    // Sample pixels in the center region where face would typically be
    const centerX = width / 2
    const centerY = height / 2
    const sampleRadius = Math.min(width, height) / 4

    for (let y = centerY - sampleRadius; y < centerY + sampleRadius; y += 8) {
      for (let x = centerX - sampleRadius; x < centerX + sampleRadius; x += 8) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const index = (Math.floor(y) * width + Math.floor(x)) * 4
          const r = data[index]
          const g = data[index + 1]
          const b = data[index + 2]

          // Basic skin tone detection
          if (isSkinTone(r, g, b)) {
            skinPixels++
          }
          totalPixels++
        }
      }
    }

    // Use configurable threshold values
    const skinRatio = skinPixels / totalPixels
    return skinRatio > FACE_DETECTION_CONFIG.skinToneThreshold && totalPixels > FACE_DETECTION_CONFIG.minSamplePixels
  }

  // Simple skin tone detection
  const isSkinTone = (r: number, g: number, b: number): boolean => {
    // Basic skin tone ranges (simplified)
    return (
      (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15 && r - b > 15) ||
      (r > 220 && g > 210 && b > 170 && Math.abs(r - g) <= 15 && r > b && g > b) ||
      (r > 60 && g > 30 && b > 15 && r > g && r > b)
    )
  }

  // Start continuous face detection only if enabled
  const startFaceDetection = useCallback(() => {
    if (!FACE_DETECTION_CONFIG.requireFaceDetection) {
      return
    }

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }

    detectionIntervalRef.current = setInterval(() => {
      const detected = detectFace()
      setFaceDetected(detected)
    }, FACE_DETECTION_CONFIG.detectionInterval)
  }, [detectFace])

  // Capture photo with countdown
  const capturePhoto = useCallback(async () => {
    // Only check face detection if enabled in config
    if (FACE_DETECTION_CONFIG.requireFaceDetection && !faceDetected) {
      toast({
        title: "No Face Detected",
        description: "Please position your face in the camera view and try again.",
        variant: "destructive",
      })
      return
    }

    if (!cameraReady) {
      toast({
        title: "Camera Not Ready",
        description: "Please wait for the camera to initialize.",
        variant: "destructive",
      })
      return
    }

    try {
      // Start countdown
      for (let i = 3; i > 0; i--) {
        setCountdown(i)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      setCountdown(null)

      // Capture the image
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Set canvas size
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Convert to base64 image with good quality
          const imageData = canvas.toDataURL("image/jpeg", 0.9)
          setCapturedImage(imageData)

          toast({
            title: "Photo Captured!",
            description: "Face photo has been captured successfully.",
          })
        }
      }
    } catch (error) {
      console.error("Photo capture error:", error)
      toast({
        title: "Capture Failed",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive",
      })
    }
  }, [faceDetected, cameraReady, toast])

  // Confirm and save the captured image
  const confirmCapture = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage)
      cleanup()
      onClose()
    }
  }, [capturedImage, onCapture, onClose])

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setCountdown(null)
    // Restart face detection
    if (cameraReady) {
      startFaceDetection()
    }
  }, [cameraReady, startFaceDetection])

  // Cleanup camera resources
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })
      streamRef.current = null
    }

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setFaceDetected(false)
    setCountdown(null)
    setCapturedImage(null)
    setError(null)
    setCameraReady(false)
  }, [])

  // Initialize camera when component opens
  useEffect(() => {
    if (isOpen) {
      initializeCamera()
    } else {
      cleanup()
    }

    return cleanup
  }, [isOpen, initializeCamera, cleanup])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Face Recognition Attendance
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={initializeCamera}>Try Again</Button>
            </div>
          ) : (
            <>
              {/* Camera View */}
              <div className="relative">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  {capturedImage ? (
                    // Show captured image
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured face"
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    // Show live camera feed
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-80 object-cover"
                        style={{ transform: "scaleX(-1)" }} // Mirror the video
                      />

                      {/* Face detection overlay - only show if enabled */}
                      {FACE_DETECTION_CONFIG.requireFaceDetection && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className={`w-48 h-64 border-2 rounded-lg transition-colors ${
                              faceDetected ? "border-green-500 shadow-lg shadow-green-500/50" : "border-white/50"
                            }`}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  faceDetected ? "bg-green-500 text-white" : "bg-white/20 text-white"
                                }`}
                              >
                                {faceDetected ? "✓ Face Detected" : "Position Your Face"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Countdown overlay */}
                      {countdown && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-6xl font-bold text-white animate-pulse">{countdown}</div>
                        </div>
                      )}

                      {/* Loading overlay */}
                      {isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p>Initializing camera...</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Hidden canvas for image processing */}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Status and Instructions */}
              <div className="text-center space-y-2">
                {capturedImage ? (
                  <p className="text-green-600 font-medium">
                    <Check className="inline h-4 w-4 mr-1" />
                    Photo captured successfully!
                  </p>
                ) : (
                  <>
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          cameraReady
                            ? FACE_DETECTION_CONFIG.requireFaceDetection
                              ? faceDetected
                                ? "bg-green-500"
                                : "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          cameraReady
                            ? FACE_DETECTION_CONFIG.requireFaceDetection
                              ? faceDetected
                                ? "text-green-600"
                                : "text-yellow-600"
                              : "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {!cameraReady
                          ? "Camera initializing..."
                          : FACE_DETECTION_CONFIG.requireFaceDetection
                            ? faceDetected
                              ? "Face detected - Ready to capture"
                              : "Position your face in the frame"
                            : "Camera ready - Click capture when ready"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {FACE_DETECTION_CONFIG.requireFaceDetection
                        ? "Look directly at the camera and ensure good lighting for best results"
                        : "Position yourself in the camera view and click capture when ready"}
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                {capturedImage ? (
                  <>
                    <Button variant="outline" onClick={retakePhoto}>
                      <Camera className="mr-2 h-4 w-4" />
                      Retake
                    </Button>
                    <Button onClick={confirmCapture}>
                      <Check className="mr-2 h-4 w-4" />
                      Mark Attendance
                    </Button>
                  </>
                ) : (
                  <Button onClick={capturePhoto} disabled={!cameraReady || countdown !== null} size="lg">
                    <Camera className="mr-2 h-4 w-4" />
                    {countdown ? `Capturing in ${countdown}...` : "Capture Face"}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
