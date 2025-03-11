import express from 'express';
const router = express.Router();
import { commands } from './../../commands.js'; 

// Git API
router.get('/branches', async (req, res) => {
  const branches = await commands.getBranches();
  res.json(branches);
});

router.get('/changes-count', async (req, res) => {
  const changesCount = await commands.getChangesCount();
  res.json(changesCount);
});

router.get('/changes', async (req, res) => {
  const changes = await commands.getChanges();
  res.json(changes);
});

router.post('/changes', async (req, res) => {
  console.log('Saving changes...');
  res.json({ success: true });
});

export default router;