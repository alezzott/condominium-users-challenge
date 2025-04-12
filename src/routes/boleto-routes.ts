import { Router } from 'express';
import multer from 'multer';
import BoletoController from '../controllers/boleto-controller';
import pdfController from '../controllers/pdf-controller';

const router = Router();
const upload = multer({ dest: 'uploads/input/' });

router.post('/import-csv', upload.single('file'), BoletoController.importCsv);
router.get('/boletos', BoletoController.getBoletos.bind(BoletoController));
router.get('/', (req, res) => BoletoController.listBoletos(req, res));
router.post('/process-pdf', upload.single('file'), (req, res) =>
  pdfController.processPdf(req, res)
);

export default router;
