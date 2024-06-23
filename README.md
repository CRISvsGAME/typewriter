# Typewriter

Typewriter is a simple JavaScript library to create typing effects.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Options](#options)
-   [License](#license)
-   [Repository](#repository)
-   [Author](#author)

## Installation

Clone the repository or download the files directly:

```
git clone https://github.com/CRISvsGAME/typewriter.git
```

Include the CSS and JS files in your project:

```
<link rel="stylesheet" href="assets/css/typewriter.css">
<script src="assets/js/typewriter.js"></script>
```

## Usage

-   Add the HTML structure with as many inputs as required:

```
<div id="typewriter">
    <div class="typewriter-output"></div>
    <div class="typewriter-input">First Input Here</div>
    <div class="typewriter-input">Second Input Here</div>
    <div class="typewriter-input">Third Input Here</div>
</div>
```

-   Initialize the Typewriter:

Accepting Defaults:

```
const typewriter = new Typewriter();
```

Passing Options:

```
const typewriter = new Typewriter('typewriter', {
    typeStartDelay: 2000,
    typeDelayMin: 100,
    typeDelayMax: 200,
    typeEndDelay: 1000,
    deleteDelayMin: 50,
    deleteDelayMax: 100,
    deleteEndDelay: 1000,
});
```

-   Start the Typewriter

```
typewriter.start();
```

-   Pause the Typewriter

```
typewriter.pause();
```

-   Stop the Typewriter:

```
typewriter.stop();
```

## Options

You can configure Typewriter with the following options:

-   typeStartDelay: Initial delay before starting to type (default: 2000ms).
-   typeDelayMin: Minimum delay for typing a character (default: 100ms).
-   typeDelayMax: Maximum delay for typing a character (default: 200ms).
-   typeEndDelay: Delay at the end of typing an input (default: 1000ms).
-   deleteDelayMin: Minimum delay for deleting a character (default: 50ms).
-   deleteDelayMax: Maximum delay for deleting a character (default: 100ms).
-   deleteEndDelay: Delay at the end of deleting an input (default: 1000ms).

## License

This project is licensed under the MIT License - see the [License](https://crisvsgame.com/license) file for details.

## Repository

[GitHub](https://github.com/CRISvsGAME/typewriter)

## Author

[@CRISvsGAME](https://crisvsgame.com)
