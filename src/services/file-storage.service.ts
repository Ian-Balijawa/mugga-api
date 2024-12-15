import { promises as fs } from 'fs';
import path from 'path';
import { AppError } from '../middlewares/error-handler.middleware';

export type FileCategory = 'posts' | 'coaches' | 'gallery' | 'facilities';

export class FileStorageService {
    private readonly uploadDir = 'public/uploads';
    private readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    private readonly allowedVideoTypes = ['video/mp4', 'video/webm'];
    private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

    constructor() {
        this.initializeStorage();
    }

    private async initializeStorage(): Promise<void> {
        try {
            await fs.mkdir(this.uploadDir, { recursive: true });
        } catch (error) {
            throw new AppError(500, 'Failed to initialize storage');
        }
    }

    async saveFile(
        file: Express.Multer.File,
        category: FileCategory
    ): Promise<string> {
        if (!file) {
            throw new AppError(400, 'No file provided');
        }

        if (!this.isValidFileType(file)) {
            throw new AppError(400, 'Invalid file type');
        }

        if (file.size > this.maxFileSize) {
            throw new AppError(400, 'File size exceeds limit');
        }

        const fileName = this.generateFileName(file.originalname);
        const filePath = path.join(this.uploadDir, category, fileName);

        try {
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, file.buffer);
            return `/${category}/${fileName}`;
        } catch (error) {
            throw new AppError(500, 'Failed to save file');
        }
    }

    private isValidFileType(file: Express.Multer.File): boolean {
        return (
            this.allowedImageTypes.includes(file.mimetype) ||
            this.allowedVideoTypes.includes(file.mimetype)
        );
    }

    private generateFileName(originalName: string): string {
        const timestamp = Date.now();
        const extension = path.extname(originalName);
        return `${timestamp}${extension}`;
    }

    async deleteFile(filePath: string): Promise<void> {
        try {
            await fs.unlink(path.join(this.uploadDir, filePath));
        } catch (error) {
            throw new AppError(500, 'Failed to delete file');
        }
    }
}
