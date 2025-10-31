let credits = 60; // Default free plan
let currentTab = 'all';
let projects = [
    {
        id: 1,
        title: 'AI Programming Tutorial Clip 1',
        type: 'ClipBasic',
        status: 'completed',
        viralityScore: 85,
        expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isNew: false,
        thumbnail: '🎬'
    },
    {
        id: 2,
        title: 'AI Programming Tutorial Clip 2',
        type: 'ClipBasic',
        status: 'completed',
        viralityScore: 92,
        expiry: new Date(Date.now() + 48 * 60 * 60 * 1000),
        isNew: false,
        thumbnail: '🎬'
    },
    {
        id: 3,
        title: 'Processing: YouTube Video Clips',
        type: 'ClipBasic',
        status: 'processing',
        viralityScore: null,
        expiry: null,
        isNew: true,
        thumbnail: '⏳'
    }
];

document.getElementById('plan').addEventListener('change', function() {
    const plan = this.value;
    if (plan === 'free') credits = 60;
    else if (plan === 'starter') credits = 150;
    else if (plan === 'pro') credits = 300;
    updateCreditsInfo();
});

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTab = this.dataset.tab;
        displayProjects();
    });
});

function updateCreditsInfo() {
    const creditsInfo = document.getElementById('credits-info');
    creditsInfo.textContent = `Credits: ${credits}`;
}

updateCreditsInfo();
displayProjects();

document.getElementById('clip-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('youtube-url').value;
    const videoId = extractVideoId(url);
    if (videoId) {
        if (credits >= 10) { // Assume 10 credits per generation
            credits -= 10;
            updateCreditsInfo();
            generateClips(videoId);
        } else {
            alert('Nedostatek kreditů. Vyberte vyšší plán nebo počkejte na reset.');
        }
    } else {
        alert('Neplatný YouTube odkaz. Zkontrolujte URL.');
    }
});

function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function generateClips(videoId) {
    // Simulace AI strategie: Rozdělit video na klipy na základě délky (předpokládaná délka 10 minut)
    // V reálné aplikaci by se použilo YouTube API pro získání skutečné délky
    const assumedDuration = 600; // 10 minut v sekundách
    const clipLength = 30; // 30 sekund na klip
    const clips = [];
    for (let start = 0; start < assumedDuration; start += clipLength) {
        const end = Math.min(start + clipLength, assumedDuration);
        const viralityScore = Math.floor(Math.random() * 100) + 1;
        const subtitles = generateSubtitles(); // Simulované titulky
        clips.push({
            title: `Klip ${Math.floor(start / clipLength) + 1}`,
            start: formatTime(start),
            end: formatTime(end),
            description: `Segment od ${formatTime(start)} do ${formatTime(end)}`,
            viralityScore: viralityScore,
            subtitles: subtitles,
            reframed: true // AI Reframing automaticky
        });
    }

    displayClips(clips, videoId);
}

function generateSubtitles() {
    const sampleSubtitles = [
        "Vítejte v tomto tutoriálu o AI programování.",
        "Dnes se podíváme na základní koncepty.",
        "Pojďme si ukázat praktický příklad.",
        "To je vše pro dnešní lekci."
    ];
    return sampleSubtitles[Math.floor(Math.random() * sampleSubtitles.length)];
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function displayProjects() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    let filteredProjects = projects;

    if (currentTab === 'processing') {
        filteredProjects = projects.filter(p => p.status === 'processing');
    } else if (currentTab === 'completed') {
        filteredProjects = projects.filter(p => p.status === 'completed');
    }

    filteredProjects.forEach(project => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'project-card';
        let statusText = '';
        let expiryText = '';

        if (project.status === 'processing') {
            statusText = 'Processing...';
        } else if (project.status === 'completed') {
            statusText = `Virality: ${project.viralityScore}/100`;
            expiryText = ` | Expires: ${project.expiry.toLocaleDateString()}`;
        }

        const newTag = project.isNew ? '<span class="new-tag">New</span>' : '';

        cardDiv.innerHTML = `
            <div class="project-thumbnail">${project.thumbnail}</div>
            <div class="project-info">
                <h3>${project.title} ${newTag}</h3>
                <p>${project.type} | ${statusText}${expiryText}</p>
                <p>Click to edit</p>
            </div>
        `;
        resultsDiv.appendChild(cardDiv);
    });
}

function displayClips(clips, videoId) {
    // Add new processing project
    const newProject = {
        id: Date.now(),
        title: 'Processing: New YouTube Video Clips',
        type: 'ClipBasic',
        status: 'processing',
        viralityScore: null,
        expiry: null,
        isNew: true,
        thumbnail: '⏳'
    };
    projects.push(newProject);
    displayProjects();

    // Simulate processing completion after 3 seconds
    setTimeout(() => {
        newProject.status = 'completed';
        newProject.viralityScore = Math.floor(Math.random() * 100) + 1;
        newProject.expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        newProject.thumbnail = '🎬';
        newProject.isNew = false;
        displayProjects();
    }, 3000);
}
