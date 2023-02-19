import {
    INSTRUCTION_IDS,
    BINARY_TO_NOTE,
    BINARY_TO_DURATION,
    BINARY_TO_NOTE_DURATION_SPECIFIER,
    BINARY_TO_SCALE,
    BEATS_PER_MINUTE_ENCODING,
} from '../config';

const DEFAULT_BPM = 63;

export class Rtx2Rtttl {
    patternHeader!: string;
    commandLength!: string;
    ringingToneProgramming!: string;
    sound!: string;
    basicSongType!: string;
    songSequenceLength!: string;
    patternId!: string;
    loopValue!: boolean;
    patternSpecifier!: string;

    // https://ozekisms.com/p_2216-mobile-message-type-specification-ringtone-sms.html
    convertToRtttl(binary: string) {
        let offset = 0;

        this.commandLength = binary.slice(offset, offset + 8);

        offset += 8;

        this.ringingToneProgramming = binary.slice(offset, offset + 8);

        offset += 8;

        this.sound = binary.slice(offset, offset + 7);

        offset += 7;

        this.basicSongType = binary.slice(offset, offset + 3);

        if (this.basicSongType !== '001') {
            throw new Error(
                `expected basic song type 001, got ${this.basicSongType}`,
            );
        }

        offset += 3;

        const songTitleLength = parseInt(binary.slice(offset, offset + 4), 2);

        offset += 4;

        let title = binary
            .slice(offset, offset + songTitleLength * 8)
            .match(/.{8}/g)!
            .map((value) => String.fromCharCode(parseInt(value, 2)))
            .join('');

        offset += songTitleLength * 8;

        this.songSequenceLength = binary.slice(offset, offset + 8);

        offset += 8;

        this.patternHeader = binary.slice(offset, offset + 3);

        offset += 3;

        this.patternId = binary.slice(offset, offset + 2);

        offset += 2;

        this.loopValue = Boolean(parseInt(binary.slice(offset, offset + 4), 2));

        offset += 4;

        this.patternSpecifier = binary.slice(offset, offset + 8);

        offset += 8;

        let instructions = [];

        let i = offset;

        while (i < binary.length) {
            if (binary.slice(i, i + 7) === '0'.repeat(7)) {
                break;
            }

            const instructionId = parseInt(binary.slice(i, i + 3), 2);

            i += 3;

            if (instructionId === INSTRUCTION_IDS.NOTE) {
                instructions.push({
                    id: instructionId,
                    note: BINARY_TO_NOTE[binary.slice(i, i + 4)],
                    duration:
                        BINARY_TO_DURATION[binary.slice(i + 4, i + 4 + 3)],
                    durationSpecifier:
                        BINARY_TO_NOTE_DURATION_SPECIFIER[
                            binary.slice(i + 4 + 3, i + 4 + 3 + 2)
                        ],
                });

                i += 9;
            } else if (instructionId === INSTRUCTION_IDS.SCALE) {
                instructions.push({
                    id: instructionId,
                    scale: BINARY_TO_SCALE[binary.slice(i, i + 2)],
                });

                i += 2;
            } else if (instructionId === INSTRUCTION_IDS.TEMPO) {
                instructions.push({
                    id: instructionId,
                    tempo: BEATS_PER_MINUTE_ENCODING[binary.slice(i, i + 5)],
                });

                i += 5;
            } else if (instructionId === INSTRUCTION_IDS.STYLE) {
                i += 2;
            } else if (instructionId === INSTRUCTION_IDS.VOLUME) {
                i += 4;
            }
        }

        console.log(instructions);

        let rtttl = `${title}:d=8,o=4,b=${
            instructions.find((a) => typeof a.tempo !== 'undefined')!.tempo ||
            DEFAULT_BPM
        }:`;

        const notes = [];

        let currentScale = 1;

        for (const instruction of instructions) {
            if (instruction.id === INSTRUCTION_IDS.NOTE) {
                notes.push(
                    `${instruction.duration}${instruction.note}${
                        instruction.note === 'p' ? '' : currentScale + 3
                    }${
                        instruction.durationSpecifier === 'dotted note'
                            ? '.'
                            : ''
                    }`,
                );
            } else if (instruction.id === INSTRUCTION_IDS.SCALE) {
                currentScale = instruction.scale!;
            }
        }

        return rtttl + notes.join(',');
    }
}
