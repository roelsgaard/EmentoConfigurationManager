import express from 'express';
const router = express.Router();
import EffectiveConfiguration from '../../model/effectiveConfiguration.js';

// Effective Configuration
router.get('/', async (req, res) => {
  const { level, entityId, serviceId } = req.query;
  const config = await  EffectiveConfiguration.getEffectiveConfiguration(
    level || null,
    entityId === 'null' ? null : entityId,
    serviceId === 'null' ? null : serviceId
  );
  res.json(config);
});

export default router;