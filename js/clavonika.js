/**
 * Clavonika - Piano Keyboard Interface
 * Modular version - Requires an external CSS file
 *
 * Usage:
 *   <link rel="stylesheet" href="clavonika.css">
 *   <script src="clavonika.js"></script>
 *   <script>
 *     const piano = Clavonika.init('container-id');
 *     // Live MIDI will highlight keys automatically.
 *     // You can also call:
 *     // piano.noteOn(60);  // Play middle C
 *     // piano.noteOff(60); // Stop middle C
 *   </script>
 */

(function () {
    "use strict";

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
        const NAMES = [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B",
        ];
        const out = [];
        for (let midi = 21; midi <= 108; midi++) {
            const name = NAMES[midi % 12];
            const octave = Math.floor(midi / 12) - 1;
            out.push({
                note: name + octave,
                type: name.includes("#") ? "black" : "white",
                octave,
                midi,
            });
        }
        return out;
    }
    const keys = generateKeys();

    // Core functionality
    function createClavonikaInstance(container) {
        let middleCShift = -1; // MIDI 60 = C3
        let keyboard,
            toggleCOnly,
            toggleAllLabels,
            middleCSelect,
            midiDeviceSelector;

        // === MIDI state ===
        let midiAccess = null;
        let currentInput = null;
        const LAST_INPUT_KEY = "clavonika:lastInputId";

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
            label.textContent = key.note.replace(
                /\d+$/,
                String(key.octave + middleCShift),
            );
            el.appendChild(label);

            return el;
        }

        function processKeys(keyList, isBlackKeys = false) {
            keyList.forEach((key) => {
                const keyElement = createKeyElement(key);

                if (isBlackKeys) {
                    const keysBefore = keys.slice(0, keys.indexOf(key));
                    const whiteKeysBefore = keysBefore.filter(
                        (k) => k.type === "white",
                    ).length;
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
            if (mode === "c-only") {
                keyboard.classList.add("show-c-only");
                keyboard.classList.remove("hide-all-labels");
                toggleCOnly.checked = true;
                toggleAllLabels.checked = false;
            } else if (mode === "hide-all") {
                keyboard.classList.add("hide-all-labels");
                keyboard.classList.remove("show-c-only");
                toggleCOnly.checked = false;
                toggleAllLabels.checked = true;
            } else {
                keyboard.classList.remove("show-c-only");
                keyboard.classList.remove("hide-all-labels");
                toggleCOnly.checked = false;
                toggleAllLabels.checked = false;
            }
        }

        function getCurrentLabelMode() {
            if (toggleCOnly.checked) return "c-only";
            if (toggleAllLabels.checked) return "hide-all";
            return "normal";
        }

        function initializeEventHandlers() {
            middleCSelect.addEventListener("change", (e) => {
                const mode = e.target.value;
                middleCShift = mode === "C3" ? -1 : mode === "C4" ? 0 : 1;
                generateKeyboard();
            });

            toggleCOnly.addEventListener("change", () => {
                setLabelMode(getCurrentLabelMode());
            });

            toggleAllLabels.addEventListener("change", () => {
                setLabelMode(getCurrentLabelMode());
            });

            // Ensure the UI reflects current checkbox states on init
            setLabelMode(getCurrentLabelMode());
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

            }
        }

        function detachCurrentInput() {
            if (currentInput) {
                try {
                    currentInput.onmidimessage = null;
                } catch (_) {}
            }
            currentInput = null;
        }

        function attachInputById(id) {
            if (!midiAccess) return;
            let found = null;
            for (const input of midiAccess.inputs.values()) {
                if (input.id === id) {
                    found = input;
                    break;
                }
            }
            if (!found) return;

            detachCurrentInput();
            currentInput = found;
            currentInput.onmidimessage = handleMIDIMessage;
            localStorage.setItem(LAST_INPUT_KEY, currentInput.id);
        }

        function createDeviceOption(input) {
            const opt = document.createElement("option");
            opt.value = input.id;
            opt.textContent = input.name || input.manufacturer || `Input ${input.id}`;
            return opt;
        }

        function createNoInputsOption() {
            const opt = document.createElement("option");
            opt.textContent = "No MIDI inputs";
            opt.disabled = true;
            opt.selected = true;
            return opt;
        }

        function getInputsArray() {
            if (!midiAccess) return [];
            return Array.from(midiAccess.inputs.values());
        }

        function getPreferredInputId(inputs) {
            if (inputs.length === 0) return null;

            const saved = localStorage.getItem(LAST_INPUT_KEY);
            return inputs.find(i => i.id === saved) ? saved : inputs[0].id;
        }

        function populateDeviceSelector() {
            // Clear
            midiDeviceSelector.innerHTML = "";

            const inputs = getInputsArray();
            if (inputs.length === 0) {
                midiDeviceSelector.appendChild(createNoInputsOption());
                return;
            }

            inputs.forEach((inp) => {
                midiDeviceSelector.appendChild(createDeviceOption(inp));
            });

            // Prefer last used if present; else first input
            const candidate = getPreferredInputId(inputs);
            midiDeviceSelector.value = candidate;

            // CRITICAL: bind immediately so keys respond without flipping inputs
            attachInputById(candidate);
        }

        function refreshDeviceSelection(preserveSelection = null) {
            const prev = preserveSelection || midiDeviceSelector.value;
            populateDeviceSelector();

            // If previous id still exists, ensure we stay on it
            if (prev && getInputsArray().some((i) => i.id === prev)) {
                midiDeviceSelector.value = prev;
                attachInputById(prev);
            }
        }

        function initMIDI() {
            if (!navigator.requestMIDIAccess) {
                // Hide selector if is not supported
                midiDeviceSelector.innerHTML = "";
                midiDeviceSelector.disabled = true;
                midiDeviceSelector.classList.add("hidden");
                return;
            }

            navigator
                .requestMIDIAccess({ sysex: false })
                .then((access) => {
                    midiAccess = access;
                    populateDeviceSelector();

                    // React to hot-plug
                    midiAccess.onstatechange = () => {
                        refreshDeviceSelection();
                    };

                    midiDeviceSelector.addEventListener("change", (e) => {
                        const id = e.target.value;
                        attachInputById(id);
                    });
                })
                .catch(() => {
                    // On failure, disable selector
                    midiDeviceSelector.disabled = true;
                    midiDeviceSelector.title = "Web MIDI access denied/unavailable";
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

            // Initialize Web MIDI (auto-binds to the last used input if present)
            initMIDI();
        }

        // Public API
        return {
            noteOn: function (midiNote) {
                setNoteActive(midiNote, true);
            },
            noteOff: function (midiNote) {
                setNoteActive(midiNote, false);
            },
            initialize: initialize,
        };
    }

    // Main Clavonika object
    window.Clavonika = {
        init: function (containerId) {
            let container;
            if (typeof containerId === "string") {
                container = document.getElementById(containerId);
                if (!container) {
                    throw new Error(`Container with id '${containerId}' not found`);
                }
            } else if (containerId && containerId.nodeType === 1) {
                container = containerId;
            } else {
                throw new Error(
                    "Invalid container: must be an element ID string or DOM element",
                );
            }

            container.classList.add("clavonika-container");
            container.innerHTML = HTML_TEMPLATE;

            const instance = createClavonikaInstance(container);
            instance.initialize();

            return instance;
        },
    };

    // Backward compatibility - expose PianoInterface globally
    window.PianoInterface = {
        noteOn: function (_midiNote) {
            console.warn(
                "PianoInterface is deprecated. Use Clavonika.init() to create an instance.",
            );
        },
        noteOff: function (_midiNote) {
            console.warn(
                "PianoInterface is deprecated. Use Clavonika.init() to create an instance.",
            );
        },
    };
})();
