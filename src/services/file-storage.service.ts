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
            await fs.mkdir( this.uploadDir, { recursive: true } );
        } catch ( error ) {
            throw new AppError( 500, 'Failed to initialize storage' );
        }
    }

    async saveFile(
        file: Express.Multer.File,
        category: FileCategory
    ): Promise<string> {
        if ( !file ) {
            throw new AppError( 400, 'No file provided' );
        }

        if ( !this.isValidFileType( file ) ) {
            throw new AppError( 400, 'Invalid file type' );
        }

        if ( file.size > this.maxFileSize ) {
            throw new AppError( 400, 'File size exceeds limit' );
        }

        const fileName = this.generateFileName( file.originalname );
        const categoryPath = path.join( this.uploadDir, category );
        const filePath = path.join( categoryPath, fileName );

        try {
            await fs.mkdir( categoryPath, { recursive: true } );
            await fs.writeFile( filePath, file.buffer );
            return `/${category}/${fileName}`;
        } catch ( error ) {
            console.error( 'File save error:', error );
            throw new AppError( 500, 'Failed to save file' );
        }
    }

    private isValidFileType( file: Express.Multer.File ): boolean {
        return (
            this.allowedImageTypes.includes( file.mimetype ) ||
            this.allowedVideoTypes.includes( file.mimetype )
        );
    }

    private generateFileName( originalName: string ): string {
        const timestamp = Date.now();
        const extension = path.extname( originalName );
        return `${timestamp}${extension}`;
    }

    async deleteFile( filePath: string ): Promise<void> {
        try {
            const cleanPath = filePath.startsWith( '/' ) ? filePath.slice( 1 ) : filePath;
            const fullPath = path.join( this.uploadDir, cleanPath );

            await fs.unlink( fullPath );
        } catch ( error ) {
            console.error( 'File delete error:', error );
            throw new AppError( 500, 'Failed to delete file' );
        }
    }
}
