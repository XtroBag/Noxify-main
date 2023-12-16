import fs from 'fs'
import path from 'path';

export function findFile(rootDir: string, fileName: string): string | null {
    const files = fs.readdirSync(rootDir);

    for (const file of files) {
        const filePath = path.join(rootDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const foundFilePath = findFile(filePath, fileName);
            if (foundFilePath) {
                return foundFilePath;
            }
        } else if (file === fileName) {
            return filePath;
        }
        
    }
    

    return null;
}