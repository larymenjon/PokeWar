// Using free, reliable sound effects from Pixabay CDN for maximum compatibility
const sounds = {
    click: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_28d0d23832.mp3'),
    play: new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_c3b76c8a32.mp3'),
    win: new Audio('https://cdn.pixabay.com/audio/2022/11/17/audio_88d90709a0.mp3'),
    lose: new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_c33282c03e.mp3'),
};

// Set volumes to be less intrusive
sounds.click.volume = 0.7;
sounds.play.volume = 0.5;
sounds.win.volume = 0.5;
sounds.lose.volume = 0.5;

const playSound = (sound: HTMLAudioElement) => {
    // Allows the sound to be replayed before it finishes
    sound.currentTime = 0;
    sound.play().catch(error => {
        // More descriptive error logging
        if (error.name === 'NotSupportedError') {
            console.error(`Error playing sound: The audio format is likely not supported by the browser. URL: ${sound.src}`, error);
        } else {
            console.error(`Error playing sound: ${error.name}`, error);
        }
    });
};

export const soundService = {
    playClick: () => playSound(sounds.click),
    playCard: () => playSound(sounds.play),
    playWin: () => playSound(sounds.win),
    playLose: () => playSound(sounds.lose),
};
