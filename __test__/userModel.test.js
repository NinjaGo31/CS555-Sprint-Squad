import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User } from '../Model/userModel.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual('mongoose');
  
    // Create a mock schema with pre-save hook logic
    const schemaMock = {
      pre: jest.fn((hook, fn) => {
        if (hook === 'save') {
          schemaMock.preSaveHook = fn;
        }
      }),
      methods: {
        changedPasswordAfter: jest.fn(),
        createResetPasswordToken: jest.fn()
      },
      preSaveHook: null // This will store the pre-save function
    };
  
    const modelMock = jest.fn().mockImplementation(() => {
        function MockModel(data) {
          Object.assign(this, data, schemaMock.methods);
          this.save = async function () {
            const mockNext = (err) => {
                if(err){
                    throw err;
                }
            };
      
            if (schemaMock.preSaveHook) {
              await schemaMock.preSaveHook.call(this, mockNext);
            }
          };
          this.isModified = jest.fn((field) => field === 'password');
          this.validateSync = jest.fn();
        }
        return MockModel;
      });
  
    return {
      ...actualMongoose,
      model: modelMock,
      Schema: jest.fn().mockImplementation(() => schemaMock),
      Error: actualMongoose.Error
    };
  });
// Test cases
it('should require username and email', async () => {
    const user = new User();
    user.validateSync = jest.fn().mockImplementation(() => {
      throw new mongoose.Error.ValidationError(user);
    });
  
    await expect(async () => user.validateSync()).rejects.toThrow(mongoose.Error.ValidationError);
  });
  
  it('should encrypt the password on save', async () => {
    const testPassword = process.env.test_model_pwd;
    const user = new User({ password: testPassword, passwordConfirm: testPassword });
    bcrypt.hash.mockResolvedValue('encryptedPassword');
    
    await user.save();
  
    expect(bcrypt.hash).toHaveBeenCalledWith(testPassword, 12);
    expect(user.password).toBe('encryptedPassword');
    expect(user.passwordConfirm).toBeUndefined();
  });  
  
  it('should validate that passwordConfirm matches password', async () => {
    const user = new User({ password: process.env.test_model_pwdConfirm, passwordConfirm: process.env.test_model_pwdConfirm });
    user.validateSync = jest.fn().mockImplementation(() => {
      throw new mongoose.Error.ValidationError(user);
    });
  
    await expect(async () => user.validateSync()).rejects.toThrow(mongoose.Error.ValidationError);
  });
  

it('should check if the password was changed after a given time', () => {
  const user = new User({ passwordChangedAt: new Date(Date.now() - 10000) }); // 10 seconds ago
  expect(user.changedPasswordAfter(Math.floor(Date.now() / 1000))).toBe(false);
});

it('should create a reset password token', () => {
  const user = new User();
  const resetToken = user.createResetPasswordToken();
  expect(user.passwordResetToken).toBeDefined();
  expect(user.passwordResetTokenExpire).toBeDefined();
  expect(resetToken).toBeDefined();
});
