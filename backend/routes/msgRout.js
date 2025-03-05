import { Router } from 'express';  // Import Router from 'express'
import * as Controllers from '../controllers/msgControllers';  // Import everything from msgControllers
import { protection } from '../middlewares/auth_middlewares';  // Import protection middleware

const Router = Router();

// POST route to send a message
Router.get('/hello', (req, res) => {
  return res.status(200).json({ message: "hello from message route" });
});

Router.get('/:id', protection, Controllers.getMsgs); 
Router.post('/send/:user_id', protection, Controllers.sendMessage);

Router.put('/update/:msg_id', protection, Controllers.updateMsgs);
Router.delete('/delete/:msg_id', protection, Controllers.DeleteMessage);

// Export Router
export default Router;
