const Router=require('express').Router();

const UsersControllers=require('../controllers/Usercontrollers')
const {registerRules,LoginRules,validator}=require('../middlewares/validator')
const{ protection}=require('../middlewares/auth_middlewares')
/****************** */
// Create a new user
Router.get('/hello',(req,res)=>{
    return res.status(200).json({message:"hello from server"})
})
// create a new user(sign up)
Router.post('/register',  registerRules(), validator, UsersControllers.postUsers);

// Login (sign in)
Router.post('/login',LoginRules(), validator, UsersControllers.getUser)
//get aLL users 
Router.get('/all',protection,UsersControllers.getUsers)
// get user by name 
Router.post('/search',protection,UsersControllers.getUserByName)
//Router.put("/profile",protection,UsersControllers.addprofilePic)
Router.put ("/update", protection,UsersControllers.updateProfile)
Router.put('/add-to-list/:friendId', protection,UsersControllers.addtolist)
Router.get("/contact",protection,UsersControllers.getcontact)
Router.post('/remove-contact',protection,UsersControllers.removeContact)
Router.get("/contact/:id",protection,UsersControllers.getByID)
Router.put('/updateprof',protection,UsersControllers.updateuser)
Router.get("/check", protection, (req, res) => {
    res.json({user: req.user})
})
module.exports=Router;