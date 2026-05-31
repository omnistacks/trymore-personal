// Programmatic Web Audio API Synthesizer (Afrofuturist Ambient Loop)
// Eliminates MP3 downloads, loads instantly, and runs 100% client-side.

export function initAmbientSoundtrack(heroScene) {
  const toggleBtn = document.getElementById('audio-toggle');
  if (!toggleBtn) return;

  let audioCtx = null;
  let playing = false;
  
  // Synthesizer nodes
  let oscillators = [];
  let gainNodes = [];
  let masterGain = null;
  let filter = null;
  let lfo = null;
  let beatTimer = null;
  
  // Initialize Web Audio graph
  const setupAudioGraph = () => {
    // Create Audio Context (standard + webkit fallback)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Master Gain
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
    
    // Lowpass filter for warm analog space feeling
    filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.5, audioCtx.currentTime);
    filter.connect(masterGain);
    
    // Build ambient chord oscillators (Eb minor 9: Eb2, Bb2, Db3, F3, Gb3)
    const chord = [77.78, 116.54, 138.59, 174.61, 185.00];
    
    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      const oscGain = audioCtx.createGain();
      // Low volumes to keep it ambient
      oscGain.gain.setValueAtTime(idx % 2 === 0 ? 0.05 : 0.03, audioCtx.currentTime);
      
      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start(0);
      oscillators.push(osc);
      gainNodes.push(oscGain);
    });

    // LFO to modulate filter cutoff (breathing synthesizer effect)
    lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // Very slow frequency sweep (8 seconds)
    
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(250, audioCtx.currentTime); // Sweep depth (400Hz to 900Hz)
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(0);

    // Setup rhythmic sequencer (Afrobeat shaker/drum ticks)
    setupSequencer();
  };

  // Synthesized percussion sounds
  const triggerShaker = (time) => {
    if (!audioCtx) return;
    
    // Noise buffer generation for a crisp shaker sound
    const bufferSize = audioCtx.sampleRate * 0.08; // 80ms duration
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(7000, time);
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.015, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    noise.start(time);
  };

  const triggerBassDrum = (time) => {
    if (!audioCtx) return;
    
    // Short sine wave sweeping down (warm electronic kick)
    const kickOsc = audioCtx.createOscillator();
    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(150, time);
    kickOsc.frequency.exponentialRampToValueAtTime(45, time + 0.15);
    
    const kickGain = audioCtx.createGain();
    kickGain.gain.setValueAtTime(0.12, time);
    kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    
    kickOsc.connect(kickGain);
    kickGain.connect(audioCtx.destination);
    
    kickOsc.start(time);
    kickOsc.stop(time + 0.2);
  };

  // Rhythmic Sequencer (80 BPM Afrobeat loop)
  const setupSequencer = () => {
    const tempo = 80; // BPM
    const quarterNoteDuration = 60 / tempo;
    const stepDuration = quarterNoteDuration / 2; // Eighth notes (375ms)
    
    let stepCount = 0;
    
    const playSequencerStep = () => {
      const time = audioCtx.currentTime;
      
      // Step indices (16-step grid)
      const index = stepCount % 16;
      
      // Afrobeat standard kick/shaker layout
      // Kicks on beat 1, 4, 7, 10
      if (index === 0 || index === 4 || index === 7 || index === 10) {
        triggerBassDrum(time);
        
        // Sync Three.js particle speed to drum beats!
        if (heroScene) {
          heroScene.setMusicSpeedFactor(1.8);
          setTimeout(() => {
            heroScene.setMusicSpeedFactor(1.0);
          }, 150);
        }
      }
      
      // Shakers on syncopated subdivisions
      if (index % 2 === 1 || index === 2 || index === 8) {
        triggerShaker(time);
      }
      
      stepCount++;
      // Schedule next step
      beatTimer = setTimeout(playSequencerStep, stepDuration * 1000);
    };

    playSequencerStep();
  };

  // Toggle Sound active
  const startAudio = () => {
    if (!audioCtx) {
      setupAudioGraph();
    }
    
    // Resume context if suspended (browser security rules)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    // Fade in
    masterGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 1.5);
    toggleBtn.classList.add('playing');
    playing = true;
  };

  const stopAudio = () => {
    if (audioCtx) {
      // Fade out
      masterGain.gain.linearRampToValueAtTime(0.0, audioCtx.currentTime + 0.8);
      toggleBtn.classList.remove('playing');
      playing = false;
      
      // Suspend context after fade completes to save CPU
      setTimeout(() => {
        if (!playing && audioCtx) {
          audioCtx.suspend();
        }
      }, 900);
    }
  };

  toggleBtn.addEventListener('click', () => {
    if (!playing) {
      startAudio();
    } else {
      stopAudio();
    }
  });
}
