// Full list of 88 piano keys from A0 (MIDI 21) to C8 (MIDI 108)
// Each key has:
// - `note`: scientific pitch notation (e.g., C4)
// - `type`: white or black key (used for layout and styling)
// - `octave`: number for display label shifting
// - `midi`: corresponding MIDI note number

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

// Shift used to relabel Middle C (MIDI 60) as C3, C4, or C5
// -1 = C3 (Yamaha, Logic), 0 = C4 (General MIDI), +1 = C5 (notation software)
let middleCShift = -1; // Default: MIDI 60 = C3

/**
 * Main function to render the keyboard based on current settings
 * - Clears and rebuilds the DOM inside #keyboard
 * - Highlights MIDI 60 (Middle C)
 * - Adjusts note labels according to selected convention
 */
function generateKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";

    const whiteKeys = keys.filter((k) => k.type === "white");
    const blackKeys = keys.filter((k) => k.type === "black");

    // Generate white keys first (they define the base layout)
    whiteKeys.forEach((key) => {
        const keyElement = document.createElement("div");
        keyElement.className = "white-key";
        keyElement.setAttribute("data-note", key.note);
        keyElement.setAttribute("data-octave", key.octave);
        keyElement.setAttribute("data-midi", key.midi); // <-- ADDED

        // Highlight Middle C (MIDI 60) visually
        if (key.midi === 60) keyElement.classList.add("middle-c");

        // Create and assign label with adjusted octave
        const label = document.createElement("span");
        label.className = "key-label";
        const labelOctave = key.octave + middleCShift;
        label.textContent = key.note.replace(/\d+$/, labelOctave);
        keyElement.appendChild(label);
        // Append to keyboard container
        keyboard.appendChild(keyElement);
    });

    // Generate black keys (positioned absolutely on top of white keys)
    blackKeys.forEach((key) => {
        // Count how many white keys appear before this black key
        const keysBefore = keys.slice(0, keys.indexOf(key));
        const whiteKeysBefore = keysBefore.filter((k) => k.type === "white").length;

        const keyElement = document.createElement("div");
        keyElement.className = "black-key";
        keyElement.setAttribute("data-note", key.note);
        keyElement.setAttribute("data-octave", key.octave);
        keyElement.setAttribute("data-midi", key.midi); // <-- ADDED
        // Highlight Middle C if it's a black key (it isn’t, but included for safety)
        if (key.midi === 60) keyElement.classList.add("middle-c");

        const label = document.createElement("span");
        label.className = "key-label";
        const labelOctave = key.octave + middleCShift;
        label.textContent = key.note.replace(/\d+$/, labelOctave);
        keyElement.appendChild(label);
        // Position a black key between its neighboring white keys
        keyElement.style.left = whiteKeysBefore * 25 - -6 + "px";

        // Append to keyboard container
        keyboard.appendChild(keyElement);
    });
}
// Dropdown to toggle how Middle C is labeled (C3, C4, or C5)
document.getElementById("middleC").addEventListener("change", (e) => {
    const mode = e.target.value;
    middleCShift = mode === "C3" ? -1 : mode === "C4" ? 0 : 1;
    generateKeyboard();
});
// On the first page load, generate the keyboard
document.addEventListener("DOMContentLoaded", generateKeyboard);

const toggleCOnly = document.getElementById("toggleCOnly");
const toggleAllLabels = document.getElementById("toggleAllLabels");
const keyboard = document.getElementById("keyboard");

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

/**
 * External MIDI-friendly interface
 * Allows external scripts to highlight/unhighlight keys by MIDI number
 */
window.PianoInterface = {
    noteOn(midiNote) {
        const el = document.querySelector(`[data-midi="${midiNote}"]`);
        if (el) el.classList.add("active");
    },
    noteOff(midiNote) {
        const el = document.querySelector(`[data-midi="${midiNote}"]`);
        if (el) el.classList.remove("active");
    },
};
