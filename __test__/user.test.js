import * as userController from "../Controller/userController.js";
import { User as userModel } from "../Model/userModel.js";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

jest.mock('../Model/userModel.js', () => ({
    User: {
        findByIdAndDelete: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    }
}));

describe("deleteUser function", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { id: "testUserID" } };
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully delete the user", async () => {
    userModel.findByIdAndDelete.mockResolvedValue(true);
    await userController.deleteUser(req, res, next);
    expect(userModel.findByIdAndDelete).toHaveBeenCalledWith("testUserID");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: null });
  });
    // it("should successful password reset email sending", async () => {
    // });
    // it("should handle email sending failure", async () => {
    // });
});

describe("updateUser function", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { id: "testUserID" } ,body:{}};
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update the user", async () => {
    userModel.findByIdAndUpdate.mockResolvedValue(true);
    await userController.updateUser(req, res, next);
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("testUserID",{},{new:true,runValidators:true});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { users:true } });
  });
});