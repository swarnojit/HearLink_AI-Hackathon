document.addEventListener('DOMContentLoaded', () => {
    // Base URL configuration
    const base_url = 'http://127.0.0.1:5006';

    // Existing elements
    const cameraToggle = document.getElementById('camera-toggle');
    const cameraVideo = document.getElementById('camera-video');
    const topEmotion = document.getElementById('top-emotion');
    const secondEmotion = document.getElementById('second-emotion');
    const distressPercentage = document.getElementById('distress-percentage');
    const distressBarFill = document.getElementById('distress-bar-fill');
    const resultItems = document.querySelectorAll('.result-item');

    // Remove the face detection box from references and DOM (since it's simulated and of no use)
    const faceDetectionBox = document.getElementById('face-detection-box');
    if (faceDetectionBox) {
        faceDetectionBox.remove();
    }

    // Remove emotion levels section from the DOM
    const emotionLabels = document.querySelector('.emotion-labels');
    if (emotionLabels) {
        emotionLabels.remove();
    }

    // New UI elements for recording
    const emotionAnalysisContent = document.querySelector('.emotion-analysis-content');
    const recordingControls = document.createElement('div');
    recordingControls.className = 'recording-controls';
    recordingControls.innerHTML = `
        <button id="start-recording" class="record-btn">Start Recording</button>
        <button id="stop-recording" class="record-btn" disabled>Stop Recording</button>
        <div id="recording-timer" class="recording-timer">00:00</div>
        <div id="recording-status" class="recording-status"></div>
        <button id="start-recording" class="record-btn">Logout</button>
    `;
    emotionAnalysisContent.appendChild(recordingControls);

    // Get new elements
    const startRecordingBtn = document.getElementById('start-recording');
    const stopRecordingBtn = document.getElementById('stop-recording');
    const recordingTimer = document.getElementById('recording-timer');
    const recordingStatus = document.getElementById('recording-status');

    // Check if essential elements are found
    if (!cameraToggle || !cameraVideo || !topEmotion || !secondEmotion ||
        !distressPercentage || !distressBarFill || !resultItems.length ||
        !startRecordingBtn || !stopRecordingBtn || !recordingTimer || !recordingStatus) {
        console.error('One or more DOM elements not found. Please check the HTML structure.');
        return;
    }

    // Camera Stream
    let stream = null;

    // Video Recording variables
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordingTimeInterval = null;
    let recordingStartTime = null;
    let recordingMaxTime = 10; // 10 seconds

    // Start Camera
    const startCamera = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true // Adding audio for complete recording experience
            });
            cameraVideo.srcObject = stream;
            console.log('Camera started');

            // Reset emotion display
            topEmotion.textContent = '-';
            secondEmotion.textContent = '-';
            distressPercentage.textContent = '0%';
            distressBarFill.style.width = '0%';

            // Enable recording button when camera is on
            startRecordingBtn.disabled = false;
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access the camera. Please check permissions and try again.');
            cameraToggle.checked = false;
        }
    };

    // Stop Camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            cameraVideo.srcObject = null;
            stream = null;
            console.log('Camera stopped');
        }

        // Disable recording buttons when camera is off
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = true;

        // Stop recording if active
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            stopRecording();
        }
    };

    // Update UI with results from the server
    const updateResultsUI = (response) => {
        // Animate result items
        resultItems.forEach(item => {
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow to restart animation
            item.style.animation = 'fadeIn 0.5s ease-out forwards';
        });

        // Update with real data from the API
        topEmotion.textContent = response.top_emotion || '-';
        secondEmotion.textContent = response.second_emotion || '-';

        if (response.distress_percentage !== undefined) {
            const distressValue = response.distress_percentage.toFixed(2);
            distressPercentage.textContent = `${distressValue}%`;
            distressBarFill.style.width = `${distressValue}%`;
        }

        // Check if alert was triggered and maybe highlight if true
        if (response.alert_triggered) {
            topEmotion.style.color = 'red';
            secondEmotion.style.color = 'red';
        } else {
            topEmotion.style.color = '';
            secondEmotion.style.color = '';
        }
    };

    // Video Recording Functions
    const startRecording = () => {
        if (!stream) {
            alert('Camera must be turned on to record.');
            return;
        }

        recordedChunks = [];

        try {
            // Use MP4 container with H.264 video codec if supported
            const mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm';
            mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                uploadRecording();
            };

            // Start recording
            mediaRecorder.start(100); // Collect data in chunks of 100ms

            // Update UI
            startRecordingBtn.disabled = true;
            stopRecordingBtn.disabled = false;
            recordingStatus.textContent = 'Recording...';
            recordingStatus.style.color = 'red';

            // Reset previous results
            topEmotion.textContent = '-';
            secondEmotion.textContent = '-';
            distressPercentage.textContent = '0%';
            distressBarFill.style.width = '0%';

            // Start timer
            recordingStartTime = Date.now();
            updateRecordingTimer();
            recordingTimeInterval = setInterval(updateRecordingTimer, 1000);

            // Auto-stop after max time
            setTimeout(() => {
                if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                    stopRecording();
                }
            }, recordingMaxTime * 1000);

            console.log('Recording started');
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Could not start recording. Please try again.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();

            // Update UI
            startRecordingBtn.disabled = false;
            stopRecordingBtn.disabled = true;
            recordingStatus.textContent = 'Processing...';

            // Stop timer
            if (recordingTimeInterval) {
                clearInterval(recordingTimeInterval);
                recordingTimeInterval = null;
            }

            console.log('Recording stopped');
        }
    };

    const updateRecordingTimer = () => {
        if (!recordingStartTime) return;

        const elapsedSeconds = Math.floor((Date.now() - recordingStartTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
        const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

        recordingTimer.textContent = `${minutes}:${seconds}`;

        // Auto-stop if reached max time
        if (elapsedSeconds >= recordingMaxTime) {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                stopRecording();
            }
        }
    };

    // Upload video to the backend API
    const uploadRecording = async () => {
        try {
            recordingStatus.textContent = 'Analyzing emotions...';

            // Create a Blob from the recorded chunks
            const mimeType = mediaRecorder.mimeType || 'video/mp4';
            const blob = new Blob(recordedChunks, { type: mimeType });

            // Create a timestamp for the filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `emotion-recording-${timestamp}.mp4`;

            // Create FormData object and append the video file
            const formData = new FormData();
            formData.append('video', blob, filename);
            formData.append('student_id', student_id);
            // Send to the backend API with base_url
            const response = await fetch(`${base_url}/api/analyze-emotion`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Server response:', result);

            // Update UI with success message
            recordingStatus.textContent = 'Analysis complete!';
            recordingStatus.style.color = 'green';

            // Update emotion UI with the results from the server
            updateResultsUI(result);

            // Add download links if available
            if (result.report_path || result.chart_path) {
                const downloadContainer = document.createElement('div');
                downloadContainer.className = 'download-links';

                if (result.report_path) {
                    const reportLink = document.createElement('a');
                    reportLink.href = `${base_url}/api${result.report_path}`;
                    reportLink.target = '_blank';
                    reportLink.className = 'download-btn';
                    reportLink.textContent = 'Download Report';
                    downloadContainer.appendChild(reportLink);
                }

                if (result.chart_path) {
                    const chartLink = document.createElement('a');
                    chartLink.href = `${base_url}/api${result.chart_path}`;
                    chartLink.target = '_blank';
                    chartLink.className = 'download-btn';
                    chartLink.textContent = 'View Chart';
                    downloadContainer.appendChild(chartLink);
                }

                // Remove any existing download links
                const existingLinks = document.querySelector('.download-links');
                if (existingLinks) {
                    existingLinks.remove();
                }

                emotionAnalysisContent.appendChild(downloadContainer);
            }

            // Reset timer display after a delay
            setTimeout(() => {
                recordingStatus.textContent = '';
            }, 5000);

        } catch (error) {
            console.error('Error uploading recording:', error);
            recordingStatus.textContent = 'Error: ' + error.message;
            recordingStatus.style.color = 'red';

            // Reset status after a delay
            setTimeout(() => {
                recordingStatus.textContent = '';
            }, 5000);
        }
    };

    // Event Listeners
    cameraToggle.addEventListener('change', () => {
        if (cameraToggle.checked) {
            startCamera();
        } else {
            stopCamera();
        }
    });

    startRecordingBtn.addEventListener('click', startRecording);
    stopRecordingBtn.addEventListener('click', stopRecording);

    // Stop camera when page unloads
    window.addEventListener('beforeunload', stopCamera);
});