// ===============================
// clavonika-samples.js (Clean, Debug-Ready)
// ===============================

export default async function initSampleWrapper({ Clavonika, Soundonika, pianoInstance }) {
    let selectedSamplePack = null;

    const checkbox = document.getElementById("enable-samples");
    const dropdown = document.getElementById("sample-selector");

    const sampleIndex = await fetchSampleIndex();
    populateDropdown(sampleIndex, checkbox);

    const piano = pianoInstance;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const engine = new Soundonika.Engine(audioCtx, {
        sampleBasePath: "samples",
        volume: 0.9
    });

    await engine.init();

    console.log("[DEBUG] Sample engine initialized.");
    console.log("[DEBUG] engine.sampleIndex:", engine.sampleIndex);
    console.log("[DEBUG] typeof sampleIndex:", typeof sampleIndex);
    console.log("[DEBUG] Loaded sample count:", engine.sampleBuffers?.size || 0);

    checkbox.addEventListener("change", (e) => {
        dropdown.disabled = !e.target.checked;
    });

    dropdown.addEventListener("change", (e) => {
        selectedSamplePack = e.target.value;
    });

    // Save original functions and bind for safety
    const originalNoteOn = piano.noteOn.bind(piano);
    const originalNoteOff = piano.noteOff.bind(piano);

    // Override noteOn to include sample triggering
    piano.noteOn = function(midiNote, velocity = 1.0) {
        originalNoteOn(midiNote, velocity);

        if (checkbox.checked && selectedSamplePack) {
            const soundType = `piano/${selectedSamplePack}/note_${midiNote}.wav`;
            console.log("[DEBUG] Triggering sample:", soundType);
            engine.scheduleSound(audioCtx.currentTime, soundType, velocity);
        }
    };

    // Override noteOff for completeness
    piano.noteOff = function(midiNote) {
        originalNoteOff(midiNote);
    };
}

async function fetchSampleIndex() {
    try {
        const response = await fetch("samples/sample-index.json");
        return await response.json();
    } catch (e) {
        console.error("Failed to fetch sample index:", e);
        return {};
    }
}

function populateDropdown(index, checkbox) {
    const dropdown = document.getElementById("sample-selector");
    dropdown.innerHTML = "";
    const pianoPacks = index.piano || {};
    Object.keys(pianoPacks).forEach((packName) => {
        const opt = document.createElement("option");
        opt.value = packName;
        opt.textContent = packName;
        dropdown.appendChild(opt);
    });

    dropdown.disabled = !checkbox.checked;
}