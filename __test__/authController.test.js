import * as AuthController from "../Controller/authController.js";
import {User as userModel} from "../Model/userModel.js";
import {sendEmail} from "../Utils/email.js";
import dotenv from 'dotenv';
import { signUp } from "../Controller/authController.js";
import bcrypt from 'bcryptjs';
dotenv.config({ path: '.env.test' });


beforeAll(() => {
    process.env.JWT_SECRET = "myTestSecret";
  });
  
afterAll(() => {
    delete process.env.JWT_SECRET;
  });

// Mocking the userModel and its named export 'User'
jest.mock('../Model/userModel.js', () => ({
  User: {
    findById: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({
        _id: 'mockUserId',
        userName: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
      })),
    })),
  }
}));


const mockedUserModel = userModel;

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// Mocking the sendEmail function
jest.mock('../Utils/email.js', () => ({
  sendEmail: jest.fn(),
}));
//used --npm install --save-dev @babel/core @babel/preset-env babel-jest
//used -npm test -- --clearCache
//use -npm run test

const mockRequest = (body, params = {}) => ({
  body,
  params,
  protocol: 'http',
  get: jest.fn(() => 'example.com'),
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("forgotPassword function", () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle user not found", async () => {
    //userModel.findOne.mockResolvedValue(null);
    mockedUserModel.findOne.mockResolvedValue(null);
    const req = mockRequest({ email: "notfound@example.com" });
    const res = mockResponse();
    const next = jest.fn();

    await AuthController.forgotPassword(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });

  it("should handle successful password reset email sending", async () => {
    const mockUser = {
      email: "test@example.com",
      createResetPasswordToken: jest.fn().mockReturnValue("sampletoken"),
      save: jest.fn(),
    };

    userModel.findOne.mockResolvedValue(mockUser);
    const req = mockRequest({ email: "test@example.com" });
    const res = mockResponse();
    const next = jest.fn();

    await AuthController.forgotPassword(req, res, next);

    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ email: mockUser.email }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'A password reset link has been sent to your email address.' });
  });

  it("should handle email sending failure", async () => {
    const mockUser = {
      email: "test@example.com",
      createResetPasswordToken: jest.fn().mockReturnValue("sampletoken"),
      save: jest.fn(),
    };

    userModel.findOne.mockResolvedValue(mockUser);
    sendEmail.mockRejectedValue(new Error("Email sending failed"));
    const req = mockRequest({ email: "test@example.com" });
    const res = mockResponse();
    const next = jest.fn();

    await AuthController.forgotPassword(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Error: There was an error sending password reset mail. Please try again later" }));
  });
});

describe("resetPassword function", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    it("should handle when token is invalid or expired", async ()=>{
        mockedUserModel.findOne.mockResolvedValue(null);
        const req = mockRequest({}, { token: "invalidToken" });
        const res = mockResponse();
        const next = jest.fn();
        await AuthController.resetPassword(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it("should handle case for successful Password Reset", async ()=>{
        const mockUser ={
            _id:"anyId",
            password:"testOldPassword",
            passwordConfirm:"testOldPassword",
            passwordResetToken:"resetToken",
            passwordResetTokenExpire: new Date(Date.now()+10*60*1000),//10 min from current time stamp
            save:jest.fn(),
        };
        mockedUserModel.findOne.mockResolvedValue(mockUser);
        const req =mockRequest({
                password:"testNewPassword",
                passwordConfirm:"testNewPassword"},
                {token:"resetToken"});
        const res = mockResponse();
        const next = jest.fn();
        await AuthController.resetPassword(req, res, next);
        expect(mockUser.password).toBe("testNewPassword");
        expect(mockUser.passwordConfirm).toBe("testNewPassword");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({status:'success'}));
    });
    /*it("should handle case for error during Password Reset", async () => {
        const mockUser = {
          _id: "sampleId",
          password: "oldpassword",
          passwordConfirm: "oldpassword",
          passwordResetToken: "resetToken",
          passwordResetTokenExpire: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
          save: jest.fn().mockRejectedValue(new Error("DB save error")),
        };
    
        mockedUserModel.findOne.mockResolvedValue(mockUser);
        const req =mockRequest({
            password:"testNewPassword",
            passwordConfirm:"testNewPassword"},
            {token:"resetToken"});
        const res = mockResponse();
        const next = jest.fn();
        try {
            await AuthController.resetPassword(req, res, next);
            expect(next).toHaveBeenCalled();
        } catch (error) {
            throw(error);
        }
    });*/
});
// <------- signup testcase --------->
// const signUp = require('./Con'); // Import the signUp function
// const userModel = require('./path/to/userModel'); // Import the userModel
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library

jest.mock('../Model/userModel.js'); // Mock the userModel module
jest.mock('jsonwebtoken'); // Mock the jsonwebtoken library

describe('signUp', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        userName: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        passwordConfirm: 'testpassword',
        role: 'user',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should create a new user and return a token', async () => {
    const mockUser = {
      _id: 'mockUserId',
      userName: 'testuser',
      email: 'test@example.com',
      role: 'user',
    };

    const mockToken = 'mockToken';

    userModel.create.mockResolvedValueOnce(mockUser);
    jwt.sign.mockReturnValueOnce(mockToken);

    await signUp(req, res, next);

    expect(userModel.create).toHaveBeenCalledWith({
      userName: 'testuser',
      email: 'test@example.com',
      password: 'testpassword',
      passwordConfirm: 'testpassword',
      role: 'user',
    });

    expect(jwt.sign).toHaveBeenCalledWith({ id: 'mockUserId' }, process.env.JWT_SECRET);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      token: 'mockToken',
      data: {
        user: mockUser,
      },
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('should handle errors and return a 400 status code', async () => {
    const mockError = new Error('Test error');
    userModel.create.mockRejectedValueOnce(mockError);

    await signUp(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      data: {
        error: mockError,
      },
    });

    expect(next).not.toHaveBeenCalled();
  });
});

//Additional test cases

describe("logIn function", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest({
      body: {
        userName: 'testuser',
        password: 'password123',
      },
    });
    res = mockResponse();
    next = jest.fn();
  });

  it('should log in user and return a token if credentials are correct', async () => {
    userModel.findOne.mockImplementation(() => ({
      select: jest.fn(() => Promise.resolve({ _id: 'userId', password: 'hashedpassword' })),
    }));
    const req = mockRequest({ userName: 'testuser', password: 'password123' });
  
    await AuthController.logIn(req, res, next);
    expect(userModel.findOne).toHaveBeenCalledWith({ userName: 'testuser' });
  });
  

  it('should handle no username or password provided', async () => {
    req.body = {};

    await AuthController.logIn(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

});

describe('protect function', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer token123',
      },
    };
    res = mockResponse();
    next = jest.fn();
  });

  /*it('should set req.user if token is valid', async () => {
    jwt.verify.mockResolvedValue({ id: 'userId' });
    userModel.findById.mockResolvedValue({ _id: 'userId' });

    await AuthController.protect(req, res, next);

    expect(next).toHaveBeenCalled();
  });*/
  it('should return an error if no token is provided', async () => {
    req.headers = {};

    await AuthController.protect(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

});


describe('restrictTo function', () => {
  const req = {
    user: {
      role: 'user',
    },
  };
  const res = mockResponse();
  const next = jest.fn();

  it('should call next if user role is included in roles', () => {
    const handler = AuthController.restrictTo('user', 'admin');
    handler(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return an error if user role is not included in roles', () => {
    const handler = AuthController.restrictTo('admin');
    handler(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

});