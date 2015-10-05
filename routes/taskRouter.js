const router = require('express').Router();
const tasksController = require('../controllers/taskController');
const sessionMiddleware = require('../middleware/sessionMiddleware');

router.post('/tasks/', sessionMiddleware(), tasksController.createTask);
router.put('/tasks/:id/', sessionMiddleware(), tasksController.updateTask);
router.delete('/tasks/:id/', sessionMiddleware(), tasksController.deleteTask);
router.get('/tasks/:id/', sessionMiddleware(), tasksController.getTask);

module.exports = router;
