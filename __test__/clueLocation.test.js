import { scavengerModel } from "../Model/scavengerModel.js";
import { createClueLocation,updateClueLocation,deleteClueLocation,getClueLocations,getClueLocation} from "../Controller/clueLocationController.js";

jest.mock('../Model/scavengerModel.js', () => ({
  scavengerModel: {
    findById: jest.fn()
  }
}));

const mockRequest = (body = {}, params = {}) => ({
  body,
  params,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const nextFunction = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

it("should successfully create a new clue location", async () => {
  const mockHunt = { scavengerStops: [], save: jest.fn() };
  scavengerModel.findById.mockResolvedValue(mockHunt);
  
  const req = mockRequest({ name: "New Clue Location" }, { id: "validScavengerId" });
  const res = mockResponse();

  await createClueLocation(req, res, nextFunction);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    status: 'success',
    data: { clueLocation: { name: "New Clue Location" }}
  }));
});

it("should handle not found error when scavenger ID is invalid", async () => {
  scavengerModel.findById.mockResolvedValue(null);
  
  const req = mockRequest({ name: "New Clue Location" }, { id: "invalidScavengerId" });
  const res = mockResponse();

  await createClueLocation(req, res, nextFunction);

  expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
});

it("should handle database errors or invalid object IDs", async () => {
    scavengerModel.findById.mockRejectedValue({ kind: 'ObjectId' });
  
    const req = mockRequest({ name: "New Clue Location" }, { id: "problematicScavengerId" });
    const res = mockResponse();
    const next = jest.fn();
    await expect(createClueLocation(req, res, next)).rejects.toThrow(`Invalid ID format: problematicScavengerId`);
    expect(next).not.toHaveBeenCalled();
  });
  

  describe('updateClueLocation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should successfully update a clue location', async () => {
        const mockClueLocation = { someField: 'someValue', save: jest.fn() };
        const mockHunt = { scavengerStops: { id: jest.fn().mockReturnValue(mockClueLocation) }, save: jest.fn() };
        scavengerModel.findById.mockResolvedValue(mockHunt);
    
        const req = mockRequest({ someField: 'updatedValue' }, { id: 'validHuntId', locationId: 'validLocationId' });
        const res = mockResponse();
        const next = jest.fn();
    
        await updateClueLocation(req, res, next);
    
        expect(mockHunt.scavengerStops.id).toHaveBeenCalledWith('validLocationId');
        expect(mockClueLocation.someField).toBe('updatedValue');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          status: 'success',
          data: { clueLocation: mockClueLocation }
        }));
      });

    it('should handle hunt not found error', async () => {
      scavengerModel.findById.mockResolvedValue(null);
  
      const req = mockRequest({}, { id: 'invalidHuntId', locationId: 'locationId' });
      const res = mockResponse();
      const next = jest.fn();
  
      await updateClueLocation(req, res, next);
  
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  
    it('should handle clue location not found error', async () => {
      const mockHunt = { scavengerStops: { id: jest.fn().mockReturnValue(null) } };
      scavengerModel.findById.mockResolvedValue(mockHunt);
  
      const req = mockRequest({}, { id: 'validHuntId', locationId: 'invalidLocationId' });
      const res = mockResponse();
      const next = jest.fn();
  
      await updateClueLocation(req, res, next);
  
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  
    it('should handle database errors or invalid object IDs', async () => {
        scavengerModel.findById.mockRejectedValue({ kind: 'ObjectId' });
      
        const req = mockRequest({}, { id: 'problematicHuntId', locationId: 'locationId' });
        const res = mockResponse();
        const next = jest.fn();
        await expect(updateClueLocation(req, res, next)).rejects.toThrow(`Invalid ID format: problematicHuntId`);
      
        expect(next).not.toHaveBeenCalled();
      });
           
  });

  describe('deleteClueLocation function', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should handle clue location not found error', async () => {
      // Mocking scavengerModel.findById to return a hunt object with no matching clue location
      const mockHunt = {
        scavengerStops: {
          id: jest.fn().mockReturnValue(null) // No clue location found
        },
        save: jest.fn()
      };
      scavengerModel.findById.mockResolvedValue(mockHunt);
  
      const req = mockRequest({}, { id: 'validScavengerId', locationId: 'nonExistentLocationId' });
      const res = mockResponse();
      const next = jest.fn();
  
      await deleteClueLocation(req, res, next);
  
      // Check if the next function was called with an error
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toBe(`Clue Location with ID nonExistentLocationId not found`);
    });
    it("should successfully delete a clue location", async () => {
      const mockClueLocation = {
        _id: 'validLocationId',
        remove: jest.fn(),
      };
      const mockHunt = {
        scavengerStops: {
          id: jest.fn((locationId) => locationId === 'validLocationId' ? mockClueLocation : null)
        },
        save: jest.fn(),
      };
    
      scavengerModel.findById.mockResolvedValue(mockHunt);
      const req = mockRequest({}, { id: "validScavengerId", locationId: 'validLocationId' });
      const res = mockResponse();
    
      await deleteClueLocation(req, res, nextFunction);
    
      expect(scavengerModel.findById).toHaveBeenCalledWith("validScavengerId");
      expect(mockHunt.scavengerStops.id).toHaveBeenCalledWith('validLocationId');
      expect(mockClueLocation.remove).toHaveBeenCalled();
      expect(mockHunt.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        data: null,
      }));
    });
  
    it("should handle not found error when scavenger ID is invalid", async () => {
      scavengerModel.findById.mockResolvedValue(null);
    
      const req = mockRequest({ id: "invalidScavengerId", locationId: 'validLocationId' });
      const res = mockResponse();
    
      await deleteClueLocation(req, res, nextFunction);
    
      expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
    });
    
    it("should handle clue location not found error", async () => {
      const mockHunt = {
        scavengerStops: [{
          _id: 'validLocationId',
          remove: jest.fn(),
        }],
        save: jest.fn(),
      };
    
      scavengerModel.findById.mockResolvedValue(mockHunt);
    
      const req = mockRequest({ id: "validScavengerId", locationId: 'invalidLocationId' });
      const res = mockResponse();
    
      await deleteClueLocation(req, res, nextFunction);
    
      expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
    });
    
    it("should handle database errors or invalid object IDs", async () => {
    scavengerModel.findById.mockRejectedValue({ kind: 'ObjectId' });
    const req = mockRequest({}, { id: "problematicScavengerId", locationId: 'validLocationId' });
    const res = mockResponse();
  
    await expect(deleteClueLocation(req, res, nextFunction)).rejects.toThrow(`Invalid ID format: problematicScavengerId`);
  
    expect(nextFunction).not.toHaveBeenCalled();
  });
  });
  
  

describe('getClueLocations function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully retrieve clue locations', async () => {
    const mockHunt = { scavengerStops: ['location1', 'location2'] };
    scavengerModel.findById.mockResolvedValue(mockHunt);

    const req = mockRequest({}, { id: 'validScavengerId' });
    const res = mockResponse();
    const next = jest.fn();

    await getClueLocations(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success',
      data: { clueLocations: mockHunt.scavengerStops },
    }));
  });

  it('should handle not found error when scavenger ID is invalid', async () => {
    scavengerModel.findById.mockResolvedValue(null);

    const req = mockRequest({}, { id: 'invalidScavengerId' });
    const res = mockResponse();
    const next = jest.fn();

    await getClueLocations(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('getClueLocation function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully retrieve a single clue location', async () => {
    const mockClueLocation = { name: 'Clue Location 1' };
    const mockHunt = {
      scavengerStops: { id: jest.fn().mockReturnValue(mockClueLocation) },
    };
    scavengerModel.findById.mockResolvedValue(mockHunt);

    const req = mockRequest({}, { id: 'validScavengerId', locationId: 'validLocationId' });
    const res = mockResponse();
    const next = jest.fn();

    await getClueLocation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success',
      data: { clueLocation: mockClueLocation },
    }));
  });

  it('should handle not found error when scavenger ID is invalid', async () => {
    scavengerModel.findById.mockResolvedValue(null);

    const req = mockRequest({}, { id: 'invalidScavengerId', locationId: 'validLocationId' });
    const res = mockResponse();
    const next = jest.fn();

    await getClueLocation(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should handle clue location not found error', async () => {
    const mockHunt = { scavengerStops: { id: jest.fn().mockReturnValue(null) } };
    scavengerModel.findById.mockResolvedValue(mockHunt);

    const req = mockRequest({}, { id: 'validScavengerId', locationId: 'invalidLocationId' });
    const res = mockResponse();
    const next = jest.fn();

    await getClueLocation(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });  
});

