import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { AppError } from '../middlewares/error-handler.middleware';
import { Request } from 'express';

export enum StorageFolder {
    BORROWERS = 'borrowers',
    LOAN_OFFICERS = 'loan_officers',
    COLLATERALS = 'collaterals',
    OTHER = 'other'
}

interface FileMetadata {
    originalName: string;
    mimeType: string;
    size: number;
    dimensions?: {
        width: number;
        height: number;
    };
    location: {
        folder: StorageFolder;
        subFolder: string;
        fileName: string;
    };
}

export class FileStorageService {
    private readonly baseStoragePath: string;
    private readonly allowedMimeTypes = {
        'image/jpeg': ['jpg', 'jpeg'],
        'image/png': ['png'],
        'application/pdf': ['pdf'],
        'application/msword': ['doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
        'application/vnd.ms-excel': ['xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx']
    };
    private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

    constructor() {
        // Store files outside of public directory for security
        this.baseStoragePath = path.join( process.cwd(), 'private', 'uploads' );
        this.initializeStorage();
    }

    private async initializeStorage(): Promise<void> {
        try {
            await fs.mkdir( this.baseStoragePath, { recursive: true } );
            // Create folders for each storage type
            for ( const folder of Object.values( StorageFolder ) ) {
                await fs.mkdir( path.join( this.baseStoragePath, folder ), { recursive: true } );
            }
        } catch ( error ) {
            throw new AppError( 500, 'Failed to initialize storage' );
        }
    }

    private generateUniqueFileName( originalName: string ): string {
        const timestamp = Date.now();
        const randomString = crypto.randomBytes( 8 ).toString( 'hex' );
        const extension = path.extname( originalName );
        return `${timestamp}-${randomString}${extension}`;
    }

    private getMulterStorage( folder: StorageFolder ): multer.StorageEngine {
        return multer.diskStorage( {
            destination: async ( req: Request, _file: Express.Multer.File, cb ) => {
                const subFolder = req.params.id || 'temp';
                const fullPath = path.join( this.baseStoragePath, folder, subFolder );
                try {
                    await fs.mkdir( fullPath, { recursive: true } );
                    cb( null, fullPath );
                } catch ( error ) {
                    cb( new Error( 'Failed to create storage directory' ), '' );
                }
            },
            filename: ( _req, file, cb ) => {
                cb( null, this.generateUniqueFileName( file.originalname ) );
            }
        } );
    }

    private fileFilter = ( _req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback ) => {
        const allowedTypes = Object.keys( this.allowedMimeTypes );
        if ( !allowedTypes.includes( file.mimetype ) ) {
            cb( new AppError( 400, 'File type not allowed' ) );
            return;
        }
        cb( null, true );
    };

    public getUploadMiddleware( folder: StorageFolder ) {
        return multer( {
            storage: this.getMulterStorage( folder ),
            fileFilter: this.fileFilter,
            limits: {
                fileSize: this.maxFileSize
            }
        } );
    }

    public async getFile( folder: StorageFolder, subFolder: string, fileName: string ): Promise<Buffer> {
        const filePath = path.join( this.baseStoragePath, folder, subFolder, fileName );
        try {
            return await fs.readFile( filePath );
        } catch ( error ) {
            throw new AppError( 404, 'File not found' );
        }
    }

    public async deleteFile( folder: StorageFolder, subFolder: string, fileName: string ): Promise<void> {
        const filePath = path.join( this.baseStoragePath, folder, subFolder, fileName );
        try {
            await fs.unlink( filePath );
        } catch ( error ) {
            throw new AppError( 404, 'File not found' );
        }
    }

    public async moveFile(
        sourceFolder: StorageFolder,
        sourceSubFolder: string,
        targetFolder: StorageFolder,
        targetSubFolder: string,
        fileName: string
    ): Promise<void> {
        const sourcePath = path.join( this.baseStoragePath, sourceFolder, sourceSubFolder, fileName );
        const targetPath = path.join( this.baseStoragePath, targetFolder, targetSubFolder, fileName );

        try {
            await fs.mkdir( path.dirname( targetPath ), { recursive: true } );
            await fs.rename( sourcePath, targetPath );
        } catch ( error ) {
            throw new AppError( 500, 'Failed to move file' );
        }
    }

    public getFileMetadata( file: Express.Multer.File, folder: StorageFolder, subFolder: string ): FileMetadata {
        return {
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            location: {
                folder,
                subFolder,
                fileName: file.filename
            }
        };
    }
}
