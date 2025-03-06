// /src/backend/routes/userRoutes.js

import { Router } from 'express';
import UsersControllers from '../controllers/Usercontrollers.js';
import { registerRules, LoginRules, validator } from '../middlewares/validator.js';
import { protection } from '../middlewares/auth_middlewares.js';

/****************** */
// Create a new user
const router = Router();

router.get('/hello', (req, res) => {
    return res.status(200).json({ message: "hello from server" });
});

// Create a new user (sign up)
router.post('/register', registerRules(), validator, UsersControllers.postUsers);

// Login (sign in)
router.post('/login', LoginRules(), validator, UsersControllers.getUser);

// Get all users
router.get('/all', protection, UsersControllers.getUsers);

// Get user by name
router.post('/search', protection, UsersControllers.getUserByName);

// Router.put("/profile", protection, UsersControllers.addProfilePic);
router.put("/update", protection, UsersControllers.updateProfile);
router.put('/add-to-list/:friendId', protection, UsersControllers.addtolist);
router.get("/contact", protection, UsersControllers.getcontact);
router.post('/remove-contact', protection, UsersControllers.removeContact);
router.get("/contact/:id", protection, UsersControllers.getByID);
router.put('/updateprof', protection, UsersControllers.updateuser );

// Check user
router.get("/check", protection, (req, res) => {
    res.json({ user: req.user });
});

export default router;
