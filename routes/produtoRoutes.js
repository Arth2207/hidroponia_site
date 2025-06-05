import express from 'express';
import {getProduto} from '../controllers/produtoController.js';

const router = express.Router();

router.get('/produtos', getProduto);


export default router;