const User = require('../models/User');

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json(updated);
};
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};