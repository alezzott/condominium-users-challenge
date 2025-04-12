import csvParser from 'csv-parser';
import fs from 'fs';

class CsvParser {
  static async parse<T>(filePath: string): Promise<T[]> {
    const results: T[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';' }))
        .on('data', (data: T) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', err => reject(err));
    });
  }
}

export default CsvParser;
