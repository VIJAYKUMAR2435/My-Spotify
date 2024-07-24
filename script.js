console.log('Lets write javascript');
let currentSong = new Audio();
let songs = [];
let currFolder = 'ncs';

// Manually list the songs
const songFiles = {
  'ncs': [
    'Dekha Tenu Pehli Pehli.mp3',
    'Ek Hazaron Mein-Shreya.mp3',
    '_Raghupati Raghav.mp3',
    'Maai Ni Maai.mp3',
    'The Devi Mashup Navratri.mp3',
    
    // Add all your songs here
  ],
  'cs': [
    'Avadh Mein Raghurai.mp3',
    '_Raghupati Raghav.mp3',
    'Maai Ni Maai.mp3',
   'Woh Shri Ram Hain.mp3',
   'Teri Baaton Mein Aisa Uljha Jiya.mp3'
    // Add all your songs here
  ],
  
};

function secondsToMinuteSeconds(seconds, useDoubleColons = false) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60); // Round to the nearest second

  const separator = useDoubleColons ? '::' : ':';
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${minutes}${separator}${formattedSeconds}`;
}

function getSongs(folder) {
  currFolder = folder;
  songs = songFiles[folder] || [];
  console.log(`Loading songs from folder: ${currFolder}`, songs);

  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += `<li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
              <div>${song.replaceAll("%20", " ")}</div>
              <div>Artist</div>
            </div>
            <div class="playnow">
              <span>Play Now</span>
              <img class="invert" src="play.svg" alt="">
            </div>
            </li>`;
  }
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = async (track, pause = false) => {
  const trackPath = `songs/${currFolder}/${track}`;
  const defaultTrack = `songs/default.mp3`;

  try {
    let response = await fetch(trackPath);
    if (!response.ok) {
      throw new Error('Track not found');
    }
    currentSong.src = trackPath;
    console.log(`Playing track: ${trackPath}`);
  } catch (error) {
    console.warn(`Could not find ${track}, playing default track instead.`);
    currentSong.src = defaultTrack;
  }

  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  getSongs("ncs");

  playMusic(songs[0], true);

  const play = document.querySelector("#play");
  const previous = document.querySelector("#previous");
  const next = document.querySelector("#next");

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    const currentTime = secondsToMinuteSeconds(currentSong.currentTime, true);
    const duration = secondsToMinuteSeconds(currentSong.duration, true);

    document.querySelector(".songtime").innerHTML = `${currentTime} / ${duration}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").pop());
    console.log("Current index:", index);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1]);
    } else {
      console.log("No previous song available.");
    }
  });

  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");
    let index = songs.indexOf(currentSong.src.split("/").pop());
    console.log("Current index:", index);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      console.log("No next song available.");
    }
  });

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value, "/100");
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    console.log(e.target);
    console.log("changing", e.target.src);
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
  });

  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(item.currentTarget.dataset.folder);
      playMusic(songs[0], true);
    });
  });
}

main();