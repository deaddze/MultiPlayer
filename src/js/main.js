import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import { saveProgress , loadProgress} from './localStorage.js';
const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: 'pink',
  progressColor: 'purple',
});

const playPauseBtn = document.getElementById('playPauseBtn');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const volume = document.getElementById('volume');
const playlist = document.getElementById('playlist');

const tracks = [
  'audio/sample-9s.mp3',
  'audio/sample-12s.mp3',
  'audio/sample-15s.mp3',
  'audio/audio-4.wav',
  'audio/audio-5.wav',
];


let activeTrackIndex = loadProgress('activeTrackIndex')

function displayPlaylist() {
  playlist.innerHTML = '';
  tracks.forEach((track, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Трек ${index + 1}`;
      listItem.addEventListener('click', () => selectTrack(index));
      if (index === activeTrackIndex){
        listItem.classList.add('active');
      }
      playlist.appendChild(listItem);
  });
}

function selectTrack(index) {
  activeTrackIndex = index;
  saveProgress('activeTrackIndex', index)
  wavesurfer.load(tracks[index]);
  displayPlaylist();
}


wavesurfer.on('audioprocess', () => {
  const currentTimeSec = Math.floor(wavesurfer.getCurrentTime());
  const minutes = Math.floor(currentTimeSec / 60);
  const seconds = currentTimeSec % 60;
  currentTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

wavesurfer.on('ready', () => {
  const totalTimeSec = Math.floor(wavesurfer.getDuration());
  const minutes = Math.floor(totalTimeSec / 60);
  const seconds = totalTimeSec % 60;
  totalTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  progress.max = Math.floor(wavesurfer.getDuration());
});


playPauseBtn.addEventListener('click', () => {
  wavesurfer.playPause();
  playPauseBtn.textContent = wavesurfer.isPlaying() ? 'Pause' : 'Play';
});


progress.addEventListener('input', () => {
  wavesurfer.seekTo(progress.value / progress.max);
});

wavesurfer.on('audioprocess', () => {
  progress.value = wavesurfer.getCurrentTime();
});


volume.addEventListener('input', () => {
  wavesurfer.setVolume(volume.value / 100);
});

selectTrack(activeTrackIndex);
displayPlaylist();