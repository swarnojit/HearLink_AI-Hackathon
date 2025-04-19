let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let audioContext = null;
let sourceNode = null;
let silenceDetector = null;
let silenceCounter = 0;
let currentTranscription = "";
let isProcessing = false; // Add a flag to track processing state
let audioStream = null; // Store the stream separately

// Element references
const recordBtn = document.getElementById('record-btn');
const statusText = document.getElementById('status-text');
const transcriptionText = document.getElementById('transcription-text');
const languageSelect = document.getElementById('language');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const recordingIndicator = document.getElementById('recording-indicator');

// Configuration parameters
const SILENCE_THRESHOLD = 0.015; // Silence detection threshold (0-1)
const SILENCE_DURATION = 1.2; // Seconds of silence before sending chunk
const MAX_RECORDING_DURATION = 4.0; // Maximum seconds before forcing chunk send
const MIN_RECORDING_DURATION = 0.8; // Minimum seconds before sending a chunk

// Debug logging function
function logStatus(message) {
    console.log(`[STT ${new Date().toISOString()}] ${message}`);
    statusText.textContent = message;
}

async function processAudioChunk() {
    if (audioChunks.length === 0 || isProcessing) return;

    // Set processing flag to prevent overlapping processing
    isProcessing = true;

    // Create audio blob from current chunks
    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });

    // Reset chunks for next recording segment
    const chunkCopy = [...audioChunks];
    audioChunks = [];

    // Don't process very small audio chunks
    if (audioBlob.size < 1000) {
        logStatus(isRecording ? 'Listening...' : 'Ready');
        isProcessing = false;
        return;
    }

    logStatus('Processing audio...');

    // Create form data - maintaining your original API format
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.mp3');
    formData.append('output_language', languageSelect.value);

    try {
        // Send to API endpoint
        const response = await fetch('http://127.0.0.1:5008/api/voice', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Process the results - note we check isRecording again here
        if (result.translated_text && result.translated_text.trim()) {
            // Clean up the transcription

            let newText = result.translated_text.trim();

            // If current transcription ends with sentence-ending punctuation or is empty,
            // capitalize the new text
            if (currentTranscription === "" ||
                /[.!?]\s*$/.test(currentTranscription)) {
                newText = newText.charAt(0).toUpperCase() + newText.slice(1);
            }

            // Add space if needed between chunks
            if (currentTranscription &&
                !currentTranscription.endsWith(" ") &&
                !newText.startsWith(" ") &&
                !/[.!?,;]$/.test(currentTranscription)) {
                currentTranscription += " ";
            }

            // Append new transcription to current one
            currentTranscription += newText;

            // Update live transcription box
            transcriptionText.textContent = currentTranscription;

            // Auto-scroll if overflowing
            transcriptionText.scrollTop = transcriptionText.scrollHeight;
        }

        // Update status when complete, but check if we're still recording
        logStatus(isRecording ? 'Listening...' : 'Processing complete');
    } catch (error) {
        console.error('API Error:', error);
        logStatus(isRecording ? 'Error - still listening' : 'Error processing');
    } finally {
        // Always reset the processing flag
        isProcessing = false;
    }
}

async function initializeAudio() {
    // First check if we already have a valid stream
    if (audioStream && audioStream.active) {
        return audioStream;
    }

    try {
        logStatus('Requesting microphone access...');

        // Request microphone - explicit constraints for more reliable behavior
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        // Store the stream for later use
        audioStream = stream;
        return stream;
    } catch (err) {
        console.error('Microphone access error:', err);
        logStatus(`Microphone error: ${err.name}`);
        throw err;
    }
}

async function startRecording() {
    try {
        // Visual feedback
        recordingIndicator.classList.add('recording');
        logStatus('Starting microphone...');

        // Get audio stream - using our initialize function
        const stream = await initializeAudio();
        if (!stream) {
            throw new Error('Could not initialize audio stream');
        }

        // Setup audio context
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        sourceNode = audioContext.createMediaStreamSource(stream);

        // Setup analyzer for silence detection
        const analyzerNode = audioContext.createAnalyser();
        analyzerNode.fftSize = 1024;
        sourceNode.connect(analyzerNode);

        const bufferLength = analyzerNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Create media recorder - try to use more reliable options
        try {
            // First try with MIME types the browser definitely supports
            let options = {};

            if (MediaRecorder.isTypeSupported('audio/webm')) {
                options = { mimeType: 'audio/webm' };
            } else if (MediaRecorder.isTypeSupported('audio/mp3')) {
                options = { mimeType: 'audio/mp3' };
            } else if (MediaRecorder.isTypeSupported('audio/wav')) {
                options = { mimeType: 'audio/wav' };
            }

            // Add bitrate to options
            options.audioBitsPerSecond = 128000;

            // Create recorder
            mediaRecorder = new MediaRecorder(stream, options);
            console.log('MediaRecorder initialized with options:', options);
        } catch (e) {
            // Fallback with no options
            console.warn('Error creating MediaRecorder with options, falling back:', e);
            mediaRecorder = new MediaRecorder(stream);
        }

        // Reset audio chunks
        audioChunks = [];

        // Start time tracking for this chunk
        let chunkStartTime = Date.now();

        // Event handlers for recording
        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        // Start with smaller time slices
        mediaRecorder.start(250);
        logStatus('Listening...');

        // Handle recording stop
        mediaRecorder.onstop = () => {
            if (audioChunks.length > 0) {
                // Use setTimeout to avoid potential recursive issues
                setTimeout(processAudioChunk, 50);
            }
        };

        // Set up silence detection function
        silenceDetector = setInterval(() => {
            if (!isRecording) {
                clearInterval(silenceDetector);
                return;
            }

            analyzerNode.getByteFrequencyData(dataArray);

            // Calculate average volume level
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength / 255; // Normalize to 0-1

            // Make recording indicator pulse based on audio level
            if (average > SILENCE_THRESHOLD) {
                recordingIndicator.style.opacity = Math.min(0.5 + average, 1);
            } else {
                recordingIndicator.style.opacity = 0.5;
            }

            // Only check for silence/recording timing if we're not already processing
            if (!isProcessing) {
                // Check for silence
                if (average < SILENCE_THRESHOLD) {
                    silenceCounter += 0.1; // Interval is 100ms

                    // If silence lasts for the threshold duration and we have minimum recording time
                    const recordingDuration = (Date.now() - chunkStartTime) / 1000;
                    if (silenceCounter >= SILENCE_DURATION && recordingDuration >= MIN_RECORDING_DURATION) {
                        // Process this chunk after silence
                        if (mediaRecorder && mediaRecorder.state === 'recording') {
                            mediaRecorder.stop();

                            // Restart recording after a short delay
                            setTimeout(() => {
                                if (isRecording && mediaRecorder && mediaRecorder.state === 'inactive') {
                                    try {
                                        mediaRecorder.start(250);
                                        chunkStartTime = Date.now();
                                    } catch (e) {
                                        console.error('Error restarting recorder after silence', e);
                                    }
                                }
                            }, 300);
                        }
                        silenceCounter = 0;
                    }
                } else {
                    // Reset silence counter when sound is detected
                    silenceCounter = 0;
                }

                // Force chunk processing after maximum duration
                const recordingDuration = (Date.now() - chunkStartTime) / 1000;
                if (recordingDuration >= MAX_RECORDING_DURATION) {
                    if (mediaRecorder && mediaRecorder.state === 'recording') {
                        mediaRecorder.stop();

                        // Restart recording shortly after
                        setTimeout(() => {
                            if (isRecording && mediaRecorder && mediaRecorder.state === 'inactive') {
                                try {
                                    mediaRecorder.start(250);
                                    chunkStartTime = Date.now();
                                } catch (e) {
                                    console.error('Error restarting recorder after max duration', e);
                                }
                            }
                        }, 100);
                    }
                    silenceCounter = 0;
                }
            }
        }, 100);

    } catch (err) {
        logStatus(`Microphone access denied: ${err.message}`);
        console.error('Microphone error details:', err);
        recordingIndicator.classList.remove('recording');
        isRecording = false;
        recordBtn.innerHTML = '<span class="mic-icon">🎙️</span> Start Recording';
        recordBtn.classList.remove('recording');
    }
}

function stopRecording() {
    isRecording = false;

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        try {
            mediaRecorder.stop();
        } catch (e) {
            console.error('Error stopping mediaRecorder', e);
        }
    }

    if (silenceDetector) {
        clearInterval(silenceDetector);
        silenceDetector = null;
    }

    // Don't close audioContext or stop the stream here,
    // as we'll reuse them for the next recording

    // Wait for any in-flight processing to complete
    setTimeout(() => {
        // Only add to history when recording stops and we have content
        if (currentTranscription.trim()) {
            // Add final punctuation if missing
            if (!/[.!?]$/.test(currentTranscription)) {
                currentTranscription += ".";
            }

            // Add completed transcription to history
            const listItem = document.createElement('li');
            listItem.textContent = currentTranscription;
            historyList.appendChild(listItem);

            // Scroll history to bottom
            historyList.scrollTop = historyList.scrollHeight;
        }

        recordBtn.innerHTML = '<span class="mic-icon">🎙️</span> Start Recording';
        recordBtn.classList.remove('recording');
        recordingIndicator.classList.remove('recording');
        recordingIndicator.style.opacity = 0.5;
        logStatus('Ready');
    }, 500);
}

// Check for browser compatibility first
function checkBrowserCompatibility() {
    let warningMessage = '';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        warningMessage = 'Your browser does not support audio recording. Please use Chrome, Firefox, or Edge.';
    } else if (!window.MediaRecorder) {
        warningMessage = 'Your browser does not support MediaRecorder. Please use Chrome, Firefox, or Edge.';
    }

    if (warningMessage) {
        logStatus(warningMessage);
        alert(warningMessage);
        return false;
    }

    return true;
}

recordBtn.addEventListener('click', async () => {
    // First check browser compatibility
    if (!checkBrowserCompatibility()) return;

    if (!isRecording) {
        // Pre-request permission separately before starting recording
        try {
            // Try to initialize audio first - this improves reliability
            await initializeAudio();

            isRecording = true;
            recordBtn.innerHTML = '<span class="mic-icon">🛑</span> Stop Recording';
            recordBtn.classList.add('recording');
            currentTranscription = ""; // Reset the transcription
            transcriptionText.textContent = ""; // Clear live transcription box
            startRecording();
        } catch (err) {
            logStatus(`Cannot access microphone: ${err.message}`);
            console.error('Microphone permission error:', err);
            alert('Please allow microphone access to use speech recognition');
        }
    } else {
        stopRecording();
    }
});

clearHistoryBtn.addEventListener('click', () => {
    historyList.innerHTML = '';
});

// Clean up resources when page unloads
window.addEventListener('beforeunload', () => {
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }

    if (audioContext) {
        audioContext.close().catch(e => console.error('Error closing audio context', e));
    }
});

// Add CSS for visual enhancements if not already present
if (!document.getElementById('dynamic-stt-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-stt-styles';
    styleElement.textContent = `
        .recording {
            animation: pulse 1.5s infinite;
            background-color: rgba(255, 50, 50, 0.8) !important;
        }
        
        @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }
        
        #transcription-text {
            max-height: 120px;
            overflow-y: auto;
            line-height: 1.5;
            padding: 10px;
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(styleElement);
}

// Set initial state and check permissions on load
logStatus('Initializing...');

// Try to pre-request permissions when the page loads
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        // Stop the tracks right away - we just wanted the permission
        stream.getTracks().forEach(track => track.stop());
        logStatus('Ready');
    })
    .catch(err => {
        console.log('Initial permission check:', err.name);
        logStatus('Click "Start Recording" to begin');
    });