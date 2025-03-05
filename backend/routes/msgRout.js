const Router = require('express').Router();
const Controllers = require('../controllers/msgControllers');
const{ protection}=require('../middlewares/auth_middlewares')

// POST route to send a message
Router.get('/hello',(req, res)=>{
    return res.status(200).json({message:"hello from message route"})
})
Router.get('/:id', protection,Controllers.getMsgs); 
Router.post('/send/:user_id', protection, Controllers.sendMessage);

Router.put('/update/:msg_id',protection,Controllers.updateMsgs)
Router.delete('/delete/:msg_id',protection,Controllers.DeleteMessage)
// Export Router
module.exports = Router;
