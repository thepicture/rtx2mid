import { NoteCodes, NOTE_TO_NUMBER } from '../config';

const DEFAULT_OCTAVE_NUMBER = 4;

const DURATION_PITCH_OCTAVE_EXTRACTOR = /(\d+)([a-z#]+)(\d+)?/;

interface NoteComponentContainer {
    noteCode: number;
    duration: number;
    velocity: number;
}

export class NoteConverter {
    convertToComponents(note: string): NoteComponentContainer {
        const [duration, pitch, octave = DEFAULT_OCTAVE_NUMBER] =
            this.extractNoteComponents(note);

        if (this.isPause(note)) {
            return {
                noteCode: NoteCodes.PAUSE,
                duration: Number(duration),
                velocity: 0,
            };
        }

        return {
            noteCode: NOTE_TO_NUMBER[pitch] + Number(octave) * 12,
            duration: Number(duration),
            velocity: 127,
        };
    }

    private extractNoteComponents(note: string): string[] {
        return note.match(DURATION_PITCH_OCTAVE_EXTRACTOR)!.slice(1);
    }

    private isPause(note: string): boolean {
        return note.includes('p');
    }
}
