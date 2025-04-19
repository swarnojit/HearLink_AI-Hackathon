const BASE_URL='https://2c81-150-242-149-133.ngrok-free.app';// Elements
const videoUrlInput = document.getElementById('video-url');
const loadUrlBtn = document.getElementById('load-url');
const videoFileInput = document.getElementById('video-file');
const videoPreview = document.getElementById('video-preview');
const videoPlayer = document.getElementById('video-player');
const detectedLanguage = document.getElementById('detected-language');
const outputLanguage = document.getElementById('output-language');
const processVideoBtn = document.getElementById('process-video');
const loadingElement = document.getElementById('loading');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const resultsContainer = document.getElementById('results-container');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const flipCardBtn = document.getElementById('flip-card');
const nextCardBtn = document.getElementById('next-card');
const prevCardBtn = document.getElementById('prev-card');
const currentFlashcard = document.getElementById('current-flashcard');
const cardCounter = document.getElementById('card-counter');
const checkAnswerBtn = document.getElementById('check-answer');
const nextQuestionBtn = document.getElementById('next-question');
const prevQuestionBtn = document.getElementById('prev-question');
const quizFeedback = document.getElementById('quiz-feedback');
const transcriptContent = document.getElementById('transcript-content');
const summaryContent = document.getElementById('summary-content');
const notesContent = document.getElementById('notes-content');
const quizContainer = document.getElementById('quiz-container');
const flashcardQuestion = document.getElementById('flashcard-question');
const flashcardAnswer = document.getElementById('flashcard-answer');
const generateTranscriptBtn = document.getElementById('generate-transcript');
const generateSummaryBtn = document.getElementById('generate-summary');
const generateNotesBtn = document.getElementById('generate-notes');
const generateFlashcardsBtn = document.getElementById('generate-flashcards');
const generateQuizBtn = document.getElementById('generate-quiz');
const generateExercisesBtn = document.getElementById('generate-exercises');
const fillBlanksContent = document.getElementById('fill-blanks-content');
const shortAnswerContent = document.getElementById('short-answer-content');
const longAnswerContent = document.getElementById('long-answer-content');
const exercisesAnswers = document.getElementById('exercises-answers');
const toggleAnswersBtn = document.getElementById('toggle-answers');

// Sample data - would be replaced with actual API responses
const sampleTranscript = `
    [00:00:05] Welcome to this lecture on effective study techniques.
    [00:00:10] Today we'll be covering three main approaches to improve your learning.
    [00:00:20] The first technique is spaced repetition, which involves reviewing information at increasing intervals.
    [00:01:05] Research shows this is much more effective than cramming everything in one session.
    [00:01:30] The second technique is active recall, where you test yourself on the material rather than simply re-reading it.
    [00:02:15] This forces your brain to retrieve information, strengthening neural pathways.
    [00:02:45] The third technique is elaboration, where you connect new information to what you already know.
    [00:03:20] This creates multiple pathways to access the information later.
    [00:04:00] Let's now discuss how to implement these techniques in your daily study routine.
    [00:04:30] Start by breaking down your study material into manageable chunks.
    [00:05:10] Then create a schedule where you review the material at increasing intervals.
    [00:05:45] Use active recall by creating flashcards or practice tests for yourself.
    [00:06:20] Finally, practice elaboration by explaining concepts in your own words or teaching them to someone else.
    [00:07:00] In conclusion, combining these three techniques will significantly improve your learning efficiency.
    [00:07:30] Thank you for your attention, and I wish you success in your studies.
`;

const sampleSummary = `
    <p>This lecture focuses on three evidence-based study techniques to enhance learning efficiency:</p>
    
    <p><strong>1. Spaced Repetition:</strong> Rather than cramming, information should be reviewed at gradually increasing intervals. This approach strengthens memory retention by reinforcing neural connections over time.</p>
    
    <p><strong>2. Active Recall:</strong> Testing yourself on material is more effective than passive re-reading. This technique forces the brain to retrieve information actively, which strengthens memory pathways and helps identify knowledge gaps.</p>
    
    <p><strong>3. Elaboration:</strong> Connecting new information to existing knowledge creates multiple pathways for memory retrieval. This can be done by explaining concepts in your own words or teaching others.</p>
    
    <p>The lecturer recommends implementing these techniques by breaking study material into manageable chunks, creating a spaced review schedule, using flashcards for active recall, and practicing elaboration through teaching or explanation.</p>
`;

const sampleNotes = `
    <h5>Effective Study Techniques</h5>
    <ul>
        <li>Spaced Repetition
            <ul>
                <li>Review information at gradually increasing intervals</li>
                <li>More effective than cramming</li>
                <li>Strengthens neural pathways over time</li>
            </ul>
        </li>
        <li>Active Recall
            <ul>
                <li>Test yourself instead of re-reading</li>
                <li>Forces brain to retrieve information</li>
                <li>Identifies knowledge gaps</li>
                <li>Can use flashcards or practice tests</li>
            </ul>
        </li>
        <li>Elaboration
            <ul>
                <li>Connect new information to existing knowledge</li>
                <li>Creates multiple retrieval pathways</li>
                <li>Explain concepts in your own words</li>
                <li>Teach concepts to others</li>
            </ul>
        </li>
    </ul>
    
    <h5>Implementation</h5>
    <ul>
        <li>Break down material into manageable chunks</li>
        <li>Create a schedule with increasing review intervals</li>
        <li>Use flashcards for active recall practice</li>
        <li>Explain concepts in your own words</li>
    </ul>
`;

const sampleFlashcards = [
    {
        question: "What is spaced repetition?",
        answer: "A study technique that involves reviewing information at gradually increasing intervals, which is more effective than cramming."
    },
    {
        question: "What is active recall?",
        answer: "Testing yourself on material rather than simply re-reading it, which forces your brain to retrieve information and strengthens neural pathways."
    },
    {
        question: "What is elaboration?",
        answer: "Connecting new information to what you already know, creating multiple pathways to access the information later."
    },
    {
        question: "How should you implement spaced repetition?",
        answer: "Break down material into manageable chunks and create a schedule where you review the material at increasing intervals."
    },
    {
        question: "How should you practice active recall?",
        answer: "Create and use flashcards or practice tests for yourself."
    },
    {
        question: "How should you practice elaboration?",
        answer: "Explain concepts in your own words or teach them to someone else."
    }
];

const sampleQuiz = [
    {
        question: "Which study technique involves reviewing information at increasing intervals?",
        options: ["Active recall", "Spaced repetition", "Elaboration", "Mind mapping"],
        correctAnswer: 1
    },
    {
        question: "What is the main benefit of active recall?",
        options: [
            "It's less time-consuming than other methods",
            "It's easier than re-reading material",
            "It forces your brain to retrieve information, strengthening neural pathways",
            "It helps you memorize large amounts of text quickly"
        ],
        correctAnswer: 2
    },
    {
        question: "Elaboration involves:",
        options: [
            "Reviewing material at fixed intervals",
            "Testing yourself frequently",
            "Writing extensive notes",
            "Connecting new information to what you already know"
        ],
        correctAnswer: 3
    },
    {
        question: "According to the lecture, which is more effective for learning?",
        options: [
            "Cramming everything in one session",
            "Spaced repetition over time",
            "Reading the material multiple times",
            "Highlighting key passages"
        ],
        correctAnswer: 1
    },
    {
        question: "Which is recommended as a way to practice elaboration?",
        options: [
            "Creating detailed flashcards",
            "Reviewing material daily",
            "Explaining concepts in your own words",
            "Using colored pens for notes"
        ],
        correctAnswer: 2
    }
];

const sampleExercises = {
    fillBlanks: `
        <div class="exercise-item">
            <p>1. ____________ involves reviewing information at gradually increasing intervals.</p>
            <input type="text" class="fill-blank-input" data-answer="Spaced repetition">
        </div>
        <div class="exercise-item">
            <p>2. ____________ forces your brain to retrieve information, strengthening neural pathways.</p>
            <input type="text" class="fill-blank-input" data-answer="Active recall">
        </div>
        <div class="exercise-item">
            <p>3. ____________ creates multiple pathways to access information by connecting new information to existing knowledge.</p>
            <input type="text" class="fill-blank-input" data-answer="Elaboration">
        </div>
    `,
    shortAnswer: `
        <div class="exercise-item">
            <p>1. What are the benefits of spaced repetition compared to cramming?</p>
            <textarea class="short-answer-input" rows="3"></textarea>
        </div>
        <div class="exercise-item">
            <p>2. How can you implement active recall in your study routine?</p>
            <textarea class="short-answer-input" rows="3"></textarea>
        </div>
        <div class="exercise-item">
            <p>3. Why is elaboration an effective learning technique?</p>
            <textarea class="short-answer-input" rows="3"></textarea>
        </div>
    `,
    longAnswer: `
        <div class="exercise-item">
            <p>1. Create a study plan that incorporates all three learning techniques discussed in the lecture. Be specific about how you would implement each technique for a course you're currently taking.</p>
            <textarea class="long-answer-input" rows="6"></textarea>
        </div>
        <div class="exercise-item">
            <p>2. Compare and contrast the three study techniques. Which one do you think would be most effective for different types of learning material? Explain your reasoning.</p>
            <textarea class="long-answer-input" rows="6"></textarea>
        </div>
    `,
    answers: `
        <div class="answers-section">
            <h6>Fill in the Blanks</h6>
            <p>1. Spaced repetition</p>
            <p>2. Active recall</p>
            <p>3. Elaboration</p>
            
            <h6>Short Answer Questions</h6>
            <p>1. Spaced repetition strengthens memory retention by reinforcing neural connections over time, whereas cramming is less effective for long-term memory and understanding.</p>
            <p>2. You can implement active recall by creating flashcards, taking practice tests, closing your book and recalling information, or explaining concepts from memory.</p>
            <p>3. Elaboration is effective because it creates multiple pathways for memory retrieval by connecting new information to existing knowledge, making it easier to remember and understand concepts.</p>
            
            <h6>Long Answer Questions</h6>
            <p>Sample answers would vary based on individual experiences and courses.</p>
        </div>
    `
};

// Variables
let currentFlashcardIndex = 0;
let currentQuizIndex = 0;
let selectedOption = null;
let videoLoaded = false;
let hasGeneratedContent = {
    transcript: false,
    summary: false,
    notes: false,
    flashcards: false,
    quiz: false,
    exercises: false
};

// Functions
function showTab(tabId) {
    // Hide all tabs
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Update tabs
    tabs.forEach(tab => {
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function loadVideo(url) {
    // Clear any previously uploaded file
    videoFileInput.value = '';

    // In a real app, this would validate and process the URL
    if (!url) {
        alert('Please enter a valid URL');
        return;
    }

    try {
        // For YouTube URLs, we may want to show a preview if possible
        // This depends on your implementation and the YouTube API

        // For now, we'll just display a placeholder or the URL
        videoPlayer.src = ''; // Clear any previous video

        // Perhaps display a YouTube thumbnail if possible
        // videoPlayer.poster = `https://img.youtube.com/vi/${getYouTubeID(url)}/0.jpg`;

        videoPreview.style.display = 'block';
        videoLoaded = true;
        videoUrlInput.value = url; // Ensure the URL is in the input field

        // Simulate language detection
        showLanguageDetection();
    } catch (error) {
        alert('Error loading video. Please try again with a valid URL.');
        console.error('Error loading video:', error);
    }
}


// Helper function to format the transcript nicely
function formatTranscript(transcript) {
    // If transcript is an array, format each entry
    if (Array.isArray(transcript)) {
        return transcript.map(entry => {
            // Format based on your API response structure
            // Assuming each entry has a timestamp and text
            if (entry.timestamp && entry.text) {
                return `[${entry.timestamp}] ${entry.text}`;
            } else {
                return entry;
            }
        }).join('<br>');
    }
    // If transcript is a string, return as is
    else if (typeof transcript === 'string') {
        return transcript;
    }
    // If transcript is an object with a different structure
    else {
        console.log('Unexpected transcript format:', transcript);
        return JSON.stringify(transcript, null, 2);
    }
}

// Helper function to extract YouTube video ID from URL (if needed)
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function showLanguageDetection() {
    detectedLanguage.innerHTML = '<option value="">Detecting language...</option>';
    detectedLanguage.disabled = true;
    
    // Simulate language detection with a delay
    setTimeout(() => {
        detectedLanguage.innerHTML = '<option value="en" selected>English (detected)</option>';
    }, 1500);
}

function loadVideoFile(file) {
    if (!file) {
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
    }
    
    const url = URL.createObjectURL(file);
    videoPlayer.src = url;
    videoPreview.style.display = 'block';
    videoLoaded = true;
    
    // Simulate language detection
    showLanguageDetection();
}

async function processVideo() {
    if (!videoLoaded) {
        alert('Please load a video first');
        return;
    }

    // Get target language
    const targetLanguage = outputLanguage.value;

    // Show loading state
    loadingElement.style.display = 'flex';
    progressBar.style.display = 'block';
    let progress = 0;
    progressFill.style.width = `${progress}%`;

    // Reset content generation status
    Object.keys(hasGeneratedContent).forEach(key => {
        hasGeneratedContent[key] = false;
    });

    // Start a progress simulation for better UX
    const progressInterval = setInterval(() => {
        // Increment progress gradually but stay under 90% until we get the real response
        if (progress < 90) {
            progress += 3;
            progressFill.style.width = `${progress}%`;
        }
    }, 500);

    try {
        let response;

        // Check if we're processing a URL or a file
        if (videoUrlInput.value) {
            // Handle YouTube link
            const formData = new FormData();
            formData.append('youtube_link', videoUrlInput.value);
            formData.append('target_language', targetLanguage);

            response = await fetch(`${BASE_URL}/api/transcribelink`, {
                method: 'POST',
                body: formData
            });
        } else if (videoFileInput.files && videoFileInput.files[0]) {
            // Handle video file upload
            const formData = new FormData();
            formData.append('video', videoFileInput.files[0]);
            formData.append('target_language', targetLanguage);

            response = await fetch(`${BASE_URL}/api/transcribe`, {
                method: 'POST',
                body: formData
            });
        } else {
            throw new Error('No video file or URL provided');
        }

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        // Get the response data
        const data = await response.json();
        // Clear interval and complete progress
        clearInterval(progressInterval);
        progress = 100;
        progressFill.style.width = `${progress}%`;

        // Hide loading state
        loadingElement.style.display = 'none';

        // Process transcript data
        if (data ) {
            console.log(data)
            // Store the transcript data globally so other functions can use it
            window.transcriptData = data;

            // Format and display the transcript
            transcriptContent.innerHTML = formatTranscript(data.translated_transcript);
            hasGeneratedContent.transcript = true;

            // Show results and other empty content placeholders
            showResults();
        } else {
            alert('No transcript data returned from the server');
        }
    } catch (error) {
        // Handle errors
        clearInterval(progressInterval);
        loadingElement.style.display = 'none';
        alert('Error processing video: ' + error.message);
        console.error('Error processing video:', error);
    }
}

// Helper function to format the transcript nicely


function showResults() {
    resultsContainer.style.display = 'block';
    
    // Show only transcript initially, other content will be generated on demand
    //transcriptContent.innerHTML = sampleTranscript;
    hasGeneratedContent.transcript = true;
    
    // Clear other content
    summaryContent.innerHTML = '<p>Click "Generate Summary" to create a summary for this video.</p>';
    notesContent.innerHTML = '<p>Click "Generate Notes" to create study notes for this video.</p>';
    quizContainer.innerHTML = '<p>Click "Generate Quiz" to create an interactive quiz for this video.</p>';
    fillBlanksContent.innerHTML = '';
    shortAnswerContent.innerHTML = '';
    longAnswerContent.innerHTML = '';
    exercisesAnswers.innerHTML = '';
    
    // Reset flashcards
    showFlashcard(0);
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

function generateContent(contentType) {
    const loadingHTML = '<div class="loading-inline"><div class="loading-spinner-small"></div><p>Generating content...</p></div>';
    const generateHeaders = () => {
        const headers = {};
        if (BASE_URL.includes('ngrok')) {
            headers['ngrok-skip-browser-warning'] = 'true';
        }
        return headers;
    };
    switch (contentType) {
        case 'transcript':
            if (!hasGeneratedContent.transcript) {
                transcriptContent.innerHTML = loadingHTML;
                setTimeout(() => {
                    transcriptContent.innerHTML = sampleTranscript;
                    hasGeneratedContent.transcript = true;
                }, 1500);
            }
            break;

       case 'summary':
            fetch(`${BASE_URL}/api/summary`, {
                method: 'GET',
                headers: generateHeaders()
            })
                .then(res => res.json())
                .then(data => {
                    summaryContent.innerHTML = data.summary;
                    hasGeneratedContent.summary = true;
                })
                .catch(err => {
                    summaryContent.innerHTML = '<p>Error loading summary.</p>';
                    console.error('Error fetching summary:', err);
                });
            break;

        case 'notes':
            if (!hasGeneratedContent.notes) {
                notesContent.innerHTML = loadingHTML;
                setTimeout(() => {
                    if (window.transcriptData?.detailed_notes) {
                        notesContent.innerHTML = window.transcriptData.detailed_notes;
                        hasGeneratedContent.notes = true;
                    } else {
                        notesContent.innerHTML = '<p>No notes available yet. Please process a video first.</p>';
                    }
                }, 1200); // Slight delay for smoother UX
            }
            break;

        case 'flashcards':
            if (!hasGeneratedContent.flashcards) {
                const flashcardContainer = document.querySelector('.flashcard-container');
                flashcardContainer.style.display = 'none';
                document.querySelector('#flashcards .action-options').insertAdjacentHTML('afterend', loadingHTML);

                fetch(`${BASE_URL}/api/flashcards`, {
                    method: 'GET',
                    headers: generateHeaders()
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log('Flashcards data received:', data);

                        if (data && data.flashcards) {
                            window.flashcards = data.flashcards;
                            showFlashcard(0);
                            document.querySelector('#flashcards .loading-inline').remove();
                            flashcardContainer.style.display = 'block';
                            hasGeneratedContent.flashcards = true;
                        } else {
                            console.error('No flashcards data found:', data);
                            document.querySelector('#flashcards .loading-inline').remove();
                            flashcardContainer.innerHTML = '<p>No flashcards available.</p>';
                        }
                    })
                    .catch(err => {
                        document.querySelector('#flashcards .loading-inline').remove();
                        flashcardContainer.innerHTML = '<p>Error loading flashcards.</p>';
                        console.error('Error fetching flashcards:', err);
                    });
            }
            break;

        case 'quiz':
            if (!hasGeneratedContent.quiz) {
                quizContainer.innerHTML = loadingHTML;
                document.querySelector('.quiz-controls').style.display = 'none';

                fetch(`${BASE_URL}/api/quiz`, {
                    method: 'GET',
                    headers: generateHeaders()
                })
                    .then(res => {
                        console.log("Quiz response status:", res.status);
                        return res.json();
                    })
                    .then(data => {
                        console.log("Quiz data received:", data);

                        if (data.error) {
                            quizContainer.innerHTML = `<p>${data.error}</p>`;
                            return;
                        }

                        if (!data || !Array.isArray(data)) {
                            quizContainer.innerHTML = `<p>Error: Invalid quiz data received</p>`;
                            console.error('Invalid quiz data received:', data);
                            return;
                        }

                        window.quizData = data;
                        hasGeneratedContent.quiz = true;

                        quizContainer.innerHTML = '';
                        showQuizQuestion(0);
                        document.querySelector('.quiz-controls').style.display = 'flex';
                    })
                    .catch(err => {
                        quizContainer.innerHTML = '<p>Error loading quiz.</p>';
                        console.error('Error fetching quiz:', err);
                    });
            }
            break;

        case 'exercises':
            if (!hasGeneratedContent.exercises) {
                fillBlanksContent.innerHTML = loadingHTML;
                shortAnswerContent.innerHTML = '';
                longAnswerContent.innerHTML = '';
                exercisesAnswers.innerHTML = '';
                toggleAnswersBtn.style.display = 'none';

                fetch(`${BASE_URL}/api/exercise`, {
                    method: 'GET',
                    headers: generateHeaders()
                })
                    .then(res => res.json())
                    .then(data => {
                        fillBlanksContent.innerHTML = '<h3>Fill in the Blanks</h3>' + data.fillBlanks.map((q, i) => `
                            <p>${i + 1}. ${q.replace('_____', '<input type="text" class="fill-blank-input" data-index="${i}">')}</p>
                        `).join('');

                        shortAnswerContent.innerHTML = '<h3>Short Answer Questions</h3>' + data.shortAnswer.map((q, i) => `
                            <p>${i + 1}. ${q}</p>
                        `).join('');

                        longAnswerContent.innerHTML = '<h3>Long Answer Questions</h3>' + data.longAnswer.map((q, i) => `
                            <p>${i + 1}. ${q}</p>
                        `).join('');

                        exercisesAnswers.innerHTML = `
                            <div id="fillBlankAnswers"><h4>Fill in the Blanks Answers:</h4>
                                <ul>${data.answers.fillBlanks.map((ans, i) => `<li>${i + 1}. ${ans}</li>`).join('')}</ul>
                            </div>
                            <div id="shortAnswerAnswers"><h4>Short Answers:</h4>
                                <ul>${data.answers.shortAnswer.map((ans, i) => `<li>${i + 1}. ${ans}</li>`).join('')}</ul>
                            </div>
                            <div id="longAnswerAnswers"><h4>Long Answers:</h4>
                                <ol>${data.answers.longAnswer.map((ans, i) => `<li>${ans}</li>`).join('')}</ol>
                            </div>
                        `;

                        toggleAnswersBtn.style.display = 'block';
                        document.querySelectorAll('.fill-blank-input').forEach(input => {
                            input.addEventListener('blur', validateFillBlank);
                        });

                        hasGeneratedContent.exercises = true;
                    })
                    .catch(err => {
                        fillBlanksContent.innerHTML = '<p>Error loading exercises.</p>';
                        console.error('Error fetching exercises:', err);
                    });
            }
            break;

        default:
            console.error('Unknown content type:', contentType);
            break;
    }
}



function validateFillBlank(event) {
    const input = event.target;
    const correctAnswer = input.dataset.answer;
    const userAnswer = input.value.trim();
    
    if (userAnswer === '') {
        input.classList.remove('correct', 'incorrect');
        return;
    }
    
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        input.classList.add('correct');
        input.classList.remove('incorrect');
    } else {
        input.classList.add('incorrect');
        input.classList.remove('correct');
    }
}

function showFlashcard(index) {
    if (!hasGeneratedContent.flashcards || !window.flashcards || window.flashcards.length === 0) {
        flashcardQuestion.textContent = "Generate flashcards first";
        flashcardAnswer.textContent = "Click the 'Generate Flashcards' button to create flashcards for this video";
        cardCounter.textContent = "No flashcards available";
        return;
    }

    if (index < 0) index = window.flashcards.length - 1;
    if (index >= window.flashcards.length) index = 0;

    currentFlashcardIndex = index;

    const [questionPart, answerPart] = window.flashcards[index].split(":").map(s => s.trim());

    flashcardQuestion.textContent = questionPart.replace(/\*\*/g, '') || "Question not found";
    flashcardAnswer.textContent = answerPart?.replace(/\*\*/g, '') || "Answer not found";
    cardCounter.textContent = `Card ${index + 1} of ${window.flashcards.length}`;
    currentFlashcard.classList.remove('flipped');

    console.log(`Flashcard ${index + 1}:`, window.flashcards[index]);
}


function flipCard() {
    if (hasGeneratedContent.flashcards) {
        currentFlashcard.classList.toggle('flipped');
    }
}

function showQuizQuestion(index) {
    console.log('showQuizQuestion called with index:', index);
    console.log('window.quizData:', window.quizData);

    if (!hasGeneratedContent.quiz) return;

    if (!window.quizData || !Array.isArray(window.quizData)) {
        console.error('quizData is undefined or not an array');
        return;
    }

    // Ensure valid index
    if (index < 0) index = 0;
    if (index >= window.quizData.length) index = window.quizData.length - 1;

    currentQuizIndex = index;
    selectedOption = null;
    quizFeedback.style.display = 'none';

    // Get the current question from quizData
    const quiz = window.quizData[index];

    // Clean up the question text - remove any numbering that might be in the data
    let questionText = quiz.question;
    questionText = questionText.replace(/^\d+\.\s*/, ''); // Remove leading numbers like "1. "

    let html = `
        <div class="quiz-question">
            <h5>${index + 1}. ${questionText}</h5>
            <div class="quiz-options">
    `;

    // Generate options dynamically with cleaned text
    quiz.options.forEach((option, i) => {
        // Clean up option text - remove any duplicated letter prefixes
        let optionText = option;
        optionText = optionText.replace(/^[A-D][\)\.]\s*[A-D][\)\.]\s*/, ''); // Remove patterns like "A) A)"
        optionText = optionText.replace(/^[A-D][\)\.]\s*/, ''); // Remove remaining patterns like "A) "

        html += `
            <div class="quiz-option" data-index="${i}">
                ${String.fromCharCode(65 + i)}. ${optionText}
            </div>
        `;
    });

    html += `
            </div>
        </div>
        <div style="text-align: center; margin-top: 10px;">Question ${index + 1} of ${window.quizData.length}</div>
    `;

    quizContainer.innerHTML = html;

    // Add event listeners to options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            selectedOption = parseInt(this.dataset.index);
        });
    });

    // Update button states
    prevQuestionBtn.disabled = index === 0;
    nextQuestionBtn.disabled = index === window.quizData.length - 1;
}


function checkAnswer() {
    if (!hasGeneratedContent.quiz) {
        alert('Please generate a quiz first');
        return;
    }

    if (selectedOption === null) {
        alert('Please select an answer first');
        return;
    }

    // Get the correct answer for the current question
    const correctAnswerLetter = window.quizData[currentQuizIndex].answer; // This is "B", "C", etc.

    // Convert the letter to an index (A=0, B=1, C=2, D=3)
    const correctAnswerIndex = correctAnswerLetter.charCodeAt(0) - 65;

    const options = document.querySelectorAll('.quiz-option');

    // Reset selected options
    options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));

    // Check if selected option is correct
    if (selectedOption === correctAnswerIndex) {
        options[selectedOption].classList.add('correct');
        quizFeedback.textContent = 'Correct! Well done!';
        quizFeedback.className = 'quiz-feedback correct';
    } else {
        options[selectedOption].classList.add('incorrect');
        options[correctAnswerIndex].classList.add('correct');
        quizFeedback.textContent = 'Incorrect. The correct answer is shown above.';
        quizFeedback.className = 'quiz-feedback incorrect';
    }

    quizFeedback.style.display = 'block';
}


function toggleAnswers() {
    exercisesAnswers.classList.toggle('hidden');
    
    if (!exercisesAnswers.classList.contains('hidden')) {
        exercisesAnswers.scrollIntoView({ behavior: 'smooth' });
    }
}

function downloadContent(type, format) {
    // In a real app, this would actually create and download the file
    alert(`Downloading ${type} as ${format} format`);
}

// Event Listeners
loadUrlBtn.addEventListener('click', () => {
    loadVideo(videoUrlInput.value);
});

videoFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        loadVideoFile(e.target.files[0]);
    }
});

// Make the file upload area handle drag and drop
const fileUploadArea = document.querySelector('.file-upload');
fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadVideoFile(e.dataTransfer.files[0]);
    }
});

fileUploadArea.addEventListener('click', () => {
    videoFileInput.click();
});

processVideoBtn.addEventListener('click', processVideo);

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        showTab(tab.dataset.tab);
    });
});

// Generation buttons
generateTranscriptBtn.addEventListener('click', () => generateContent('transcript'));
generateSummaryBtn.addEventListener('click', () => generateContent('summary'));
generateNotesBtn.addEventListener('click', () => generateContent('notes'));
generateFlashcardsBtn.addEventListener('click', () => generateContent('flashcards'));
generateQuizBtn.addEventListener('click', () => generateContent('quiz'));
generateExercisesBtn.addEventListener('click', () => generateContent('exercises'));

flipCardBtn.addEventListener('click', flipCard);
currentFlashcard.addEventListener('click', flipCard);

nextCardBtn.addEventListener('click', () => {
    showFlashcard(currentFlashcardIndex + 1);
});

prevCardBtn.addEventListener('click', () => {
    showFlashcard(currentFlashcardIndex - 1);
});

checkAnswerBtn.addEventListener('click', checkAnswer);

nextQuestionBtn.addEventListener('click', () => {
    showQuizQuestion(currentQuizIndex + 1);
});

prevQuestionBtn.addEventListener('click', () => {
    showQuizQuestion(currentQuizIndex - 1);
});

toggleAnswersBtn.addEventListener('click', toggleAnswers);

// Add event listeners for download buttons
document.querySelectorAll('.download-options button').forEach(button => {
    button.addEventListener('click', function() {
        const section = this.closest('.tab-content').id;
        const format = this.textContent.includes('TXT') ? 'TXT' : 
                      this.textContent.includes('SRT') ? 'SRT' : 
                      this.textContent.includes('PDF') ? 'PDF' : 
                      this.textContent.includes('DOCX') ? 'DOCX' : 'File';
        
        downloadContent(section, format);
    });
});

// Handle keyboard shortcuts for navigation
document.addEventListener('keydown', (e) => {
    const activeTab = document.querySelector('.tab-content.active').id;
    
    if (activeTab === 'flashcards' && hasGeneratedContent.flashcards) {
        if (e.key === 'ArrowLeft') {
            showFlashcard(currentFlashcardIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showFlashcard(currentFlashcardIndex + 1);
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            flipCard();
        }
    } else if (activeTab === 'quiz' && hasGeneratedContent.quiz) {
        if (e.key === 'ArrowLeft') {
            if (currentQuizIndex > 0) {
                showQuizQuestion(currentQuizIndex - 1);
            }
        } else if (e.key === 'ArrowRight') {
            if (currentQuizIndex < sampleQuiz.length - 1) {
                showQuizQuestion(currentQuizIndex + 1);
            }
        } else if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            if (optionIndex >= 0 && optionIndex < 4) {
                selectedOption = optionIndex;
                document.querySelectorAll('.quiz-option').forEach((opt, i) => {
                    opt.classList.toggle('selected', i === optionIndex);
                });
            }
        } else if (e.key === 'Enter') {
            checkAnswer();
        }
    }
});

// Output language change handler
outputLanguage.addEventListener('change', function() {
    // Reset content generation flags if language changes
    if (videoLoaded) {
        Object.keys(hasGeneratedContent).forEach(key => {
            hasGeneratedContent[key] = false;
        });

        alert(`Output language changed to ${this.options[this.selectedIndex].text}. Please regenerate content.`);
        
        // Clear current content
        summaryContent.innerHTML = '<p>Click "Generate Summary" to create a summary for this video.</p>';
        notesContent.innerHTML = '<p>Click "Generate Notes" to create study notes for this video.</p>';
        quizContainer.innerHTML = '<p>Click "Generate Quiz" to create an interactive quiz for this video.</p>';
        
        // Keep transcript as it's the base content
        if (hasGeneratedContent.transcript) {
            generateContent('transcript');
        }
    }
});

// Initialize
progressBar.style.display = 'none';
resultsContainer.style.display = 'none';

// Add CSS for loading animation during content generation
const style = document.createElement('style');
style.textContent = `
    .loading-inline {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        flex-direction: column;
    }
    
    .loading-spinner-small {
        width: 30px;
        height: 30px;
        border: 3px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: #3498db;
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 10px;
    }
    
    .dragover {
        border-color: #3498db;
        background-color: rgba(52, 152, 219, 0.1);
    }
    
    .fill-blank-input.correct {
        border-color: #2ecc71;
        background-color: rgba(46, 204, 113, 0.1);
    }
    
    .fill-blank-input.incorrect {
        border-color: #e74c3c;
        background-color: rgba(231, 76, 60, 0.1);
    }
`;

document.head.appendChild(style);