import { Router } from 'express';
import { Assignment } from '../models/Assignment';
import { Result } from '../models/Result';
import { assessmentQueue } from '../queues/assessmentQueue';
import { validateAssignment } from '../middleware/validateAssignment';
import { redis } from '../config/redis';

const router = Router();

// POST /api/assignments
router.post('/', validateAssignment, async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    await assessmentQueue.add('generate', {
      assignmentId: assignment._id.toString(),
    });
    res.status(201).json({ assignmentId: assignment._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});
// GET /api/assignments — list all
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).limit(50);
    res.json(assignments);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/assignments/:id
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .sort({ createdAt: -1 })
      .select('title subject dueDate status createdAt');
    res.json(assignments);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
// GET /api/assignments/:id/result
router.get('/:id/result', async (req, res) => {
  try {
    const cacheKey = `result:${req.params.id}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const result = await Result.findOne({ assignmentId: req.params.id });
    if (!result) return res.status(404).json({ error: 'Result not ready' });

    await redis.setex(cacheKey, 3600, JSON.stringify(result));
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/assignments/:id/regenerate
router.post('/:id/regenerate', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    await Result.deleteOne({ assignmentId: req.params.id });
    await redis.del(`result:${req.params.id}`);
    await Assignment.findByIdAndUpdate(req.params.id, { status: 'queued' });
    await assessmentQueue.add('generate', { assignmentId: req.params.id });

    res.json({ message: 'Regeneration queued', assignmentId: req.params.id });
  } catch {
    res.status(500).json({ error: 'Failed to regenerate' });
  }
});

// GET /api/assignments/count
router.get('/count', async (req, res) => {
  try {
    const count = await Assignment.countDocuments();
    res.json({ count });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;