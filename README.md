## Jackonika Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Clavonika Bundled</title>
</head>
<body>
<!-- Container for the piano -->
<div id="piano-container"></div>

<script src="js/jackonika.js"></script>

<!-- Include the bundled file -->
<script src="js/bundled-clavonika.js"></script>

<!-- Initialize the piano -->
<script>
    Clavonika.init('piano-container');
</script>

<script>
    const piano = Clavonika.init('piano-container');

    Jackonika.init({
        onNoteOn:  (note, vel) => piano.noteOn?.(note),
        onNoteOff: (note)      => piano.noteOff?.(note),
    });
</script>

</body>
</html>
```
