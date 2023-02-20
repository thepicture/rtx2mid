import { MICROSECONDS_PER_QUARTER_NOTE_DIVIDEND } from '../config';

export class TicksConverter {
    convertDurationToTicks(
        bpm: number,
        ticksPerBeat: number,
        fractionDuration: number,
        shouldUseDotNotation: boolean = false,
    ): number {
        const ticks = Math.round(
            (MICROSECONDS_PER_QUARTER_NOTE_DIVIDEND / bpm / ticksPerBeat) *
                (1 / fractionDuration),
        );

        if (shouldUseDotNotation) {
            return ticks + ticks / 2;
        } else {
            return ticks;
        }
    }
}
