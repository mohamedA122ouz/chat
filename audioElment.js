class CustomAudioElement {
    static i = 0;
    audioElment;
    #waveFormId;
    #durationDisplay;
    #audioURL;
    #wavesurfer;
    #playButton;
    #duration;
    constructor(senderId, audioURL,) {
        const { audioContainer, durationDisplay, waveFormId, playButton } = this.#createElement(senderId);
        this.#durationDisplay = durationDisplay;
        this.#waveFormId = waveFormId;
        this.audioElment = audioContainer;
        this.#audioURL = audioURL;
        this.#playButton = playButton;
    }
    loadWaves(color="white",progressColor='#1db954') {
        // Initialize WaveSurfer
        const wavesurfer = WaveSurfer.create({
            container: "#" + this.#waveFormId,
            waveColor: color,
            progressColor: progressColor, // Green progress color
            cursorColor: 'transparent',
            barWidth: 2,
            barGap: 2,
            height: 30,
            responsive: true
        });

        // Update duration when metadata loads
        wavesurfer.on('ready', () => {
            this.#durationDisplay.textContent = this.#formatTime(wavesurfer.getDuration());
            this.#duration = this.#formatTime(wavesurfer.getDuration());
        });

        // Update timestamp while playing
        wavesurfer.on('audioprocess', () => {
            this.#durationDisplay.textContent = this.#formatTime(wavesurfer.getCurrentTime());
        });
        wavesurfer.on('finish', () => {
            this.#playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
            </svg>`;
        });
        wavesurfer.load(this.#audioURL);
        this.#wavesurfer = wavesurfer;
    }
    #formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }
    #createElement(senderId) {
        const audioContainer = document.createElement("div");
        const waveForm = document.createElement("div");
        audioContainer.classList.add("audio-container", "AContainer" + senderId + CustomAudioElement.i);
        const button = document.createElement("button");
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
            </svg>`;
        button.classList.add("play-btn", "Pbtn" + senderId + CustomAudioElement.i);
        waveForm.id = "waveForm" + CustomAudioElement.i + senderId;
        waveForm.style.width = "100%";
        const time = document.createElement("span");
        time.classList.add("timeStamp", "tstamp" + senderId + CustomAudioElement.i);
        audioContainer.appendChild(button);
        audioContainer.appendChild(waveForm);
        audioContainer.appendChild(time);
        // Play/Pause functionality
        button.addEventListener("click", () => {
            this.#wavesurfer.playPause();
            button.innerHTML = this.#wavesurfer.isPlaying() ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
</svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
            </svg>`;
        });
        return { audioContainer: audioContainer, waveFormId: "waveForm" + CustomAudioElement.i++ + senderId, durationDisplay: time, playButton: button };
    }
}