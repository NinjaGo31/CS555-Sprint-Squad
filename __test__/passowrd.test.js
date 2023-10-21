import * as AuthController from "../Controller/authController.js";
import {User as userModel} from "../Model/userModel.js";
import {sendEmail} from "../Utils/email.js";
import dotenv from 'dotenv';
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
      findOne: jest.fn()
    }
  }));

const mockedUserModel = userModel;


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
    expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'password reset link sent to the user email' });
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
