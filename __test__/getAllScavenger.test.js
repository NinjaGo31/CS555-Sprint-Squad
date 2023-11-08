import { getAllScavenger, getScavenger } from '../Controller/scavengerController.js';
import { scavengerModel } from '../Model/scavengerModel.js';

jest.mock('../Model/scavengerModel.js', () => ({
  scavengerModel: {
    findById: jest.fn(),
    find: jest.fn(),
  }
}));

const mockedScavengerModel = scavengerModel;

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


describe('getAllScavenger', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all scavenger hunts', async () => {
    const mockHunts = [{ name: 'Hunt 1' }, { name: 'Hunt 2' }];
    mockedScavengerModel.find.mockResolvedValue(mockHunts);

    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();

    await getAllScavenger(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        hunts: mockHunts,
      },
    });
  });

  it('should handle errors and call next with the error', async () => {
    const mockError = new Error('Test Error');
    mockedScavengerModel.find.mockRejectedValue(mockError);

    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();

    await getAllScavenger(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});

describe('getScavenger', () => {
  it('should return a specific scavenger hunt', async () => {
    const mockScavengerId = '123';
    const mockHunt = { name: 'Hunt 1' };
    mockedScavengerModel.findById.mockResolvedValue(mockHunt);

    const req = mockRequest({ id: mockScavengerId });
    const res = mockResponse();
    const next = jest.fn();

    await getScavenger(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        hunt: mockHunt,
      },
    });
  });

  it('should handle error when scavenger hunt is not found', async () => {
    const mockScavengerId = '123';
    mockedScavengerModel.findById.mockResolvedValue(null);

    const req = mockRequest({ id: mockScavengerId });
    const res = mockResponse();
    const next = jest.fn();

    await getScavenger(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });

});