import express from 'express';
import controller from '../controllers/transactionController.js';

const router = express.Router();

//create route
router.post('*', controller.create);

//retrieve route
router.get('*', controller.retrievePeriod);

//update route
router.put('*', controller.updateOne);

//delete route
router.delete('*', controller.deleteOne);

//errors route
router.use('*', (err, _, res, __) => {
  if (err.message.substr(0, 1) === '{' && err.message.substr(-1) === '}') {
    const { status, error } = JSON.parse(err.message);
    return res.status(status).send({ error });
  }
  return res.status(500).send({ error: err.message });
});

export { router as transactionRouter };
