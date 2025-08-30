/**
 * Clavonika - Piano Keyboard Interface
 * Bundled version - Single file deployment
 *
 * Usage:
 *   <script src="bundled-clavonika.js"></script>
 *   <script>
 *     const piano = Clavonika.init('container-id');
 *     piano.noteOn(60);  // Play middle C
 *     piano.noteOff(60); // Stop middle C
 *   </script>
 */

(function() {
    'use strict';

    // CSS Styles
    const CSS_STYLES = `
/* === Reset + Global Styles === */
.clavonika-container * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.clavonika-container {
    font-family: "Arial", sans-serif;
    background-color: #121212;
    color: #f0f0f0;
    padding: 20px;
    border-radius: 10px;
}

/* === Top-level Layout Containers === */
.clavonika-container .piano-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.clavonika-container .piano-container {
    position: relative;
    display: inline-block;
    background: radial-gradient(circle at 100%, #1a1a1a 0%, #262626 100%);
    padding: 15px;
    border-radius: 15px;
    overflow-x: auto;
}

/* === MIDI Device Selector === */
.clavonika-container .midi-device-label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: bold;
    color: #ddd;
    margin-bottom: 4px;
}

.clavonika-container #midiDeviceSelector {
    background-color: #1e1e1e;
    color: #e0e0e0;
    border: 1px solid #444;
}

/* === Piano Controls Panel === */
.clavonika-container .piano-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 40px;
    margin-bottom: 12px;
    color: #ccc;
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
    border-radius: 4px;
    font-size: 0.9rem;
    background-color: #111;
    color: #fff;
    border: 1px solid #555;
    line-height: 1;
    height: 26px;
    margin-top: 1px;
}

.clavonika-container .middle-c-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgb(222, 222, 222);
}

/* === Keyboard + Keys === */
.clavonika-container .keyboard {
    position: relative;
    display: flex;
    background: linear-gradient(145deg, #000000, #1f1f1f);
    padding: 15px;
    border-radius: 8px;
    box-shadow:
            inset 0 4px 8px rgba(0, 0, 0, 0.6),
            inset 0 -2px 4px rgba(255, 255, 255, 0.05);
}

/* === White Keys === */
.clavonika-container .white-key {
    width: 24px;
    height: 140px;
    background: linear-gradient(180deg, #ffffff 0%, #f8f8f8 50%, #f0f0f0 100%);
    border: 1px solid #ddd;
    border-radius: 0 0 4px 4px;
    margin-right: 1px;
    position: relative;
    cursor: pointer;
    transition: all 0.1s ease;
    box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 0.8),
            inset 0 -1px 2px rgba(0, 0, 0, 0.1);
}

.clavonika-container .white-key:hover {
    background: linear-gradient(180deg, #f5f5f5 0%, #eeeeee 50%, #e8e8e8 100%);
    transform: translateY(1px);
    box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.2),
            inset 0 1px 2px rgba(255, 255, 255, 0.6),
            inset 0 -1px 2px rgba(0, 0, 0, 0.2);
}

.clavonika-container .white-key:active,
.clavonika-container .white-key.active {
    background-color: #e06666 !important;
    box-shadow: inset 0 0 5px #ff9999;
}

/* === Black Keys === */
.clavonika-container .black-key {
    width: 16px;
    height: 90px;
    background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #000000 100%);
    border-radius: 0 0 3px 3px;
    position: absolute;
    cursor: pointer;
    z-index: 2;
    transition: all 0.1s ease;
    box-shadow:
            0 4px 8px rgba(0, 0, 0, 0.4),
            inset 0 1px 2px rgba(255, 255, 255, 0.1),
            inset 0 -1px 2px rgba(0, 0, 0, 0.8);
}

.clavonika-container .black-key:hover {
    background: linear-gradient(180deg, #404040 0%, #2a2a2a 50%, #1a1a1a 100%);
    transform: translateY(1px);
    box-shadow:
            0 3px 6px rgba(0, 0, 0, 0.5),
            inset 0 1px 2px rgba(255, 255, 255, 0.15),
            inset 0 -1px 2px rgba(0, 0, 0, 0.9);
}

.clavonika-container .black-key:active {
    background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 50%, #000000 100%);
    transform: translateY(2px);
    box-shadow:
            inset 0 2px 4px rgba(0, 0, 0, 0.8),
            inset 0 1px 2px rgba(255, 255, 255, 0.05);
}

.clavonika-container .black-key.active {
    background-color: #aa0000 !important;
    box-shadow: inset 0 0 5px #ff3333;
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
    color: #bbb;
    bottom: 6px;
    font-size: 7px;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.8);
}

/* === Middle C and C Octave Highlighting === */
.clavonika-container .white-key.middle-c .key-label,
.clavonika-container .black-key.middle-c .key-label,
.clavonika-container .white-key[data-note^="C"] .key-label {
    color: #ff6b6b;
    font-weight: bold;
}

/* === Label Visibility Controls === */
.clavonika-container .keyboard.hide-all-labels .key-label {
    display: none;
}

.clavonika-container .keyboard.show-c-only .key-label {
    display: none;
}

.clavonika-container .keyboard.show-c-only .white-key[data-note^="C"] .key-label,
.clavonika-container .keyboard.show-c-only .black-key[data-note^="C"] .key-label {
    display: block;
}

/* === Hover Glow Effects === */
.clavonika-container .white-key:hover::before,
.clavonika-container .black-key:hover::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 0 0 6px 6px;
    z-index: -1;
}

.clavonika-container .white-key:hover::before {
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.clavonika-container .black-key:hover::before {
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    border-radius: 0 0 5px 5px;
}

/* === Key Animation === */
@keyframes clavonika-keyPress {
    0%   { transform: translateY(0); }
    50%  { transform: translateY(2px); }
    100% { transform: translateY(0); }
}

.clavonika-container .key-pressed {
    animation: clavonika-keyPress 0.2s ease;
}

/* === Utility === */
.clavonika-container .hidden {
    display: none;
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
                <option value="C3" selected>
                    C3 (Kawai VPC1, Yamaha, Logic)
                </option>
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
    const keys = [
        { note: "A0", type: "white", octave: 0, midi: 21 },
        { note: "A#0", type: "black", octave: 0, midi: 22 },
        { note: "B0", type: "white", octave: 0, midi: 23 },
        { note: "C1", type: "white", octave: 1, midi: 24 },
        { note: "C#1", type: "black", octave: 1, midi: 25 },
        { note: "D1", type: "white", octave: 1, midi: 26 },
        { note: "D#1", type: "black", octave: 1, midi: 27 },
        { note: "E1", type: "white", octave: 1, midi: 28 },
        { note: "F1", type: "white", octave: 1, midi: 29 },
        { note: "F#1", type: "black", octave: 1, midi: 30 },
        { note: "G1", type: "white", octave: 1, midi: 31 },
        { note: "G#1", type: "black", octave: 1, midi: 32 },
        { note: "A1", type: "white", octave: 1, midi: 33 },
        { note: "A#1", type: "black", octave: 1, midi: 34 },
        { note: "B1", type: "white", octave: 1, midi: 35 },
        { note: "C2", type: "white", octave: 2, midi: 36 },
        { note: "C#2", type: "black", octave: 2, midi: 37 },
        { note: "D2", type: "white", octave: 2, midi: 38 },
        { note: "D#2", type: "black", octave: 2, midi: 39 },
        { note: "E2", type: "white", octave: 2, midi: 40 },
        { note: "F2", type: "white", octave: 2, midi: 41 },
        { note: "F#2", type: "black", octave: 2, midi: 42 },
        { note: "G2", type: "white", octave: 2, midi: 43 },
        { note: "G#2", type: "black", octave: 2, midi: 44 },
        { note: "A2", type: "white", octave: 2, midi: 45 },
        { note: "A#2", type: "black", octave: 2, midi: 46 },
        { note: "B2", type: "white", octave: 2, midi: 47 },
        { note: "C3", type: "white", octave: 3, midi: 48 },
        { note: "C#3", type: "black", octave: 3, midi: 49 },
        { note: "D3", type: "white", octave: 3, midi: 50 },
        { note: "D#3", type: "black", octave: 3, midi: 51 },
        { note: "E3", type: "white", octave: 3, midi: 52 },
        { note: "F3", type: "white", octave: 3, midi: 53 },
        { note: "F#3", type: "black", octave: 3, midi: 54 },
        { note: "G3", type: "white", octave: 3, midi: 55 },
        { note: "G#3", type: "black", octave: 3, midi: 56 },
        { note: "A3", type: "white", octave: 3, midi: 57 },
        { note: "A#3", type: "black", octave: 3, midi: 58 },
        { note: "B3", type: "white", octave: 3, midi: 59 },
        { note: "C4", type: "white", octave: 4, midi: 60 },
        { note: "C#4", type: "black", octave: 4, midi: 61 },
        { note: "D4", type: "white", octave: 4, midi: 62 },
        { note: "D#4", type: "black", octave: 4, midi: 63 },
        { note: "E4", type: "white", octave: 4, midi: 64 },
        { note: "F4", type: "white", octave: 4, midi: 65 },
        { note: "F#4", type: "black", octave: 4, midi: 66 },
        { note: "G4", type: "white", octave: 4, midi: 67 },
        { note: "G#4", type: "black", octave: 4, midi: 68 },
        { note: "A4", type: "white", octave: 4, midi: 69 },
        { note: "A#4", type: "black", octave: 4, midi: 70 },
        { note: "B4", type: "white", octave: 4, midi: 71 },
        { note: "C5", type: "white", octave: 5, midi: 72 },
        { note: "C#5", type: "black", octave: 5, midi: 73 },
        { note: "D5", type: "white", octave: 5, midi: 74 },
        { note: "D#5", type: "black", octave: 5, midi: 75 },
        { note: "E5", type: "white", octave: 5, midi: 76 },
        { note: "F5", type: "white", octave: 5, midi: 77 },
        { note: "F#5", type: "black", octave: 5, midi: 78 },
        { note: "G5", type: "white", octave: 5, midi: 79 },
        { note: "G#5", type: "black", octave: 5, midi: 80 },
        { note: "A5", type: "white", octave: 5, midi: 81 },
        { note: "A#5", type: "black", octave: 5, midi: 82 },
        { note: "B5", type: "white", octave: 5, midi: 83 },
        { note: "C6", type: "white", octave: 6, midi: 84 },
        { note: "C#6", type: "black", octave: 6, midi: 85 },
        { note: "D6", type: "white", octave: 6, midi: 86 },
        { note: "D#6", type: "black", octave: 6, midi: 87 },
        { note: "E6", type: "white", octave: 6, midi: 88 },
        { note: "F6", type: "white", octave: 6, midi: 89 },
        { note: "F#6", type: "black", octave: 6, midi: 90 },
        { note: "G6", type: "white", octave: 6, midi: 91 },
        { note: "G#6", type: "black", octave: 6, midi: 92 },
        { note: "A6", type: "white", octave: 6, midi: 93 },
        { note: "A#6", type: "black", octave: 6, midi: 94 },
        { note: "B6", type: "white", octave: 6, midi: 95 },
        { note: "C7", type: "white", octave: 7, midi: 96 },
        { note: "C#7", type: "black", octave: 7, midi: 97 },
        { note: "D7", type: "white", octave: 7, midi: 98 },
        { note: "D#7", type: "black", octave: 7, midi: 99 },
        { note: "E7", type: "white", octave: 7, midi: 100 },
        { note: "F7", type: "white", octave: 7, midi: 101 },
        { note: "F#7", type: "black", octave: 7, midi: 102 },
        { note: "G7", type: "white", octave: 7, midi: 103 },
        { note: "G#7", type: "black", octave: 7, midi: 104 },
        { note: "A7", type: "white", octave: 7, midi: 105 },
        { note: "A#7", type: "black", octave: 7, midi: 106 },
        { note: "B7", type: "white", octave: 7, midi: 107 },
        { note: "C8", type: "white", octave: 8, midi: 108 },
    ];

    // Core functionality
    function createClavonikaInstance(container) {
        let middleCShift = -1; // MIDI 60 = C3
        let keyboard, toggleCOnly, toggleAllLabels, middleCSelect;

        function createKeyElement(key, type) {
            const keyElement = document.createElement("div");
            keyElement.className = type === "black" ? "black-key" : "white-key";
            keyElement.setAttribute("data-note", key.note);
            keyElement.setAttribute("data-octave", key.octave);
            keyElement.setAttribute("data-midi", key.midi);

            if (key.midi === 60) keyElement.classList.add("middle-c");

            const label = document.createElement("span");
            label.className = "key-label";
            const labelOctave = key.octave + middleCShift;
            label.textContent = key.note.replace(/\d+$/, labelOctave);
            keyElement.appendChild(label);

            return keyElement;
        }

        function generateKeyboard() {
            keyboard.innerHTML = "";

            const whiteKeys = keys.filter((k) => k.type === "white");
            const blackKeys = keys.filter((k) => k.type === "black");

            whiteKeys.forEach((key) => {
                const keyElement = createKeyElement(key, "white");
                keyboard.appendChild(keyElement);
            });

            blackKeys.forEach((key) => {
                const keysBefore = keys.slice(0, keys.indexOf(key));
                const whiteKeysBefore = keysBefore.filter((k) => k.type === "white").length;

                const keyElement = createKeyElement(key, "black");
                keyElement.style.left = whiteKeysBefore * 25 - -6 + "px";

                keyboard.appendChild(keyElement);
            });
        }

        function initializeEventHandlers() {
            middleCSelect.addEventListener("change", (e) => {
                const mode = e.target.value;
                middleCShift = mode === "C3" ? -1 : mode === "C4" ? 0 : 1;
                generateKeyboard();
            });

            toggleCOnly.addEventListener("change", () => {
                if (toggleCOnly.checked) {
                    keyboard.classList.add("show-c-only");
                    toggleAllLabels.checked = false;
                    keyboard.classList.remove("hide-all-labels");
                } else {
                    keyboard.classList.remove("show-c-only");
                }
            });

            toggleAllLabels.addEventListener("change", () => {
                if (toggleAllLabels.checked) {
                    keyboard.classList.add("hide-all-labels");
                    toggleCOnly.checked = false;
                    keyboard.classList.remove("show-c-only");
                } else {
                    keyboard.classList.remove("hide-all-labels");
                }
            });
        }

        function initialize() {
            // Get elements
            keyboard = container.querySelector("#keyboard");
            toggleCOnly = container.querySelector("#toggleCOnly");
            toggleAllLabels = container.querySelector("#toggleAllLabels");
            middleCSelect = container.querySelector("#middleC");

            // Generate keyboard and set up event handlers
            generateKeyboard();
            initializeEventHandlers();
        }

        // Public API
        return {
            noteOn: function(midiNote) {
                const el = container.querySelector(`[data-midi="${midiNote}"]`);
                if (el) el.classList.add("active");
            },
            noteOff: function(midiNote) {
                const el = container.querySelector(`[data-midi="${midiNote}"]`);
                if (el) el.classList.remove("active");
            },
            initialize: initialize,
            getContainer: function() { return container; }
        };
    }

    // Inject CSS styles
    function injectStyles() {
        const styleId = 'clavonika-styles';
        if (document.getElementById(styleId)) {
            return; // Already injected
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = CSS_STYLES;
        document.head.appendChild(style);
    }

    // Main Clavonika object
    window.Clavonika = {
        init: function(containerId) {
            // Inject CSS if not already done
            injectStyles();

            // Get or create a container
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

            // Add clavonika container class
            container.classList.add('clavonika-container');

            // Insert HTML
            container.innerHTML = HTML_TEMPLATE;

            // Create and initialize an instance
            const instance = createClavonikaInstance(container);
            instance.initialize();

            return instance;
        },

        // Utility method to create a container and initialize
        create: function(parentElement) {
            const container = document.createElement('div');
            container.id = 'clavonika-' + Date.now();

            if (typeof parentElement === 'string') {
                const parent = document.getElementById(parentElement);
                if (!parent) {
                    throw new Error(`Parent element with id '${parentElement}' not found`);
                }
                parent.appendChild(container);
            } else if (parentElement && parentElement.nodeType === 1) {
                parentElement.appendChild(container);
            } else {
                document.body.appendChild(container);
            }

            return this.init(container);
        }
    };

    // Backward compatibility - expose PianoInterface globally
    window.PianoInterface = {
        noteOn: function(midiNote) {
            console.warn('PianoInterface is deprecated. Use Clavonika.init() to create an instance.');
        },
        noteOff: function(midiNote) {
            console.warn('PianoInterface is deprecated. Use Clavonika.init() to create an instance.');
        }
    };

})();

