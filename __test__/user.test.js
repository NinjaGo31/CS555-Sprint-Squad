import * as userController from "../Controller/userController.js";
import { User as userModel } from "../Model/userModel.js";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

jest.mock('../Model/userModel.js', () => ({
    User: {
        find: jest.fn(),
        findById: jest.fn(),
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
describe("getAllUsers function", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all users", async () => {
    const mockUsers = [
      { name: "User One", email: "userone@example.com" },
      { name: "User Two", email: "usertwo@example.com" },
    ];
    userModel.find.mockResolvedValue(mockUsers);
    await userController.getAllUsers(req, res, next);
    expect(userModel.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      results: mockUsers.length,
      data: { users: mockUsers },
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Error finding users");
    userModel.find.mockRejectedValue(mockError);
    await userController.getAllUsers(req, res, next);
    expect(userModel.find).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });
});

describe("getUser function", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { id: "testUserID" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a specific user", async () => {
    const mockUser = { name: "User One", email: "userone@example.com" };
    userModel.findById.mockResolvedValue(mockUser);
    await userController.getUser(req, res, next);
    expect(userModel.findById).toHaveBeenCalledWith("testUserID");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: { users: mockUser },
    });
  });

  it("should handle errors when the user is not found", async () => {
    const mockError = new Error("User not found");
    userModel.findById.mockRejectedValue(mockError);
    await userController.getUser(req, res, next);
    expect(userModel.findById).toHaveBeenCalledWith("testUserID");
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });
});

describe("updateUser function - Error Handling", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "testUserID" },
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next with an error if updating the user fails", async () => {
    const mockError = new Error("Update failed");
    userModel.findByIdAndUpdate.mockRejectedValue(mockError);
    await userController.updateUser(req, res, next);
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("testUserID", {}, { new: true, runValidators: true });
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });
});

describe("deleteUser function - Error Handling", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "testUserID" }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next with an error if deleting the user fails", async () => {
    const mockError = new Error("Delete failed");
    userModel.findByIdAndDelete.mockRejectedValue(mockError);
    await userController.deleteUser(req, res, next);
    expect(userModel.findByIdAndDelete).toHaveBeenCalledWith("testUserID");
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });
});
