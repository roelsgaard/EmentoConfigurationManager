import express from 'express';
const router = express.Router();
import { dataService } from './../../dataService.js'; 

// Effective Configuration
router.get('/', async (req, res) => {
  const { level, entityId, serviceId } = req.query;
  const config = dataService.getEffectiveConfiguration(
    level || null,
    entityId === 'null' ? null : entityId,
    serviceId === 'null' ? null : serviceId
  );
  res.json(config);
});

export default router;