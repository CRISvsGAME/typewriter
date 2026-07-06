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
};

type TypewriterTarget = {
    root: HTMLElement;
    view: HTMLElement;
    options: TypewriterOptions;
    texts: string[];
    textIndex: number;
    charIndex: number;
    state: TypewriterState;
    nextTime: number;
};

type TypewriterSourceMode = "replace" | "append" | "prepend";

type TypewriterRuntimeState = typeof STOPPED | typeof RUNNING | typeof PAUSED;

type TypewriterState = typeof START_WAIT | typeof WRITING | typeof WRITE_WAIT | typeof DELETING | typeof DELETE_WAIT;

const STOPPED = 0;
const RUNNING = 1;
const PAUSED = 2;
const START_WAIT = 0;
const WRITING = 1;
const WRITE_WAIT = 2;
const DELETING = 3;
const DELETE_WAIT = 4;
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
};

export class Typewriter {
    private typewriters: TypewriterTarget[];
    private runtimeState: TypewriterRuntimeState = STOPPED;
    private frameId: number | null = null;

    constructor(typewriters: Partial<TypewriterOptions>[] = [{}]) {
        this.typewriters = [];

        const registeredRoots = new Set<HTMLElement>();

        for (const typewriter of typewriters) {
            const options = { ...defaultTypewriterOptions, ...typewriter };

            // Validate Options

            const selector = `${ROOT_SELECTOR}${options.selector}`;
            const roots = document.querySelectorAll<HTMLElement>(selector);

            if (roots.length === 0) {
                console.warn(`Typewriter: No root element found for selector "${selector}". Skipping this typewriter instance.`);
                continue;
            }

            const optTexts = typewriter.texts?.filter((t) => t.length > 0) ?? [];

            for (const root of roots) {
                if (registeredRoots.has(root)) {
                    console.warn(`Typewriter: Root element already registered for selector "${selector}". Skipping this typewriter duplicate.`);
                    continue;
                }

                const view = root.querySelector<HTMLElement>(VIEW_SELECTOR);

                if (view === null) {
                    console.warn(`Typewriter: No view element found for selector "${selector}". Skipping this typewriter instance.`);
                    continue;
                }

                registeredRoots.add(root);

                const domTexts = Array.from(root.querySelectorAll(TEXT_SELECTOR))
                    .map((e) => e.textContent ?? "")
                    .filter((t) => t.length > 0);

                let texts: string[];

                switch (options.sourceMode) {
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
                    texts = defaultTypewriterOptions.texts;
                }

                this.typewriters.push({
                    root,
                    view,
                    options,
                    texts,
                    textIndex: 0,
                    charIndex: 0,
                    state: START_WAIT,
                    nextTime: performance.now() + options.startDelay,
                });
            }
        }
    }

    private static randomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
            this.runtimeState = PAUSED;
        }
    };

    public stop = (): void => {
        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }

        this.runtimeState = STOPPED;
    };
}
