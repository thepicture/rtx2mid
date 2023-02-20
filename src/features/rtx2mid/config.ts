export interface Indexable<T> {
    [index: string]: T;
}

export class INSTRUCTION_IDS {
    static HEADER = 0b000;
    static NOTE = 0b001;
    static SCALE = 0b010;
    static STYLE = 0b011;
    static TEMPO = 0b100;
    static VOLUME = 0b101;
}

export class NoteCodes {
    static PAUSE = -1;
}

export const NOTE_TO_NUMBER: Indexable<number> = {
    c: 0,
    'c#': 1,
    d: 2,
    'd#': 3,
    e: 4,
    f: 5,
    'f#': 6,
    g: 7,
    'g#': 8,
    a: 9,
    'a#': 10,
    h: 11,
    p: 0,
};

export const BEATS_PER_MINUTE_ENCODING: Indexable<number> = {
    '00000': 25,
    '00001': 28,
    '00010': 31,
    '00011': 35,
    '00100': 40,
    '00101': 45,
    '00110': 50,
    '00111': 56,
    '01000': 63,
    '01001': 70,
    '01010': 80,
    '01011': 90,
    '01100': 100,
    '01101': 112,
    '01110': 125,
    '01111': 140,
    10000: 160,
    10001: 180,
    10010: 200,
    10011: 225,
    10100: 250,
    10101: 285,
    10110: 320,
    10111: 355,
    11000: 400,
    11001: 450,
    11010: 500,
    11011: 565,
    11100: 635,
    11101: 715,
    11110: 800,
    11111: 900,
};

export const BINARY_TO_NOTE: Indexable<string> = {
    '0000': 'p',
    '0001': 'c',
    '0010': 'c#',
    '0011': 'd',
    '0100': 'd#',
    '0101': 'e',
    '0110': 'f',
    '0111': 'f#',
    1000: 'g',
    1001: 'g#',
    1010: 'a',
    1011: 'a#',
    1100: 'h',
};

export const BINARY_TO_SCALE: Indexable<number> = {
    '00': 1,
    '01': 2,
    10: 3,
    11: 4,
};

export const BINARY_TO_DURATION: Indexable<string> = {
    '000': '1',
    '001': '2',
    '010': '4',
    '011': '8',
    100: '16',
    101: '32',
};

export const BINARY_TO_NOTE_DURATION_SPECIFIER: Indexable<string> = {
    '00': 'no special duration',
    '01': 'dotted note',
    10: 'double dotted note',
    11: '2/3 length',
};

export const hexToBytes = (hex: string) => {
    let bytes = [];

    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substring(i, i + 2), 16));
    }

    return bytes;
};

export const EVERY_2_DIGITS_REGEXP = /.{2}/g;

export const MICROSECONDS_PER_QUARTER_NOTE_DIVIDEND = 60_000_000;

export const MIDI_MIME_TYPE = { type: 'audio/midi' };
