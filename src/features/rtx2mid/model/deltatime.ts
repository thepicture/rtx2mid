export class DeltaTime {
    // https://github.com/sergi/jsmidi/blob/master/midi.js
    convertNumberToDeltaTime(ticks: number): number[] {
        let buffer = ticks & 0x7f;

        while ((ticks = ticks >> 7)) {
            buffer = buffer << 8;
            buffer |= (ticks & 0x7f) | 0x80;
        }

        const bufferList: number[] = [];

        while (true) {
            bufferList.push(buffer & 0xff);

            if (buffer & 0x80) {
                buffer = buffer >> 8;
            } else {
                break;
            }
        }

        return [
            ...new Array<number>(4 - bufferList.length).fill(0x00),
            ...bufferList,
        ];
    }
}
