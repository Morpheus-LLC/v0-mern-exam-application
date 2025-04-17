"use client"

import { useEffect, useRef, useState } from "react"
import { AlertCircle, Camera, CheckCircle } from "lucide-react"

export default function WebcamProctor() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "active" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [minimized, setMinimized] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null

    const startWebcam = async () => {
      setStatus("loading")
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: "user",
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            setStatus("active")
          }

          // Fallback in case onloadedmetadata doesn't fire
          setTimeout(() => {
            if (status === "loading" && stream) {
              setStatus("active")
            }
          }, 1000)
        }
      } catch (err) {
        console.error("Error accessing webcam:", err)
        setStatus("error")
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Could not access webcam. Please ensure you have granted camera permissions.",
        )
      }
    }

    startWebcam()

    // Cleanup function to stop the webcam when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const toggleMinimize = () => {
    setMinimized(!minimized)
  }

  return (
    <div
      className={`webcam-proctor ${minimized ? "w-16 h-16" : "w-full"} transition-all duration-300 bg-white rounded-lg shadow-md overflow-hidden`}
    >
      {minimized ? (
        <div
          className="w-full h-full flex items-center justify-center bg-gray-100 cursor-pointer"
          onClick={toggleMinimize}
        >
          <Camera className="text-gray-600" />
        </div>
      ) : (
        <>
          <div className="p-2 bg-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              {status === "active" && (
                <>
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                  <span className="text-sm font-medium text-gray-700">Proctoring Active</span>
                </>
              )}
              {status === "loading" && (
                <>
                  <span className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse mr-2"></span>
                  <span className="text-sm font-medium text-gray-700">Initializing...</span>
                </>
              )}
              {status === "error" && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm font-medium text-red-500">Camera Error</span>
                </>
              )}
            </div>
            <button onClick={toggleMinimize} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="relative bg-black">
            {status === "active" && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
                onCanPlay={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch((e) => console.error("Error playing video:", e))
                  }
                }}
              />
            )}

            {status === "loading" && (
              <div className="flex items-center justify-center h-48 bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center justify-center h-48 bg-gray-100 p-4">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-center text-sm text-gray-600">{errorMessage}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            )}

            {status === "active" && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
            )}
          </div>

          <div className="p-2 bg-gray-100 text-xs text-gray-500 text-center">
            Your webcam feed is being monitored for exam integrity
          </div>
        </>
      )}
    </div>
  )
}
