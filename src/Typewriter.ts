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

type TypewriterState = typeof START_WAIT | typeof WRITING | typeof WRITE_WAIT | typeof DELETING | typeof DELETE_WAIT;

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
}
