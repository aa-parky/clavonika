class SoundonikaEngine {
    constructor(audioContext, options = {}) {
        this.audioContext = audioContext;

        // Audio graph nodes
        this.masterGain = null;
        this.compressor = null;

        // Sample management
        this.sampleIndex = {};
        this.sampleBasePath = options.sampleBasePath || '../samples';
        this.sampleBuffers = new Map(); // AudioBuffer cache
        this.soundTypeMap = new Map();  // Type → sample mapping

        // State management
        this.volume = options.volume || 0.8;
        this.mode = options.mode || 'samples';
        this.isInitialized = false;
        this.loadingProgress = 0;
    }

    // ===== INITIALIZATION METHODS =====

    async init() {
        if (this.isInitialized) {
            console.log('Engine already initialized');
            return;
        }

        try {
            this.setupAudioGraph();
            await this.loadSampleIndex();
            await this.preloadSamples();
            this.setupSoundTypeMapping();

            this.isInitialized = true;
            console.log('Soundonika engine initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Soundonika engine:', error);
            throw error;
        }
    }

    setupAudioGraph() {
        // Master gain for volume control
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = this.volume;

        // Optional compressor for limiting and professional sound
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -24;
        this.compressor.knee.value = 30;
        this.compressor.ratio.value = 12;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.25;

        // Connect the audio graph: masterGain → compressor → destination
        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.audioContext.destination);
    }

    async loadSampleIndex() {
        // FIXED: Simplified exception handling - no redundant rethrow
        const response = await fetch(`${this.sampleBasePath}/sample-index.json`);
        if (!response.ok) {
            throw new Error(`Failed to load sample index: ${response.status}`);
        }
        this.sampleIndex = await response.json();
    }

    async preloadSamples() {
        const loadPromises = [];
        let totalSamples = 0;
        let loadedSamples = 0;

        // Count total samples for progress tracking - FIXED TYPE HANDLING
        for (const [, packs] of Object.entries(this.sampleIndex)) {
            if (packs && typeof packs === 'object' && !Array.isArray(packs)) {
                // Type assertion to help linter understand this is a record/object
                const packsRecord = /** @type {Record<string, string[]>} */ (packs);
                for (const [, samples] of Object.entries(packsRecord)) {
                    if (Array.isArray(samples)) {
                        totalSamples += samples.length;
                    }
                }
            }
        }

        // Load samples from each pack - FIXED TYPE HANDLING
        for (const [category, packs] of Object.entries(this.sampleIndex)) {
            if (packs && typeof packs === 'object' && !Array.isArray(packs)) {
                // Type assertion to help linter understand this is a record/object
                const packsRecord = /** @type {Record<string, string[]>} */ (packs);
                for (const [pack, samples] of Object.entries(packsRecord)) {
                    if (Array.isArray(samples)) {
                        for (const sample of samples) {
                            const promise = this.loadSample(category, pack, sample)
                                .then(() => {
                                    loadedSamples++;
                                    this.loadingProgress = loadedSamples / totalSamples;
                                });
                            loadPromises.push(promise);
                        }
                    }
                }
            }
        }

        await Promise.all(loadPromises);
        console.log(`Loaded ${loadedSamples} samples successfully`);
    }

    async loadSample(category, pack, filename) {
        const url = `${this.sampleBasePath}/${category}/${pack}/${filename}`;

        // FIXED: Simplified exception handling - just catch and warn, no rethrow
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`Failed to load sample: ${url} - HTTP ${response.status}`);
                return;
            }

            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            // Store with a key for easy lookup
            const key = this.generateSampleKey(category, pack, filename);
            this.sampleBuffers.set(key, audioBuffer);

        } catch (error) {
            console.warn(`Failed to load sample: ${url}`, error);
        }
    }

    generateSampleKey(category, pack, filename) {
        return `${category}/${pack}/${filename}`;
    }

    setupSoundTypeMapping() {
        // Default mappings to high-quality samples
        this.soundTypeMap.set('kick', this.generateSampleKey('percussion', 'DopeDrumsVol5', 'DD5_Kick_01.wav'));
        this.soundTypeMap.set('snare', this.generateSampleKey('percussion', 'DopeDrumsVol5', 'DD5_Snare_01.wav'));
        this.soundTypeMap.set('hihat_closed', this.generateSampleKey('percussion', 'DopeDrumsVol5', 'DD5_CH_01.wav'));
        this.soundTypeMap.set('hihat_open', this.generateSampleKey('percussion', 'DopeDrumsVol5', 'DD5_OH_01.wav'));
        this.soundTypeMap.set('perc', this.generateSampleKey('percussion', 'DopeDrumsVol5', 'DD5_Perc_01.wav'));
        this.soundTypeMap.set('shaker', this.generateSampleKey('percussion', 'DopeDrumsVol5', 'DD5_Shk_01.wav'));

        // Aliases for convenience
        this.soundTypeMap.set('accent', this.soundTypeMap.get('kick'));
        this.soundTypeMap.set('normal', this.soundTypeMap.get('hihat_closed'));
    }

    // ===== CORE SCHEDULING METHODS =====

    scheduleSound(when, soundType, velocity = 1.0) {
        if (!this.isInitialized) {
            console.warn('Engine not initialized. Call init() first. Falling back to click sound.');
            this.scheduleClickSound(when, soundType, velocity);
            return;
        }

        // Validate and sanitize parameters
        if (when < this.audioContext.currentTime) {
            console.warn('Scheduled time is in the past, playing immediately');
            when = this.audioContext.currentTime;
        }

        velocity = Math.max(0, Math.min(1, velocity));

        // Route based on current mode
        if (this.mode === 'samples') {
            this.scheduleSample(when, soundType, velocity);
        } else {
            this.scheduleClickSound(when, soundType, velocity);
        }
    }

    scheduleSample(when, soundType, velocity) {
        // Get the sample for this sound type
        const sampleKey = this.getSampleForSoundType(soundType);
        const audioBuffer = this.sampleBuffers.get(sampleKey);

        if (!audioBuffer) {
            console.warn(`No sample found for sound type: ${soundType}, falling back to click`);
            this.scheduleClickSound(when, soundType, velocity);
            return;
        }

        // Create audio nodes
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        // Configure the source
        source.buffer = audioBuffer;

        // FIXED: Apply a velocity curve directly without a redundant variable
        gainNode.gain.value = Math.pow(velocity, 2) * this.volume;

        // Connect: source → gain → master → destination
        source.connect(gainNode);
        gainNode.connect(this.masterGain);

        // Schedule playback
        source.start(when);

        // Clean up after playback to prevent memory leaks
        const cleanup = () => {
            try {
                source.disconnect();
                gainNode.disconnect();
            } catch (e) {
                // Nodes may already be disconnected
            }
        };

        source.addEventListener('ended', cleanup);

        // Fallback cleanup in case 'ended' event doesn't fire
        setTimeout(cleanup, (audioBuffer.duration + 1) * 1000);
    }

    scheduleClickSound(when, soundType, velocity = 1.0) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        // Different frequencies for different sound types
        const frequencies = {
            'kick': 60,
            'snare': 200,
            'hihat_closed': 800,
            'hihat_open': 1200,
            'perc': 400,
            'shaker': 1000,
            'accent': 60,
            'normal': 800
        };

        osc.frequency.value = frequencies[soundType] || 300;
        osc.type = soundType === 'kick' || soundType === 'accent' ? 'sine' : 'square';

        // FIXED: Apply velocity and volume directly without a redundant variable
        gain.gain.value = Math.pow(velocity, 2) * this.volume * 0.1; // Lower volume for clicks

        // Connect and schedule
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(when);
        osc.stop(when + 0.1);

        // Cleanup
        osc.addEventListener('ended', () => {
            try {
                osc.disconnect();
                gain.disconnect();
            } catch (e) {
                // Already disconnected
            }
        });
    }

    getSampleForSoundType(soundType) {
        return this.soundTypeMap.get(soundType) || this.soundTypeMap.get('kick');
    }

    // ===== VOLUME AND MODE CONTROL =====

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }

    getVolume() {
        return this.volume;
    }

    setSoundMode(mode) {
        if (mode === 'clicks' || mode === 'samples') {
            this.mode = mode;
        } else {
            console.warn(`Invalid sound mode: ${mode}. Use 'clicks' or 'samples'.`);
        }
    }

    getSoundMode() {
        return this.mode;
    }

    setSampleBasePath(path) {
        this.sampleBasePath = path;
        console.log(`Soundonika sample path set to: ${path}`);

        // Clear existing sample buffers since path changed
        this.sampleBuffers.clear();
        this.soundTypeMap.clear();
        this.isInitialized = false;

        console.log('Sample buffers cleared. Call init() to reload samples from new path.');
    }

    getSampleBasePath() {
        return this.sampleBasePath;
    }

    // ===== SAMPLE MANAGEMENT METHODS =====
    // NOTE: The demo uses these methods for immediate HTML5 Audio playback
    previewSample(category, pack, filename) {
        // For demo purposes - uses HTML5 Audio for immediate playback
        const url = `${this.sampleBasePath}/${category}/${pack}/${filename}`;
        const audio = new Audio(url);
        audio.volume = this.volume;
        audio.play().then(() => {
            // success
        }).catch(error => {
            console.warn('Failed to preview sample:', error);
        });
    }

    // ===== UTILITY METHODS =====

    getLoadingProgress() {
        return this.loadingProgress;
    }

    isReady() {
        return this.isInitialized;
    }

    // Get info about loaded samples
    getLoadedSampleCount() {
        return this.sampleBuffers.size;
    }

    // Update sound type mapping - Used for customization
}

// Export to global namespace for compatibility with existing documentation
if (typeof window !== 'undefined') {
    window.Soundonika = {
        Engine: SoundonikaEngine
    };
}

