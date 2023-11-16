import * as ScavengerController from '../Controller/scavengerController.js';
import { scavengerModel } from '../Model/scavengerModel.js';

jest.mock('../Model/scavengerModel.js', () => ({
  scavengerModel: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
  }
}));

const mockRequest = (params = {}, body = {}) => ({
  params,
  body,
  protocol: 'http',
  get: jest.fn(() => 'example.com'),
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const nextFunction = jest.fn();
  describe('updateScavenger', () => {
    const mockHunt = { id: '1', name: 'Updated Hunt' };
    const updateData = { name: 'Updated Hunt' };
  
    it('should update a scavenger hunt', async () => {
      scavengerModel.findByIdAndUpdate.mockResolvedValue(mockHunt);
      const req = mockRequest({ id: '1' }, updateData);
      const res = mockResponse();
  
      await ScavengerController.updateScavenger(req, res, nextFunction);
  
      expect(scavengerModel.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, {
        new: true,
        runValidators: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          hunt: mockHunt,
        },
      });
    });
  });
  describe('createScavenger', () => {
    const newHuntData = {
      scavengerName: 'New Hunt', 
      description: 'Test Description',
      startLocation: 'Some location',
      scavengerStops: ['Stop 1', 'Stop 2']
    };
    const mockHunt = { ...newHuntData, id: '2' };
  
    it('should create a scavenger hunt', async () => {
      scavengerModel.create.mockResolvedValue(mockHunt);
      const req = mockRequest({}, newHuntData);
      const res = mockResponse();
  
      await ScavengerController.createScavenger(req, res, nextFunction);
  
      expect(scavengerModel.create).toHaveBeenCalledWith(newHuntData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          hunt: mockHunt,
        },
      });
    });
  });  
  describe('deleteScavenger', () => {
    it('should delete a scavenger hunt', async () => {
      const mockHunt = { id: '1', name: 'Hunt to Delete' };
      scavengerModel.findByIdAndDelete.mockResolvedValue(mockHunt);
      const req = mockRequest({ id: '1' });
      const res = mockResponse();
  
      await ScavengerController.deleteScavenger(req, res, nextFunction);
  
      expect(scavengerModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: null,
      });
    });
  });
