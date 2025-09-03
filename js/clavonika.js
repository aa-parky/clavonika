/**
 * Clavonika - Piano Keyboard Interface
 * Bundled version - Single file deployment
 *
 * Usage:
 *   <script src="bundled-clavonika.js"></script>
 *   <script>
 *     const piano = Clavonika.init('container-id');
 *     // Live MIDI will highlight keys automatically.
 *     // You can also call:
 *     // piano.noteOn(60);  // Play middle C
 *     // piano.noteOff(60); // Stop middle C
 *   </script>
 */

(function() {
    'use strict';

    // CSS Styles
    const CSS_STYLES = `
/* === Global Reset === */
.clavonika-container * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* === Utility === */
.clavonika-container .hidden {
  display: none;
}

/* === Layout === */
.clavonika-container .piano-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.clavonika-container .piano-container {
  position: relative;
  display: inline-block;
  padding: 15px;
  border-radius: 15px;
  background: #333333;
  overflow-x: auto;
}

/* === MIDI Device Selector === */
.clavonika-container .midi-device-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: bold;
  margin-bottom: 4px;
}

.clavonika-container #midiDeviceSelector {
  border: 1px solid #444;
}

/* === Piano Controls === */
.clavonika-container .piano-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.clavonika-container .piano-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.clavonika-container .piano-controls select {
  padding: 4px 6px;
  height: 26px;
  font-size: 0.9rem;
  border: 1px solid #555;
  border-radius: 4px;
  line-height: 1;
  margin-top: 1px;
}

.clavonika-container .middle-c-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* === Keyboard Base === */
.clavonika-container .keyboard {
  position: relative;
  display: flex;
  padding: 15px;
  border-radius: 8px;
  background: linear-gradient(145deg, #000, #1f1f1f);
  box-shadow:
    inset 0 4px 8px rgba(0, 0, 0, 0.6),
    inset 0 -2px 4px rgba(255, 255, 255, 0.05);
}

/* === White Keys === */
.clavonika-container .white-key {
  position: relative;
  width: 24px;
  height: 140px;
  margin-right: 1px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 0 0 4px 4px;
  background: linear-gradient(180deg, #fff 0%, #f8f8f8 50%, #f0f0f0 100%);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.8),
    inset 0 -1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease;
}

.clavonika-container .white-key:hover {
  background: linear-gradient(180deg, #f5f5f5, #eee, #e8e8e8);
  transform: translateY(1px);
}

/* === Black Keys === */
.clavonika-container .black-key {
  position: absolute;
  width: 16px;
  height: 90px;
  cursor: pointer;
  z-index: 2;
  border-radius: 0 0 3px 3px;
  background: linear-gradient(180deg, #2a2a2a, #1a1a1a 50%, #000);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.1),
    inset 0 -1px 2px rgba(0, 0, 0, 0.8);
  transition: transform 0.1s ease;
}

.clavonika-container .black-key:hover {
  background: linear-gradient(180deg, #404040, #2a2a2a 50%, #1a1a1a);
  transform: translateY(1px);
}

.clavonika-container .black-key:active {
  background: linear-gradient(180deg, #1a1a1a, #0a0a0a 50%, #000);
}

/* === Key Labels === */
.clavonika-container .key-label {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  font-weight: 500;
  color: #888;
  pointer-events: none;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
}

.clavonika-container .black-key .key-label {
  bottom: 6px;
  font-size: 7px;
  color: #bbb;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.8);
}

/* === Middle C & C-Octaves Highlighting === */
.clavonika-container .white-key.middle-c .key-label,
.clavonika-container .black-key.middle-c .key-label,
.clavonika-container .white-key[data-note^="C"] .key-label {
  color: #ff6b6b;
  font-weight: bold;
}

/* === Label Visibility States === */
.clavonika-container .keyboard.hide-all-labels .key-label {
  display: none;
}

.clavonika-container .keyboard.show-c-only .key-label {
  display: none;
}

.clavonika-container
  .keyboard.show-c-only
  .white-key[data-note^="C"]
  .key-label,
.clavonika-container
  .keyboard.show-c-only
  .black-key[data-note^="C"]
  .key-label {
  display: block;
}

/* === Hover Glow Effect (Subtle) === */
.clavonika-container .white-key:hover::before,
.clavonika-container .black-key:hover::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  z-index: -1;
}

.clavonika-container .white-key:hover::before {
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  border-radius: 0 0 6px 6px;
}

.clavonika-container .black-key:hover::before {
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  border-radius: 0 0 5px 5px;
}

/* === Press Animation === */
@keyframes clavonika-keyPress {
  0% { transform: translateY(0); }
  50% { transform: translateY(2px); }
  100% { transform: translateY(0); }
}

.clavonika-container .key-pressed {
  animation: clavonika-keyPress 0.2s ease;
}

/* ===== Active (pressed / MIDI-on) look: BLUE, no shadow ===== */
.clavonika-container .white-key:active,
.clavonika-container .white-key.active {
  background: #2b8cff !important;
  box-shadow: none !important;
  border-color: #2b8cff;
}

.clavonika-container .black-key:active,
.clavonika-container .black-key.active {
  background: #2b8cff !important;
  box-shadow: none !important;
}

/* Optional: make the label readable on blue */
.clavonika-container .white-key.active .key-label,
.clavonika-container .white-key:active .key-label,
.clavonika-container .black-key.active .key-label,
.clavonika-container .black-key:active .key-label {
  color: #eaf2ff;
  text-shadow: none;
}

/* Optional: if you don't want keys to dip while active */
.clavonika-container .white-key:active,
.clavonika-container .black-key:active {
  transform: none !important;
}
`;

    // HTML Template
    const HTML_TEMPLATE = `
<section class="piano-wrapper">
  <div class="midi-device-label">
    <label for="midiDeviceSelector">Select MIDI Input:</label>
    <select id="midiDeviceSelector"></select>
  </div>
  <div class="piano-controls">
    <label>
      <input type="checkbox" id="toggleCOnly" />
      Show only C notes
    </label>
    <label>
      <input type="checkbox" id="toggleAllLabels" />
      Hide all note labels
    </label>
    <label class="middle-c-label">
      <span>Middle C Label:</span>
      <select id="middleC">
        <option value="C3" selected>C3 (Kawai VPC1, Yamaha, Logic)</option>
        <option value="C4">C4 (Midonika, General MIDI)</option>
        <option value="C5">C5 (Notation, FL Studio)</option>
      </select>
    </label>
  </div>

  <div class="piano-container">
    <div class="keyboard" id="keyboard"></div>
  </div>
</section>
`;

    // Piano keys data
    function generateKeys() {
        const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const out = [];
        for (let midi = 21; midi <= 108; midi++) {
            const name = NAMES[midi % 12];
            const octave = Math.floor(midi / 12) - 1;
            out.push({
                note: name + octave,
                type: name.includes("#") ? "black" : "white",
                octave,
                midi
            });
        }
        return out;
    }
    const keys = generateKeys();

    // Core functionality
    function createClavonikaInstance(container) {
        let middleCShift = -1; // MIDI 60 = C3
        let keyboard, toggleCOnly, toggleAllLabels, middleCSelect, midiDeviceSelector;

        // === MIDI state ===
        let midiAccess = null;
        let currentInput = null;
        const LAST_INPUT_KEY = 'clavonika:lastInputId';

        function createKeyElement(key) {
            const el = document.createElement("div");
            el.className = key.type === "black" ? "black-key" : "white-key";
            el.dataset.note = key.note;
            el.dataset.octave = String(key.octave);
            el.dataset.midi = String(key.midi);

            if (key.midi === 60) {
                el.classList.add("middle-c");
            }

            const label = document.createElement("span");
            label.className = "key-label";
            label.textContent = key.note.replace(/\d+$/, String(key.octave + middleCShift));
            el.appendChild(label);

            return el;
        }

        function processKeys(keyList, isBlackKeys = false) {
            keyList.forEach((key) => {
                const keyElement = createKeyElement(key);

                if (isBlackKeys) {
                    const keysBefore = keys.slice(0, keys.indexOf(key));
                    const whiteKeysBefore = keysBefore.filter((k) => k.type === "white").length;
                    keyElement.style.left = whiteKeysBefore * 25 - -6 + "px";
                }

                keyboard.appendChild(keyElement);
            });
        }

        function generateKeyboard() {
            keyboard.innerHTML = "";

            const whiteKeys = keys.filter((k) => k.type === "white");
            const blackKeys = keys.filter((k) => k.type === "black");

            processKeys(whiteKeys, false);
            processKeys(blackKeys, true);
        }

        function setLabelMode(mode) {
            if (mode === 'c-only') {
                keyboard.classList.add('show-c-only');
                keyboard.classList.remove('hide-all-labels');
                toggleCOnly.checked = true;
                toggleAllLabels.checked = false;
            } else if (mode === 'hide-all') {
                keyboard.classList.add('hide-all-labels');
                keyboard.classList.remove('show-c-only');
                toggleCOnly.checked = false;
                toggleAllLabels.checked = true;
            } else {
                keyboard.classList.remove('show-c-only');
                keyboard.classList.remove('hide-all-labels');
                toggleCOnly.checked = false;
                toggleAllLabels.checked = false;
            }
        }

        function initializeEventHandlers() {
            middleCSelect.addEventListener("change", (e) => {
                const mode = e.target.value;
                middleCShift = mode === "C3" ? -1 : mode === "C4" ? 0 : 1;
                generateKeyboard();
            });

            toggleCOnly.addEventListener("change", () => {
                setLabelMode(toggleCOnly.checked ? 'c-only' : (toggleAllLabels.checked ? 'hide-all' : 'normal'));
            });

            toggleAllLabels.addEventListener("change", () => {
                setLabelMode(toggleAllLabels.checked ? 'hide-all' : (toggleCOnly.checked ? 'c-only' : 'normal'));
            });

            // Ensure the UI reflects current checkbox states on init
            setLabelMode(toggleCOnly.checked ? 'c-only' : (toggleAllLabels.checked ? 'hide-all' : 'normal'));
        }

        function setNoteActive(midiNote, isActive) {
            const el = container.querySelector(`[data-midi="${midiNote}"]`);
            if (el) el.classList.toggle("active", isActive);
        }

        // ===== Web MIDI integration =====
        function handleMIDIMessage(ev) {
            const [status, note, velocity = 0] = ev.data || [];
            const type = status & 0xf0;

            // Note Off (0x80) or Note On with velocity 0 (running note-off)
            if (type === 0x80 || (type === 0x90 && velocity === 0)) {
                setNoteActive(note, false);
                return;
            }
            // Note On
            if (type === 0x90 && velocity > 0) {
                setNoteActive(note, true);
                return;
            }
        }

        function detachCurrentInput() {
            if (currentInput) {
                try { currentInput.onmidimessage = null; } catch (_) {}
            }
            currentInput = null;
        }

        function attachInputById(id) {
            if (!midiAccess) return;
            let found = null;
            for (const input of midiAccess.inputs.values()) {
                if (input.id === id) { found = input; break; }
            }
            if (!found) return;

            detachCurrentInput();
            currentInput = found;
            currentInput.onmidimessage = handleMIDIMessage;
            localStorage.setItem(LAST_INPUT_KEY, currentInput.id);
        }

        function populateDeviceSelector() {
            // Clear
            midiDeviceSelector.innerHTML = '';

            const inputs = Array.from(midiAccess.inputs.values());
            if (inputs.length === 0) {
                const opt = document.createElement('option');
                opt.textContent = 'No MIDI inputs';
                opt.disabled = true;
                opt.selected = true;
                midiDeviceSelector.appendChild(opt);
                return;
            }

            inputs.forEach(inp => {
                const opt = document.createElement('option');
                opt.value = inp.id;
                opt.textContent = inp.name || inp.manufacturer || `Input ${inp.id}`;
                midiDeviceSelector.appendChild(opt);
            });

            // Prefer last used if present; else first input
            const saved = localStorage.getItem(LAST_INPUT_KEY);
            const candidate = inputs.find(i => i.id === saved) ? saved : inputs[0].id;

            midiDeviceSelector.value = candidate;
            // CRITICAL: bind immediately so keys respond without flipping inputs
            attachInputById(candidate);
        }

        function initMIDI() {
            if (!navigator.requestMIDIAccess) {
                // Hide selector if not supported
                midiDeviceSelector.innerHTML = '';
                midiDeviceSelector.disabled = true;
                midiDeviceSelector.classList.add('hidden');
                return;
            }

            navigator.requestMIDIAccess({ sysex: false }).then(access => {
                midiAccess = access;
                populateDeviceSelector();

                // React to hot-plug
                midiAccess.onstatechange = () => {
                    const prev = midiDeviceSelector.value;
                    populateDeviceSelector();
                    // If previous id still exists, ensure we stay on it
                    if (prev && Array.from(midiAccess.inputs.values()).some(i => i.id === prev)) {
                        midiDeviceSelector.value = prev;
                        attachInputById(prev);
                    }
                };

                midiDeviceSelector.addEventListener('change', (e) => {
                    const id = e.target.value;
                    attachInputById(id);
                });
            }).catch(() => {
                // On failure, disable selector
                midiDeviceSelector.disabled = true;
                midiDeviceSelector.title = 'Web MIDI access denied/unavailable';
            });
        }
        // ===== end Web MIDI integration =====

        function initialize() {
            // Get elements
            keyboard = container.querySelector("#keyboard");
            toggleCOnly = container.querySelector("#toggleCOnly");
            toggleAllLabels = container.querySelector("#toggleAllLabels");
            middleCSelect = container.querySelector("#middleC");
            midiDeviceSelector = container.querySelector("#midiDeviceSelector");

            // Generate keyboard and set up event handlers
            generateKeyboard();
            initializeEventHandlers();

            // Initialize Web MIDI (auto-binds to last used input if present)
            initMIDI();
        }

        // Public API
        return {
            noteOn: function(midiNote) {
                setNoteActive(midiNote, true);
            },
            noteOff: function(midiNote) {
                setNoteActive(midiNote, false);
            },
            initialize: initialize
        };
    }

    // Inject CSS styles
    function injectStyles() {
        const styleId = 'clavonika-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = CSS_STYLES;
        document.head.appendChild(style);
    }

    // Main Clavonika object
    window.Clavonika = {
        init: function(containerId) {
            injectStyles();

            let container;
            if (typeof containerId === 'string') {
                container = document.getElementById(containerId);
                if (!container) {
                    throw new Error(`Container with id '${containerId}' not found`);
                }
            } else if (containerId && containerId.nodeType === 1) {
                container = containerId;
            } else {
                throw new Error('Invalid container: must be an element ID string or DOM element');
            }

            container.classList.add('clavonika-container');
            container.innerHTML = HTML_TEMPLATE;

            const instance = createClavonikaInstance(container);
            instance.initialize();

            return instance;
        }
    };

    // Backward compatibility - expose PianoInterface globally
    window.PianoInterface = {
        noteOn: function(_midiNote) {
            console.warn('PianoInterface is deprecated. Use Clavonika.init() to create an instance.');
        },
        noteOff: function(_midiNote) {
            console.warn('PianoInterface is deprecated. Use Clavonika.init() to create an instance.');
        }
    };

})();