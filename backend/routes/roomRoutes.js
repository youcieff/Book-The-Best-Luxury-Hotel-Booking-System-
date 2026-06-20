const express = require('express');
const router = express.Router();
const {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
} = require('../controllers/roomController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');
const { validate, createRoomSchema, updateRoomSchema } = require('../middleware/validate');

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', protect, admin, upload.single('image'), validate(createRoomSchema), createRoom);
router.put('/:id', protect, admin, upload.single('image'), validate(updateRoomSchema), updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;

