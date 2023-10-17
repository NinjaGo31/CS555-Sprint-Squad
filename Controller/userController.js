import { User as userModel } from "../Model/userModel.js";
async function getAllUsers(req, res, next) {
  try {
    const users = await userModel.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (error) {
    const err = error;
    err.statusCode = 404;
    next(err);
  }
}
async function getUser(req, res, next) {
  try {
    const users = await userModel.findById(req.params.id);
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (error) {
    const err = error;
    err.statusCode = 404;
    next(err);
  }
}
async function updateUser(req, res, next) {
  // to do
  try {
    const users = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (error) {
    const err = error;
    err.statusCode = 404;
    next(err);
  }
}
async function deleteUser(req, res, next) {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    const err = error;
    err.statusCode = 404;
    next(err);
  }
}
export { getAllUsers, getUser, updateUser, deleteUser };
