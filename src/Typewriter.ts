export type TypewriterOptions = {
    selector: string;
    texts: string[];
    startDelay: number;
    holdAfterWrite: number;
    holdAfterDelete: number;
    minWriteDelay: number;
    maxWriteDelay: number;
    minDeleteDelay: number;
    maxDeleteDelay: number;
    sourceMode: TypewriterSourceMode;
    cursor: boolean;
    cursorText: string;
    cursorBlinkInterval: number;
};

type TypewriterTarget = {
    root: HTMLElement;
    view: HTMLElement;
    value: HTMLElement;
    options: TypewriterOptions;
    cursor: TypewriterCursor | null;
    texts: string[];
    textIndex: number;
    charIndex: number;
    state: TypewriterState;
    nextTime: number;
};

type TypewriterCursor = {
    element: HTMLElement;
    text: string;
    blinkInterval: number;
    nextBlinkTime: number;
    visible: boolean;
};

type TypewriterSourceMode = "replace" | "append" | "prepend";

type TypewriterRuntimeState = typeof STOPPED | typeof RUNNING | typeof PAUSED;

type TypewriterState = typeof START_WAIT | typeof WRITING | typeof WRITE_WAIT | typeof DELETING | typeof DELETE_WAIT | typeof RESETTING;

const STOPPED = 0;
const RUNNING = 1;
const PAUSED = 2;
const START_WAIT = 0;
const WRITING = 1;
const WRITE_WAIT = 2;
const DELETING = 3;
const DELETE_WAIT = 4;
const RESETTING = 5;
const ROOT_CLASS = "cvg-typewriter";
const TEXT_CLASS = "cvg-typewriter__text";
const VIEW_CLASS = "cvg-typewriter__view";
const ROOT_SELECTOR = `.${ROOT_CLASS}`;
const TEXT_SELECTOR = `.${TEXT_CLASS}`;
const VIEW_SELECTOR = `.${VIEW_CLASS}`;

const defaultTypewriterOptions: TypewriterOptions = {
    selector: "",
    texts: ["Typewriter", "Animation", "Library"],
    startDelay: 100,
    holdAfterWrite: 1000,
    holdAfterDelete: 100,
    minWriteDelay: 100,
    maxWriteDelay: 200,
    minDeleteDelay: 50,
    maxDeleteDelay: 100,
    sourceMode: "replace",
    cursor: true,
    cursorText: "|",
    cursorBlinkInterval: 500,
};

export class Typewriter {
    private typewriters: TypewriterTarget[] = [];
    private runtimeState: TypewriterRuntimeState = STOPPED;
    private frameId: number | null = null;
    private registeredRoots: Set<HTMLElement> = new Set<HTMLElement>();

    constructor(options: Partial<TypewriterOptions> | Partial<TypewriterOptions>[] = [{}]) {
        const optionsArray = Array.isArray(options) ? options : [options];

        for (const o of optionsArray) {
            this.resolveTargets(o);
        }
    }

    private static randomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    private hardResetTypewriters = (): void => {
        const time = performance.now();

        for (const typewriter of this.typewriters) {
            typewriter.textIndex = 0;
            typewriter.charIndex = 0;
            typewriter.state = START_WAIT;
            typewriter.nextTime = time + typewriter.options.startDelay;
            typewriter.view.textContent = "";
        }
    };

    private gracefulResetTypewriters = (): void => {
        const time = performance.now();

        for (const typewriter of this.typewriters) {
            typewriter.state = RESETTING;
            typewriter.nextTime = time;
        }
    };

    private resetDelete = (typewriter: TypewriterTarget, time: number): void => {
        const text = typewriter.texts[typewriter.textIndex]!;
        const options = typewriter.options;

        if (typewriter.charIndex <= 0) {
            typewriter.textIndex = 0;
            typewriter.charIndex = 0;
            typewriter.state = START_WAIT;
            typewriter.nextTime = time + options.startDelay;
            return;
        }

        typewriter.charIndex--;
        typewriter.view.textContent = text.substring(0, typewriter.charIndex);
        typewriter.nextTime = time + Typewriter.randomInt(options.minDeleteDelay, options.maxDeleteDelay);
    };

    private update = (typewriter: TypewriterTarget, time: number): void => {
        if (time < typewriter.nextTime) return;

        switch (typewriter.state) {
            case START_WAIT:
                typewriter.state = WRITING;
                typewriter.nextTime = time;
                break;
            case WRITING:
                this.write(typewriter, time);
                break;
            case WRITE_WAIT:
                typewriter.state = DELETING;
                typewriter.nextTime = time;
                break;
            case DELETING:
                this.delete(typewriter, time);
                break;
            case DELETE_WAIT:
                typewriter.textIndex = (typewriter.textIndex + 1) % typewriter.texts.length;
                typewriter.charIndex = 0;
                typewriter.state = WRITING;
                typewriter.nextTime = time;
                break;
            case RESETTING:
                this.resetDelete(typewriter, time);
                break;
        }
    };

    private write = (typewriter: TypewriterTarget, time: number): void => {
        const text = typewriter.texts[typewriter.textIndex]!;
        const options = typewriter.options;

        if (typewriter.charIndex >= text.length) {
            typewriter.state = WRITE_WAIT;
            typewriter.nextTime = time + options.holdAfterWrite;
            return;
        }

        typewriter.charIndex++;
        typewriter.view.textContent = text.substring(0, typewriter.charIndex);
        typewriter.nextTime = time + Typewriter.randomInt(options.minWriteDelay, options.maxWriteDelay);
    };

    private delete = (typewriter: TypewriterTarget, time: number): void => {
        const text = typewriter.texts[typewriter.textIndex]!;
        const options = typewriter.options;

        if (typewriter.charIndex <= 0) {
            typewriter.state = DELETE_WAIT;
            typewriter.nextTime = time + options.holdAfterDelete;
            return;
        }

        typewriter.charIndex--;
        typewriter.view.textContent = text.substring(0, typewriter.charIndex);
        typewriter.nextTime = time + Typewriter.randomInt(options.minDeleteDelay, options.maxDeleteDelay);
    };

    private animate = (time: number): void => {
        if (this.runtimeState !== RUNNING) {
            this.frameId = null;
            return;
        }

        for (const typewriter of this.typewriters) {
            this.update(typewriter, time);
        }

        this.frameId = requestAnimationFrame(this.animate);
    };

    public start = (): void => {
        if (this.runtimeState === RUNNING) return;
        if (this.typewriters.length === 0) return;

        this.runtimeState = RUNNING;
        this.frameId = requestAnimationFrame(this.animate);
    };

    public pause = (): void => {
        if (this.runtimeState !== RUNNING) return;

        this.runtimeState = PAUSED;

        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    };

    public reset = (): void => {
        if (this.runtimeState !== RUNNING) {
            this.hardResetTypewriters();
            return;
        }

        this.gracefulResetTypewriters();
    };

    public stop = (): void => {
        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }

        this.runtimeState = STOPPED;
        this.hardResetTypewriters();
    };

    private resolveTargets = (options: Partial<TypewriterOptions>): void => {
        const o: TypewriterOptions = { ...defaultTypewriterOptions, ...options };
        const skip = "Skipping this typewriter instance.";

        if (typeof o.selector !== "string") {
            console.warn(`Typewriter: Invalid selector "${o.selector}". It should be a string. ${skip}`);
            return;
        }

        if (!Array.isArray(o.texts) || !o.texts.every((t) => typeof t === "string")) {
            console.warn(`Typewriter: Invalid texts "${o.texts}". It should be an array of strings. ${skip}`);
            return;
        }

        const selector = `${ROOT_SELECTOR}${o.selector}`;
        let roots: NodeListOf<HTMLElement>;

        try {
            roots = document.querySelectorAll<HTMLElement>(selector);
        } catch (error) {
            console.warn(`Typewriter: Invalid selector "${selector}". ${skip}`);
            return;
        }

        if (roots.length === 0) {
            console.warn(`Typewriter: No root element found for selector "${selector}". ${skip}`);
            return;
        }

        if (!Number.isInteger(o.startDelay) || o.startDelay < 0) {
            console.warn(`Typewriter: Invalid startDelay "${o.startDelay}". It should be a non-negative integer. ${skip}`);
            return;
        }

        if (!Number.isInteger(o.holdAfterWrite) || o.holdAfterWrite < 0) {
            console.warn(`Typewriter: Invalid holdAfterWrite "${o.holdAfterWrite}". It should be a non-negative integer. ${skip}`);
            return;
        }

        if (!Number.isInteger(o.holdAfterDelete) || o.holdAfterDelete < 0) {
            console.warn(`Typewriter: Invalid holdAfterDelete "${o.holdAfterDelete}". It should be a non-negative integer. ${skip}`);
            return;
        }

        if (!Number.isInteger(o.minWriteDelay) || o.minWriteDelay < 0) {
            console.warn(`Typewriter: Invalid minWriteDelay "${o.minWriteDelay}". It should be a non-negative integer. ${skip}`);
            return;
        }

        if (!Number.isInteger(o.maxWriteDelay) || o.maxWriteDelay < 0) {
            console.warn(`Typewriter: Invalid maxWriteDelay "${o.maxWriteDelay}". It should be a non-negative integer. ${skip}`);
            return;
        }

        if (o.minWriteDelay > o.maxWriteDelay) {
            console.warn(`Typewriter: minWriteDelay "${o.minWriteDelay}" is greater than maxWriteDelay "${o.maxWriteDelay}". ${skip}`);
            return;
        }

        if (!Number.isInteger(o.minDeleteDelay) || o.minDeleteDelay < 0) {
            console.warn(`Typewriter: Invalid minDeleteDelay "${o.minDeleteDelay}". It should be a non-negative integer. ${skip}`);
            return;
        }

        if (!Number.isInteger(o.maxDeleteDelay) || o.maxDeleteDelay < 0) {
            console.warn(`Typewriter: Invalid maxDeleteDelay "${o.maxDeleteDelay}". It should be a non-negative integer. ${skip}`);
            return;
        }

        if (o.minDeleteDelay > o.maxDeleteDelay) {
            console.warn(`Typewriter: minDeleteDelay "${o.minDeleteDelay}" is greater than maxDeleteDelay "${o.maxDeleteDelay}". ${skip}`);
            return;
        }

        if (!["replace", "append", "prepend"].includes(o.sourceMode)) {
            console.warn(`Typewriter: Invalid sourceMode "${o.sourceMode}". It should be one of "replace", "append", or "prepend". ${skip}`);
            return;
        }

        const optTexts = options.texts?.filter((t) => t.length > 0) ?? [];

        for (const root of roots) {
            if (this.registeredRoots.has(root)) {
                console.warn(`Typewriter: Root element already registered for selector "${selector}". Skipping this typewriter duplicate.`);
                continue;
            }

            const view = root.querySelector<HTMLElement>(VIEW_SELECTOR);

            if (view === null) {
                console.warn(`Typewriter: No view element found for selector "${selector}". Skipping this typewriter instance.`);
                continue;
            }

            this.registeredRoots.add(root);

            const domTexts = Array.from(root.querySelectorAll(TEXT_SELECTOR))
                .map((e) => e.textContent ?? "")
                .filter((t) => t.length > 0);

            let texts: string[];

            switch (o.sourceMode) {
                case "append":
                    texts = [...domTexts, ...optTexts];
                    break;
                case "prepend":
                    texts = [...optTexts, ...domTexts];
                    break;
                case "replace":
                    texts = optTexts.length > 0 ? optTexts : domTexts;
                    break;
            }

            if (texts.length === 0) {
                texts = [...defaultTypewriterOptions.texts];
            }

            this.typewriters.push({
                root,
                view,
                options: o,
                texts,
                textIndex: 0,
                charIndex: 0,
                state: START_WAIT,
                nextTime: performance.now() + o.startDelay,
            });
        }
    };
}
