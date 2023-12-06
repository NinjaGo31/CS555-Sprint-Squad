import { Reward as rewardModel } from "../Model/rewardModel.js";
async function getAllRewards(req, res, next) {
  try {
    const rewards = await rewardModel.find();
    res.status(200).json({
      status: "success",
      results: rewards.length,
      data: { rewards },
    });
  } catch (error) {
    const err = error;
    err.statusCode = 404;
    next(err);
  }
}
async function getReward(req, res, next) {
  try {
    const rewards = await rewardModel.findById(req.params.id);
    res.status(200).json({
      status: "success",
      results: rewards.length,
      data: { rewards },
    });
  } catch (error) {
    const err = error;
    err.statusCode = 404;
    next(err);
  }
}
async function updateReward(req, res, next) {
  // to do
  try {
    const rewards = await rewardModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      results: rewards.length,
      data: { rewards },
    });
  } catch (error) {
    const err = error;
    err.statusCode = 404;
    next(err);
  }
}
async function deleteReward(req, res, next) {
  try {
    await rewardModel.findByIdAndDelete(req.params.id);
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
export { getAllrewards, getReward, updateReward, deleteReward };