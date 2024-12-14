import { BaseService } from './base.service';
import { Document, DocumentType, DocumentStatus, DocumentCategory } from '../entities/document.entity';
import { AppDataSource } from '../config/database.config';
import { FileStorageService, StorageFolder } from './file-storage.service';
import { AppError } from '../middlewares/error-handler.middleware';
import sharp from 'sharp';

interface CreateDocumentInput {
    name: string;
    type: DocumentType;
    category: DocumentCategory;
    description?: string;
    file: Express.Multer.File;
    entityId: string;
    entityType: 'borrower' | 'loan_officer' | 'loan' | 'collateral' | 'guarantor' | 'borrower_group';
}

export class DocumentService extends BaseService<Document> {
    private fileStorageService: FileStorageService;

    constructor() {
        super( AppDataSource.getRepository( Document ) );
        this.fileStorageService = new FileStorageService();
    }

    private getStorageFolder( entityType: CreateDocumentInput['entityType'] ): StorageFolder {
        switch ( entityType ) {
            case 'borrower':
                return StorageFolder.BORROWERS;
            case 'loan_officer':
                return StorageFolder.LOAN_OFFICERS;
            case 'collateral':
                return StorageFolder.COLLATERALS;
            default:
                return StorageFolder.OTHER;
        }
    }

    async create( input: CreateDocumentInput ): Promise<Document> {
        const { file, entityId, entityType, ...documentData } = input;
        const storageFolder = this.getStorageFolder( entityType );

        // Process image files
        let dimensions;
        if ( file.mimetype.startsWith( 'image/' ) ) {
            const imageInfo = await sharp( file.path ).metadata();
            if ( imageInfo.width && imageInfo.height ) {
                dimensions = {
                    width: imageInfo.width,
                    height: imageInfo.height
                };
            }
        }

        // Get file metadata
        const metadata = this.fileStorageService.getFileMetadata( file, storageFolder, entityId );
        metadata.dimensions = dimensions;

        // Create document record
        const document = await super.create( {
            ...documentData,
            url: `${storageFolder}/${entityId}/${file.filename}`,
            mimeType: file.mimetype,
            size: file.size,
            metadata: {
                ...metadata,
                location: {
                    bucket: 'local',
                    key: `${storageFolder}/${entityId}/${file.filename}`
                }
            },
            status: DocumentStatus.PENDING,
            [entityType]: { id: entityId }
        } );

        return document;
    }

    async getFileBuffer( document: Document ): Promise<Buffer> {
        if ( !document.metadata?.location?.key ) {
            throw new AppError( 404, 'File location not found' );
        }
        const [folder, subFolder, fileName] = document.metadata.location.key.split( '/' );
        return this.fileStorageService.getFile( folder as StorageFolder, subFolder, fileName );
    }

    async delete( id: string ): Promise<void> {
        const document = await this.findById( id );
        if ( !document.metadata?.location?.key ) {
            throw new AppError( 404, 'File location not found' );
        }
        const [folder, subFolder, fileName] = document.metadata.location.key.split( '/' );

        await this.fileStorageService.deleteFile( folder as StorageFolder, subFolder, fileName );
        await super.delete( id );
    }

    async updateStatus( id: string, status: DocumentStatus, rejectionReason?: string ): Promise<Document> {

        if ( status === DocumentStatus.REJECTED && !rejectionReason ) {
            throw new AppError( 400, 'Rejection reason is required' );
        }

        return this.update( id, {
            status,
            rejectionReason: status === DocumentStatus.REJECTED ? rejectionReason : undefined
        } );
    }

    async findByEntity( entityType: string, entityId: string ): Promise<Document[]> {
        return this.repository.find( {
            where: {
                [entityType]: { id: entityId }
            },
            order: {
                createdAt: 'DESC'
            }
        } );
    }

    async validateDocument( id: string, validationResults: { isValid: boolean; errors?: string[]; warnings?: string[] } ): Promise<Document> {
        return this.update( id, {
            validationResults,
            status: validationResults.isValid ? DocumentStatus.APPROVED : DocumentStatus.REJECTED
        } );
    }
}
