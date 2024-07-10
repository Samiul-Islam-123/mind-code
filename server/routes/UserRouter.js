const { CreateUser, ReadEveryUser, ReadSpecificUser, UpdateUser, DeleteUser } = require('../controllers/UserController');

const UserRouter = require('express').Router();

UserRouter.post("/", CreateUser);
UserRouter.get("/", ReadEveryUser);
UserRouter.get("/:clerkID/:email", ReadSpecificUser);
UserRouter.put("/", UpdateUser);
UserRouter.delete("/:clerkID", DeleteUser);


module.exports = UserRouter;