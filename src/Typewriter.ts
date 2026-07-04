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
};

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
};

export class Typewriter {
    private typewriters: TypewriterOptions[];

    constructor(typewriters: Partial<TypewriterOptions>[] = []) {
        let t = typewriters.map((typewriter) => {
            return { ...defaultTypewriterOptions, ...typewriter };
        });

        this.typewriters = t;
    }
}
