'use client'
import { useEffect, useRef } from 'react';

export default function MusicClassroom({ roomName, userName }: { roomName: string, userName: string }) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
        // Cleanup existing instance if it exists
        if (apiRef.current) apiRef.current.dispose();

        apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName: `MusicSchoolPlatform-${roomName.replace(/\s+/g, '-')}`,
          parentNode: jitsiContainerRef.current,
          userInfo: { displayName: userName },
          // Force the iframe to fill the container perfectly
          width: '100%',
          height: '100%',
          configOverwrite: {
            startWithAudioMuted: false,
            prejoinPageEnabled: false,
            // --- CRITICAL MUSIC SETTINGS ---
            disableAudioLevels: true,
            disableAP: true, // No noise suppression for instruments
            disableHPF: true, // No high-pass filter
            audioQuality: {
              stereo: true,
            },
            // Added to prevent cropping
            disableSelfViewSettings: false,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'chat', 
              'settings', 'raisehand', 'tileview', 'fullscreen'
            ],
            // Keeps the video ratio stable
            VIDEO_LAYOUT_FIT: 'both', 
            VERTICAL_FILMSTRIP: true,
          }
        });
      }
    };

    return () => { 
      if (apiRef.current) apiRef.current.dispose();
      script.remove(); 
    };
  }, [roomName, userName]);

  return (
    <div className="relative w-full h-[calc(100vh-100px)] bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-indigo-500/30">
      <div 
        ref={jitsiContainerRef} 
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

declare global {
  interface Window { JitsiMeetExternalAPI: any; }
}