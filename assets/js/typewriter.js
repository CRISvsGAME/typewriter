/*!
 * Typewriter 1.0.0 by @CRISvsGAME - https://crisvsgame.com
 * Repository - https://github.com/CRISvsGAME/typewriter.git
 * License - https://crisvsgame.com/license (MIT License)
 * Copyright 2024 @CRISvsGAME
 */

/**
 * Options for configuring the Typewriter.
 * @typedef {Object} TypewriterOptions
 * @property {number} [typeStartDelay=2000] - Initial delay before starting to type.
 * @property {number} [typeDelayMin=100] - Minimum delay for typing a character.
 * @property {number} [typeDelayMax=200] - Maximum delay for typing a character.
 * @property {number} [typeEndDelay=1000] - Delay at the end of typing an input.
 * @property {number} [deleteDelayMin=50] - Minimum delay for deleting a character.
 * @property {number} [deleteDelayMax=100] - Maximum delay for deleting a character.
 * @property {number} [deleteEndDelay=1000] - Delay at the end of deleting an input.
 */

class Typewriter {
    /**
     * Creates a new Typewriter instance.
     * @param {string} [containerId='typewriter'] - The ID of the container element.
     * @param {TypewriterOptions} [options={}] - Configuration options for the Typewriter.
     */
    constructor(containerId = 'typewriter', options = {}) {
        this.container = document.getElementById(containerId);
        this.typewriterOutput = this.container.querySelector(`#${containerId} .typewriter-output`);
        this.typewriterInputs = Array.from(this.container.querySelectorAll('.typewriter-input'));
        this.typewriterIndex = 0;
        this.characterIndex = 0;
        this.typing = true;
        this.typewriterTimeout = null;
        this.options = options;
        this.typeStartDelay = options.typeStartDelay || 2000;
        this.typeDelayMin = options.typeDelayMin || 100;
        this.typeDelayMax = options.typeDelayMax || 200;
        this.typeEndDelay = options.typeEndDelay || 1000;
        this.deleteDelayMin = options.deleteDelayMin || 50;
        this.deleteDelayMax = options.deleteDelayMax || 100;
        this.deleteEndDelay = options.deleteEndDelay || 1000;
    }

    /**
     * Returns a random integer between min and max, inclusive.
     * @param {number} min - The minimum value.
     * @param {number} max - The maximum value.
     * @returns {number} - A random integer between min and max.
     */
    getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * The private method that handles the typing effect.
     * @private
     */
    #startTyping() {
        clearTimeout(this.typewriterTimeout);
        const currentText = this.typewriterInputs[this.typewriterIndex].innerText;
        if (this.typing) {
            if (this.characterIndex < currentText.length) {
                this.typewriterOutput.innerText += currentText[this.characterIndex];
                this.characterIndex++;
                this.typewriterTimeout = setTimeout(() => this.#startTyping(), this.getRandomInteger(this.typeDelayMin, this.typeDelayMax));
            } else {
                this.typing = false;
                this.typewriterTimeout = setTimeout(() => this.#startTyping(), this.typeEndDelay);
            }
        } else {
            if (this.characterIndex > 0) {
                this.typewriterOutput.innerText = this.typewriterOutput.innerText.slice(0, -1);
                this.characterIndex--;
                this.typewriterTimeout = setTimeout(() => this.#startTyping(), this.getRandomInteger(this.deleteDelayMin, this.deleteDelayMax));
            } else {
                this.typing = true;
                this.typewriterIndex = (this.typewriterIndex + 1) % this.typewriterInputs.length;
                this.typewriterTimeout = setTimeout(() => this.#startTyping(), this.deleteEndDelay);
            }
        }
    }

    /**
     * Starts the typing effect.
     * @param {number} [typeStartDelay=this.typeStartDelay] - Initial delay before starting to type.
     */
    start(typeStartDelay = this.typeStartDelay) {
        clearTimeout(this.typewriterTimeout);
        this.typewriterTimeout = setTimeout(() => this.#startTyping(), typeStartDelay);
    }

    /**
     * Pauses the typing effect.
     */
    pause() {
        clearTimeout(this.typewriterTimeout);
        this.typewriterTimeout = null;
    }

    /**
     * Stops the typing effect and resets the state.
     */
    stop() {
        clearTimeout(this.typewriterTimeout);
        this.typewriterTimeout = null;
        this.typewriterOutput.innerText = '';
        this.typewriterIndex = 0;
        this.characterIndex = 0;
        this.typing = true;
    }
}
