import { Router } from 'express';
import { BranchController } from '../controllers/branch.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { createRequestValidator } from '../middlewares/request-validator.middleware';
import { createBranchSchema, updateBranchSchema } from '../validators/branch.validator';
import { z } from 'zod';

const router = Router();
const branchController = new BranchController();

router.use( authenticate );
router.use( authorize( 'admin' ) );

router.post( '/',
    createRequestValidator( { body: createBranchSchema } ),
    branchController.create.bind( branchController )
);

router.get( '/',
    branchController.findAll.bind( branchController )
);

router.get( '/:id',
    branchController.findById.bind( branchController )
);

router.put( '/:id',
    createRequestValidator( { body: updateBranchSchema } ),
    branchController.update.bind( branchController )
);

router.delete( '/:id',
    branchController.delete.bind( branchController )
);

router.post( '/:id/loan-officers',
    createRequestValidator( {
        body: z.object( {
            loanOfficerId: z.string().uuid()
        } )
    } ),
    branchController.addLoanOfficer.bind( branchController )
);

export { router as branchRoutes };
