// Elements
const musicContainer = document.querySelector(".player");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const coverEl = document.getElementById("cover");
const playlistEl = document.getElementById("playlist");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");

// SONGS: edit this list to match your files in /music and /images
const songs = [
  {
    id: "Thangapoovey",
    title: "Thangapoovey",
    artist: "Anirudh",
    file: "Thangapoovey.mp3",
    cover: "vibe.jpg"
  },
  {
    id: "Vazhiyiren",
    title: "Vazhiyiren",
    artist: "Anirudh",
    file: "Vazhiyiren.mp3",
    cover: "vibe.jpg"
  },
   {
    id: "Why_This_Kolaveri_Di",
    title: "Why_This_Kolaveri_Di",
    artist: "Anirudh",
    file: "Why_This_Kolaveri_Di.mp3",
    cover: "vibe.jpg"
  }
  // add more objects here: { id, title, artist, file, cover }
];

// Set initial song index
let songIndex = 0;

// Build playlist UI
function buildPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((s, idx) => {
    const li = document.createElement("li");
    li.dataset.index = idx;
    li.innerHTML = `
      <div class="meta">
        <img src="./images/${s.cover}" alt="${s.title}" />
        <div class="text">
          <strong>${s.title}</strong>
          <small style="color:#666">${s.artist}</small>
        </div>
      </div>
      <div class="play-icon"><i class="fa fa-play"></i></div>
    `;
    li.addEventListener("click", () => {
      loadSongByIndex(idx);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

// Load song into UI
function loadSong(songObj) {
  titleEl.innerText = songObj.title;
  artistEl.innerText = songObj.artist || "";
  audio.src = `./music/${songObj.file}`;
  coverEl.src = `./images/${songObj.cover}`;
  updatePlaylistHighlight();
}

// Load by index
function loadSongByIndex(i) {
  songIndex = i;
  loadSong(songs[songIndex]);
}

// Play / Pause
function playSong() {
  musicContainer.classList.add("playing");
  playBtn.querySelector("i").classList.remove("fa-play");
  playBtn.querySelector("i").classList.add("fa-pause");
  audio.play();
  updatePlaylistHighlight();
}
function pauseSong() {
  musicContainer.classList.remove("playing");
  playBtn.querySelector("i").classList.add("fa-play");
  playBtn.querySelector("i").classList.remove("fa-pause");
  audio.pause();
}

// Prev / Next
function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSongByIndex(songIndex);
  playSong();
}
function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSongByIndex(songIndex);
  playSong();
}

// Progress bar update
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  if (!duration) return;
  const percent = (currentTime / duration) * 100;
  progress.style.width = `${percent}%`;
  currentTimeEl.innerText = formatTime(currentTime);
  durationEl.innerText = formatTime(duration);
}
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (duration) audio.currentTime = (clickX / width) * duration;
}
function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Update playlist highlight
function updatePlaylistHighlight() {
  document.querySelectorAll("#playlist li").forEach((li) => li.classList.remove("playing"));
  const active = document.querySelector(`#playlist li[data-index="${songIndex}"]`);
  if (active) active.classList.add("playing");
}

// Volume control
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// EVENT LISTENERS
playBtn.addEventListener("click", () => {
  const isPlaying = musicContainer.classList.contains("playing");
  if (isPlaying) pauseSong();
  else playSong();
});
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextSong);
progressContainer.addEventListener("click", setProgress);

// Initialize
buildPlaylist();
loadSongByIndex(songIndex);
audio.volume = parseFloat(volumeSlider.value || 1);
