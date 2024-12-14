import { Request, Response } from 'express';
import { DocumentService } from '../services/document.service';
import { FileStorageService, StorageFolder } from '../services/file-storage.service';
import { DocumentStatus } from '../entities/document.entity';
import { AppError } from '../middlewares/error-handler.middleware';

export class DocumentController {
    private documentService: DocumentService;
    private fileStorageService: FileStorageService;

    constructor() {
        this.documentService = new DocumentService();
        this.fileStorageService = new FileStorageService();
    }

    async upload(req: Request, res: Response): Promise<void> {
        if (!req.file) {
            throw new AppError(400, 'No file uploaded');
        }

        const { entityType, entityId } = req.params;
        const { name, type, category, description } = req.body;

        const document = await this.documentService.create({
            name,
            type,
            category,
            description,
            file: req.file,
            entityId,
            entityType: entityType as any
        });

        res.status(201).json(document);
    }

    async download(req: Request, res: Response): Promise<void> {
        const document = await this.documentService.findById(req.params.id);
        const fileBuffer = await this.documentService.getFileBuffer(document);

        res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${document.name}"`);
        res.send(fileBuffer);
    }

    async view(req: Request, res: Response): Promise<void> {
        const document = await this.documentService.findById(req.params.id);
        const fileBuffer = await this.documentService.getFileBuffer(document);

        res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
        res.send(fileBuffer);
    }

    async delete(req: Request, res: Response): Promise<void> {
        await this.documentService.delete(req.params.id);
        res.status(204).send();
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        const { status, rejectionReason } = req.body;
        const document = await this.documentService.updateStatus(
            req.params.id,
            status as DocumentStatus,
            rejectionReason
        );
        res.json(document);
    }

    async findByEntity(req: Request, res: Response): Promise<void> {
        const { entityType, entityId } = req.params;
        const documents = await this.documentService.findByEntity(entityType, entityId);
        res.json(documents);
    }

    async validate(req: Request, res: Response): Promise<void> {
        const { validationResults } = req.body;
        const document = await this.documentService.validateDocument(
            req.params.id,
            validationResults
        );
        res.json(document);
    }

    getUploadMiddleware(entityType: string) {
        const folder = this.getStorageFolder(entityType);
        return this.fileStorageService.getUploadMiddleware(folder).single('file');
    }

    private getStorageFolder(entityType: string): StorageFolder {
        switch (entityType) {
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
}
