import { DeltaTime, hexToBytes, Note2Hex, NoteCodes } from '../config';

export class Rtttl2Mid {
    // https://www.mobilefish.com/tutorials/midi/midi_quickguide_specification.html
    convertToMid(rtttl: string) {
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
        const tempo = Math.floor(60000000 / Number(options.split('b=')[1]))
            .toString(16)
            .padStart(6, '0')
            .match(/.{2}/g)!
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

        const note2hex = new Note2Hex();
        const deltaTime = new DeltaTime();

        for (const note of notes.split(',')) {
            const { noteCode, duration } = note2hex.convertToHex(note);

            let deltaTimeRelativeDuration;

            if (duration * 10 >= 320) {
                deltaTimeRelativeDuration = [0x82, 0x2c];
            } else {
                deltaTimeRelativeDuration = deltaTime.convertNumberToDeltaTime(
                    duration * 10,
                );
            }

            if (noteCode === NoteCodes.PAUSE) {
                lengthDependentMetadata.push(
                    ...[...deltaTimeRelativeDuration, 0x90, 25, 0x00],
                    ...[...deltaTimeRelativeDuration, 0x80, 30, 0x00],
                );
            } else {
                lengthDependentMetadata.push(
                    ...[0x00, 0x90, noteCode, 0x7f],
                    ...[...deltaTimeRelativeDuration, 0x80, noteCode, 0x00],
                );
            }
        }

        lengthDependentMetadata.push(...[0x00, 0xff, 0x2f, 0x00]);

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
            `export_${Date.now().toString()}.mid`,
            { type: 'audio/midi' },
        );
    }
}
