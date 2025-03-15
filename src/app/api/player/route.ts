// /app/api/player/route.ts

export async function GET(request: Request) {
  // Use the standard URL API instead of NextRequest
  const url = new URL(request.url);
  const src = url.searchParams.get("src");

  if (!src) {
    return new Response(JSON.stringify({ error: "Missing src parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Return HTML directly with standard Response
  return new Response(
    `<!DOCTYPE html>
    <html>
    <head>
      <title>Anime Player</title>
      <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #000; }
        #video { width: 100%; height: 100%; }
        .loader { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          border: 4px solid rgba(128, 90, 213, 0.2);
          border-radius: 50%;
          border-top-color: rgba(128, 90, 213, 0.8);
          animation: spin 1s infinite linear;
        }
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ff5555;
          font-family: Arial, sans-serif;
          text-align: center;
          width: 80%;
        }
      </style>
    </head>
    <body>
      <div id="loader" class="loader"></div>
      <div id="error" class="error" style="display: none;"></div>
      <video id="video" controls style="display: none;"></video>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          const video = document.getElementById('video');
          const loader = document.getElementById('loader');
          const errorDiv = document.getElementById('error');
          const videoSrc = '${src}';
          
          function showError(message) {
            loader.style.display = 'none';
            video.style.display = 'none';
            errorDiv.style.display = 'block';
            errorDiv.textContent = message;
          }
          
          function hideLoader() {
            loader.style.display = 'none';
            video.style.display = 'block';
          }
          
          if (Hls.isSupported()) {
            const hls = new Hls({
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
              startLevel: -1,
              enableWorker: true
            });
            
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
              video.play().catch(function(e) {
                console.warn('Auto-play was prevented:', e);
              });
              hideLoader();
            });
            
            hls.on(Hls.Events.ERROR, function(event, data) {
              if (data.fatal) {
                switch(data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
                      showError('Gagal memuat video. Server mungkin tidak tersedia.');
                    } else {
                      console.error('HLS network error, trying to recover...');
                      hls.startLoad();
                    }
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.error('HLS media error, trying to recover...');
                    hls.recoverMediaError();
                    break;
                  default:
                    console.error('Fatal error:', data);
                    showError('Terjadi kesalahan saat memuat video.');
                    hls.destroy();
                    break;
                }
              }
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // For Safari on iOS
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', function() {
              video.play().catch(function(e) {
                console.warn('Auto-play was prevented:', e);
              });
              hideLoader();
            });
            
            video.addEventListener('error', function() {
              showError('Gagal memuat video. Silakan coba server lain.');
            });
          } else {
            showError('Browser Anda tidak mendukung pemutaran video ini. Silakan gunakan Chrome, Firefox, atau browser modern lainnya.');
          }
        });
      </script>
    </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
