import {
    EVERY_2_DIGITS_REGEXP,
    hexToBytes,
    MICROSECONDS_PER_QUARTER_NOTE_DIVIDEND,
    MIDI_MIME_TYPE,
} from '../config';

import { DeltaTime } from './deltatime';
import { NoteConverter } from './note2hex';
import { TicksConverter } from './ticks';

const RTTTL_BPM_REGEXP = /b=(\d+)/;

const TICKS_PER_BEAT = 960;
export class Rtttl2Mid {
    // https://www.mobilefish.com/tutorials/midi/midi_quickguide_specification.html
    convertRtttlToMidiFile(rtttl: string): File {
        const midiHeader = [0x4d, 0x54, 0x68, 0x64];
        const midiHeaderLength = [0x00, 0x00, 0x00, 0x06];
        const singleMultiChannelTrack = [0x00, 0x00];

        const numberOfTracks = [0x00, 0x01];

        const timeCodeBasedTime = [0x01, 0xe0];

        const trackHeader = [0x4d, 0x54, 0x72, 0x6b];

        const [title, options, notes] = rtttl.split(':');

        const metadata = [0x00, 0xff, 0x03, title.length];

        const trackName = Array.from(title).map((letter) =>
            letter.charCodeAt(0),
        );

        const copyright = [0x00, 0xff, 0x02, 0x00];

        const deltaTimeDescriptor = [0x00, 0xff, 0x58, 0x04];
        const timeSignature = [0x04, 0x02, 0x18, 0x08];
        const tempoDescriptor = [0x00, 0xff, 0x51, 0x03];

        const bpm = Number(options.match(RTTTL_BPM_REGEXP)![1]);
        const tempo = Math.floor(
            (MICROSECONDS_PER_QUARTER_NOTE_DIVIDEND / bpm) * 3,
        )
            .toString(16)
            .padStart(6, '0')
            .match(EVERY_2_DIGITS_REGEXP)!
            .map((v) => parseInt(v, 16));

        const instrumentPick = [0x00, 0xc0, 0x4f];
        const lengthDependentMetadata = [
            ...metadata,
            ...trackName,
            ...copyright,
            ...deltaTimeDescriptor,
            ...timeSignature,
            ...tempoDescriptor,
            ...tempo,
            ...instrumentPick,
        ];

        const note2hex = new NoteConverter();
        const deltaTime = new DeltaTime();
        const ticksConverter = new TicksConverter();

        for (const note of notes.split(',')) {
            const { noteCode, duration, velocity } =
                note2hex.convertToComponents(note);

            const ticks = ticksConverter.convertDurationToTicks(
                bpm,
                TICKS_PER_BEAT,
                duration,
            );

            const deltaTimeDuration = deltaTime.convertNumberToDeltaTime(ticks);

            lengthDependentMetadata.push(
                ...[0x00],
                ...[0x90, noteCode, velocity],
                ...deltaTimeDuration,
                ...[0x80, noteCode, 0x00],
            );
        }

        lengthDependentMetadata.push(0x00, 0xff, 0x2f, 0x00);

        const contentBytes = hexToBytes(
            lengthDependentMetadata.length.toString(16).padStart(4, '0'),
        );

        return new File(
            [
                new Uint8Array([
                    ...midiHeader,
                    ...midiHeaderLength,
                    ...singleMultiChannelTrack,
                    ...numberOfTracks,
                    ...timeCodeBasedTime,
                    ...trackHeader,
                    ...[
                        ...new Array(4 - contentBytes.length).fill(0x00),
                        ...contentBytes,
                    ],
                    ...lengthDependentMetadata,
                ]),
            ],
            this.generateFilename(),
            MIDI_MIME_TYPE,
        );
    }

    private generateFilename(): string {
        return `rtx2midi_${Date.now().toString()}.mid`;
    }
}
