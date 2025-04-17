"use client"

import { useEffect, useRef, useState } from "react"

export default function SimpleWebcam() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Function to start the webcam
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            setIsStreaming(true)
          }
        }

        return stream
      } catch (err) {
        console.error("Error accessing webcam:", err)
        setError(err instanceof Error ? err.message : "Failed to access webcam")
        return null
      }
    }

    // Start the camera
    const streamPromise = startCamera()

    // Cleanup function
    return () => {
      streamPromise.then((stream) => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
      })
    }
  }, [])

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm bg-gray-50">
      <div className="p-2 bg-gray-100 border-b">
        <div className="flex items-center">
          {isStreaming ? (
            <>
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
              <span className="text-sm font-medium">Proctoring Active</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse mr-2"></span>
              <span className="text-sm font-medium">Initializing Camera...</span>
            </>
          )}
        </div>
      </div>

      <div className="bg-black relative">
        {error ? (
          <div className="p-4 bg-red-50 text-red-700 text-sm">
            <p>Camera error: {error}</p>
            <p className="mt-1">Please ensure you've allowed camera access.</p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full" />
        )}
      </div>

      <div className="p-2 text-xs text-gray-500 text-center">
        Your webcam feed is being monitored for exam integrity
      </div>
    </div>
  )
}
