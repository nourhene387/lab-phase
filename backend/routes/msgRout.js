// msgRout.js

import express from 'express';
import  Controllers from '../controllers/msgControllers.js';
import { protection } from '../middlewares/auth_middlewares.js';

const router =express. Router();

// Define your routes
router.get('/hello', (req, res) => {
  return res.status(200).json({ message: 'Hello from message route' });
});

router.get('/:id', protection, Controllers.getMsgs);
router.post('/send/:user_id', protection, Controllers.sendMessage);
router.put('/update/:msg_id', protection, Controllers.updateMsgs);
router.delete('/delete/:msg_id', protection, Controllers.DeleteMessage);

export default router;  // Default export
