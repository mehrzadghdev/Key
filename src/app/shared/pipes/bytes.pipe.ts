import { Pipe, PipeTransform } from '@angular/core';

export type ByteUnit = 'B' | 'kB' | 'KB' | 'MB' | 'GB' | 'TB';

@Pipe({
  name: 'bytes'
})
export class BytesPipe implements PipeTransform {
  static formats: { [key: string]: { max: number; prev?: ByteUnit } } = {
    B: { max: 1024 },
    'کیلوبایت': { max: Math.pow(1024, 2), prev: 'B' },
    'کیلو بایت': { max: Math.pow(1024, 2), prev: 'B' }, // Backward compatible
    'مگابایت': { max: Math.pow(1024, 3), prev: 'kB' },
    'گیگابایت': { max: Math.pow(1024, 4), prev: 'MB' },
    'ترابایت': { max: Number.MAX_SAFE_INTEGER, prev: 'GB' },
  };

  transform(input: any, decimal: number = 0, from: ByteUnit = 'B', to?: ByteUnit): any {
    if (!(typeof input === 'number' && isFinite(input)) && (typeof decimal === 'number' && isFinite(decimal)) && decimal % 1 === 0 && decimal >= 0) {
      return input;
    }

    let bytes = input;
    let unit = from;
    while (unit !== 'B') {
      bytes *= 1024;
      unit = BytesPipe.formats[unit].prev!;
    }

    if (to) {
      const format = BytesPipe.formats[to];

      const result = Math.round(BytesPipe.calculateResult(format, bytes) * Math.pow(10, decimal)) / Math.pow(10, decimal);

      return BytesPipe.formatResult(result, to);
    }

    for (const key in BytesPipe.formats) {
      if (BytesPipe.formats.hasOwnProperty(key)) {
        const format = BytesPipe.formats[key];
        if (bytes < format.max) {
          const result = Math.round(BytesPipe.calculateResult(format, bytes) * Math.pow(10, decimal)) / Math.pow(10, decimal);

          return BytesPipe.formatResult(result, key);
        }
      }
    }
  }

  static formatResult(result: number, unit: string): string {
    return `${result} ${unit}`;
  }

  static calculateResult(format: { max: number; prev?: ByteUnit }, bytes: number) {
    const prev = format.prev ? BytesPipe.formats[format.prev] : undefined;
    return prev ? bytes / prev.max : bytes;
  }
}
