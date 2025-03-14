const songs = [
    { title: 'Song 1', artist: 'Artist 1', category: 'pop', src: 'song1.mp3' },
    { title: 'Song 2', artist: 'Artist 2', category: 'rock', src: 'song2.mp3' },
    { title: 'Song 3', artist: 'Artist 3', category: 'jazz', src: 'song3.mp3' },
];

const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;

// DOM Elements
const playButton = document.getElementById('play');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const volumeSlider = document.getElementById('volume');
const playlistElement = document.getElementById('playlist');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');

// Initialize player
function init() {
    renderPlaylist(songs);
    loadSong(currentSongIndex);
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    
    playButton.addEventListener('click', togglePlay);
    prevButton.addEventListener('click', prevSong);
    nextButton.addEventListener('click', nextSong);
    volumeSlider.addEventListener('input', setVolume);
    progressContainer.addEventListener('click', setProgress);
    searchInput.addEventListener('input', filterSongs);
    filterSelect.addEventListener('change', filterSongs);
}

function renderPlaylist(songsArray) {
    playlistElement.innerHTML = songsArray
        .map((song, index) => `
            <div class="song-item ${index === currentSongIndex ? 'now-playing' : ''}" data-index="${index}">
                <div>
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
                <span>${song.category}</span>
            </div>
        `)
        .join('');

    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', () => playSong(parseInt(item.dataset.index)));
    });
}

function loadSong(index) {
    audio.src = songs[index].src;
    if (isPlaying) audio.play();
    highlightCurrentSong(index);
}

function togglePlay() {
    isPlaying = !isPlaying;
    playButton.textContent = isPlaying ? '⏸' : '▶';
    isPlaying ? audio.play() : audio.pause();
}

function updateProgress() {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function setVolume() {
    audio.volume = this.value;
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
}

function playSong(index) {
    currentSongIndex = index;
    loadSong(index);
    if (!isPlaying) togglePlay();
}

function highlightCurrentSong(index) {
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.toggle('now-playing', 
            parseInt(item.dataset.index) === index);
    });
}

function filterSongs() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    
    const filtered = songs.filter(song => {
        const matchesSearch = song.title.toLowerCase().includes(searchTerm) ||
                            song.artist.toLowerCase().includes(searchTerm);
        const matchesCategory = filterValue === 'all' || 
                             song.category === filterValue;
        return matchesSearch && matchesCategory;
    });

    renderPlaylist(filtered);
}

// Initialize the player
init();