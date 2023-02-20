import { MICROSECONDS_PER_QUARTER_NOTE_DIVIDEND } from '../config';

export class TicksConverter {
    convertDurationToTicks(
        bpm: number,
        ticksPerBeat: number,
        fractionDuration: number,
    ): number {
        return Math.round(
            (MICROSECONDS_PER_QUARTER_NOTE_DIVIDEND / bpm / ticksPerBeat) *
                (1 / fractionDuration),
        );
    }
}
