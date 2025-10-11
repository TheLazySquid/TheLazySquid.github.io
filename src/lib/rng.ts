import { Isaac } from "isaac-prng";
import { modBigInt, stringToCodes } from "./util";

export default class PRNG {
    isaac: Isaac;
    
    constructor(...seed: (string | number)[]) {
        this.isaac = new Isaac(this.#toSeed(seed));
    }

    #toSeed(seed: (string | number)[]) {
        let result: number[] = [];

        for(let item of seed) {
            if(typeof item === "string") {
                result = result.concat(stringToCodes(item));
            } else {
                result.push(item);
            }
        }

        return result;
    }

    setSeed(...seed: (string | number)[]) {
        this.isaac = new Isaac(this.#toSeed(seed));
    }

    random(max: number) {
        return Number(modBigInt(this.isaac.nextInt(), max));
    }

    randomRange(min: number, max: number) {
        return this.random(max - min) + min;
    }
}