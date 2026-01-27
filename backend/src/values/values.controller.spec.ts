import { Test, TestingModule } from '@nestjs/testing';
import { ValuesController } from './values.controller';
import { ValuesService } from './values.service';
import { CreateValueDto } from './dto/create-value.dto';
import { UpdateValueDto } from './dto/update-value.dto';
import { Value } from './entities/value.entity';

describe('ValuesController', () => {
  let controller: ValuesController;
  let service: jest.Mocked<ValuesService>;

  const mockValue: Value = {
    id: 1,
    name: 'Test Value',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockValuesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValuesController],
      providers: [
        {
          provide: ValuesService,
          useValue: mockValuesService,
        },
      ],
    }).compile();

    controller = module.get<ValuesController>(ValuesController);
    service = module.get(ValuesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new value', async () => {
      const createDto: CreateValueDto = {
        name: 'Test Value',
        description: 'Test Description',
      };
      mockValuesService.create.mockResolvedValue(mockValue);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockValue);
    });

    it('should create a value without description', async () => {
      const createDto: CreateValueDto = {
        name: 'Test Value',
      };
      const valueWithoutDesc = { ...mockValue, description: undefined };
      mockValuesService.create.mockResolvedValue(valueWithoutDesc);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(valueWithoutDesc);
    });
  });

  describe('findAll', () => {
    it('should return an array of values', async () => {
      const values = [mockValue, { ...mockValue, id: 2 }];
      mockValuesService.findAll.mockResolvedValue(values);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(values);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no values exist', async () => {
      mockValuesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single value', async () => {
      mockValuesService.findOne.mockResolvedValue(mockValue);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockValue);
    });
  });

  describe('update', () => {
    it('should update a value', async () => {
      const updateDto: UpdateValueDto = {
        name: 'Updated Value',
      };
      const updatedValue = { ...mockValue, name: 'Updated Value' };
      mockValuesService.update.mockResolvedValue(updatedValue);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.name).toBe('Updated Value');
    });

    it('should update multiple fields', async () => {
      const updateDto: UpdateValueDto = {
        name: 'Updated Value',
        description: 'Updated Description',
      };
      const updatedValue = { ...mockValue, ...updateDto };
      mockValuesService.update.mockResolvedValue(updatedValue);

      const result = await controller.update(1, updateDto);

      expect(result.name).toBe('Updated Value');
      expect(result.description).toBe('Updated Description');
    });
  });

  describe('remove', () => {
    it('should remove a value', async () => {
      mockValuesService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
