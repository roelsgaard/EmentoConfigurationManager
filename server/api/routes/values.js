import express from 'express';
const router = express.Router();
import { dataService } from './../../dataService.js'; 

// Values
router.get('/', async (req, res) => {
  const values = await dataService.getValues();
  res.json(values);
});

router.post('/', async (req, res) => {
  const value = await dataService.updateValue(req.body);
  res.status(201).json(value);
});

router.delete('/:variableId/:level/:entityId', async (req, res) => {
  const { variableId, level, entityId } = req.params;
  
  try {
    await dataService.deleteValue({
      variable_id: variableId,
      level,
      entity_id: entityId === '_null_' ? null : entityId
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting value:', error);
    if (error.message === 'Value not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

export default router;