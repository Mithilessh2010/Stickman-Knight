// Audio Manager for Stickman Knight
// Handles background music, SFX, and volume control

class AudioManager {
  constructor() {
    this.musicVolume = 0.6;
    this.sfxVolume = 0.7;
    this.masterVolume = 1.0;
    this.isMusicEnabled = true;
    this.isSfxEnabled = true;

    this.currentMusic = null;
    this.musicElement = null;

    // SFX cache to avoid creating new Audio objects
    this.sfxCache = {};

    this.loadSettings();
  }

  loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem('audioSettings'));
      if (saved) {
        this.musicVolume = saved.musicVolume ?? 0.6;
        this.sfxVolume = saved.sfxVolume ?? 0.7;
        this.masterVolume = saved.masterVolume ?? 1.0;
        this.isMusicEnabled = saved.isMusicEnabled ?? true;
        this.isSfxEnabled = saved.isSfxEnabled ?? true;
      }
    } catch (e) {
      console.warn('Failed to load audio settings:', e);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('audioSettings', JSON.stringify({
        musicVolume: this.musicVolume,
        sfxVolume: this.sfxVolume,
        masterVolume: this.masterVolume,
        isMusicEnabled: this.isMusicEnabled,
        isSfxEnabled: this.isSfxEnabled
      }));
    } catch (e) {
      console.warn('Failed to save audio settings:', e);
    }
  }

  playMusic(trackName, loop = true) {
    if (!this.isMusicEnabled) return;

    // Stop current music
    if (this.musicElement) {
      this.musicElement.pause();
      this.musicElement.currentTime = 0;
    }

    // Create new audio element
    this.musicElement = new Audio(`/audio/music/${trackName}.mp3`);
    this.musicElement.volume = this.musicVolume * this.masterVolume;
    this.musicElement.loop = loop;
    this.musicElement.play().catch(e => console.warn('Failed to play music:', e));

    this.currentMusic = trackName;
  }

  stopMusic() {
    if (this.musicElement) {
      this.musicElement.pause();
      this.musicElement.currentTime = 0;
      this.musicElement = null;
    }
    this.currentMusic = null;
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicElement) {
      this.musicElement.volume = this.musicVolume * this.masterVolume;
    }
    this.saveSettings();
  }

  playSfx(sfxName) {
    if (!this.isSfxEnabled) return;

    // Get or create SFX audio element
    let audio = this.sfxCache[sfxName];
    if (!audio) {
      audio = new Audio(`/audio/sfx/${sfxName}.mp3`);
      audio.volume = this.sfxVolume * this.masterVolume;
      this.sfxCache[sfxName] = audio;
    } else {
      // Clone the audio element to allow multiple simultaneous plays
      audio = audio.cloneNode();
      audio.volume = this.sfxVolume * this.masterVolume;
    }

    audio.play().catch(e => console.warn(`Failed to play SFX "${sfxName}":`, e));
    return audio;
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.musicElement) {
      this.musicElement.volume = this.musicVolume * this.masterVolume;
    }
    this.saveSettings();
  }

  setMusicEnabled(enabled) {
    this.isMusicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
    this.saveSettings();
  }

  setSfxEnabled(enabled) {
    this.isSfxEnabled = enabled;
    this.saveSettings();
  }

  // Convenience methods for common sounds
  playHit(intensity = 'normal') {
    const sounds = ['hit_light', 'hit_normal', 'hit_heavy'];
    const index = Math.max(0, Math.min(2, { light: 0, normal: 1, heavy: 2 }[intensity] ?? 1));
    this.playSfx(sounds[index]);
  }

  playAbilityCast() {
    this.playSfx('ability_cast');
  }

  playUltimate() {
    this.playSfx('ultimate_cast');
  }

  playKo() {
    this.playSfx('ko');
  }

  playUIClick() {
    this.playSfx('ui_click');
  }

  playUIHover() {
    this.playSfx('ui_hover');
  }

  playVictory() {
    this.playSfx('victory');
  }

  playDefeat() {
    this.playSfx('defeat');
  }
}

// Create singleton instance
export const audioManager = new AudioManager();
