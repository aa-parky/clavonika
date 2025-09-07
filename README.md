# 🎹 Clavonika

> *An 88-key interactive MIDI piano keyboard for the Tonika ecosystem.*

Clavonika is a modular, open-source piano keyboard interface built for the web. It’s a core component of the [Tonika](https://github.com/aa-parky/tonika) project, designed to be a simple, beautiful, and highly responsive tool for visualizing MIDI input, playing with musical ideas, and integrating with other `*onika` modules.

- 🎹 **For musicians:** it’s a virtual piano that connects to your MIDI gear.
- 🧠 **For learners:** it’s a visual guide to notes, chords, and scales.
- 🧰 **For developers:** it’s a well-documented, easy-to-use module for any web project.

Clavonika is free, open source, and licensed under the MIT License.

---

## 💡 Philosophy

Clavonika follows the core principles of the Tonika project:

- **Creative-first**: A simple, elegant tool for musical play and exploration.
- **Modular**: Does one thing well and can stand alone or as part of the Tonika rack.
- **Friendly**: Strong docs, simple code, and room for tinkerers.
- **Accessible**: For learners, hobbyists, professionals, and educators.

---

## ✨ Features

- **88-Key Layout**: Full-size piano keyboard from A0 to C8.
- **MIDI Connectivity**: Automatically detects and connects to MIDI input devices.
- **Visual Feedback**: Instantly highlights incoming MIDI notes.
- **Customizable Labels**: Show all notes, only C notes, or no labels at all.
- **Configurable Middle C**: Adjust the octave numbering to match your DAW or other gear (C3, C4, or C5).
- **Standalone or Integrated**: Use it on its own or as part of the Tonika ecosystem.
- **Modern and Lightweight**: Built with vanilla JavaScript (ES modules) and CSS, no frameworks required.




---

## 🚀 Quick Start

Using Clavonika is simple. Just create a container element in your HTML and initialize the module.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Clavonika Demo</title>
    <link rel="stylesheet" href="css/clavonika.css">
</head>
<body>

<div id="piano-container"></div>

<script type="module">
    import Clavonika from './js/clavonika.js';

    const piano = Clavonika.init('piano-container');

    // You can also control the piano programmatically:
    setTimeout(() => {
        piano.noteOn(60); // Light up Middle C
    }, 1000);

    setTimeout(() => {
        piano.noteOff(60); // Turn off Middle C
    }, 2000);
</script>

</body>
</html>
```

---

## ⚙️ API Reference

Clavonika exposes a simple and clean API.

### `Clavonika.init(container)`

Initializes a new Clavonika instance.

- **`container`**: A string (the ID of the container element) or a DOM element.
- **Returns**: A piano instance object with `noteOn` and `noteOff` methods.

### `piano.noteOn(midiNote)`

Manually activates the visual representation of a key.

- **`midiNote`**: The MIDI note number (21–108) of the key to activate.

### `piano.noteOff(midiNote)`

Manually deactivates the visual representation of a key.

- **`midiNote`**: The MIDI note number (21–108) of the key to deactivate.




---

## 🚧 Development

Clavonika is built with plain HTML, CSS, and JavaScript (ES modules). It follows the Tonika design system principles and BEM CSS methodology.

### 🧱 Dev Philosophy

- **BEM CSS model** for all module UI.
- Clean separation of structure (HTML), style (CSS), and logic (JS).
- **No frameworks**—just the web platform.

### 🤝 Contributing

We welcome:
- Ideas and feedback from musicians and learners.
- Feature suggestions or UX ideas.
- Bug reports or performance issues.
- PRs with improvements or new features!

Feel free to fork and tinker—or raise an issue if you’re stuck.

---

## 📜 License

MIT License © 2025 [aa-parky](https://github.com/aa-parky)


