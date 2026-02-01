import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ValuesService } from './values.service';
import { Value } from './entities/value.entity';
import { CreateValueDto } from './dto/create-value.dto';
import { UpdateValueDto } from './dto/update-value.dto';

describe('ValuesService', () => {
  let service: ValuesService;

  const mockValue: Value = {
    id: 1,
    name: 'Test Value',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValuesService,
        {
          provide: getRepositoryToken(Value),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ValuesService>(ValuesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new value', async () => {
      const createDto: CreateValueDto = {
        name: 'Test Value',
        description: 'Test Description',
      };

      mockRepository.create.mockReturnValue(mockValue);
      mockRepository.save.mockResolvedValue(mockValue);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockValue);
      expect(result).toEqual(mockValue);
    });

    it('should create a value without description', async () => {
      const createDto: CreateValueDto = {
        name: 'Test Value',
      };
      const valueWithoutDesc = { ...mockValue, description: undefined };

      mockRepository.create.mockReturnValue(valueWithoutDesc);
      mockRepository.save.mockResolvedValue(valueWithoutDesc);

      const result = await service.create(createDto);

      expect(result.name).toBe('Test Value');
    });
  });

  describe('findAll', () => {
    it('should return an array of values', async () => {
      const values = [mockValue, { ...mockValue, id: 2, name: 'Second Value' }];
      mockRepository.find.mockResolvedValue(values);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(values);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no values exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a single value by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockValue);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockValue);
    });

    it('should throw NotFoundException when value not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Value with ID 999 not found');
    });
  });

  describe('update', () => {
    it('should update a value', async () => {
      const updateDto: UpdateValueDto = {
        name: 'Updated Value',
      };
      const updatedValue = { ...mockValue, name: 'Updated Value' };

      mockRepository.findOne.mockResolvedValue(mockValue);
      mockRepository.save.mockResolvedValue(updatedValue);

      const result = await service.update(1, updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Value');
    });

    it('should update only provided fields', async () => {
      const updateDto: UpdateValueDto = {
        description: 'Updated Description',
      };
      const updatedValue = { ...mockValue, description: 'Updated Description' };

      mockRepository.findOne.mockResolvedValue(mockValue);
      mockRepository.save.mockResolvedValue(updatedValue);

      const result = await service.update(1, updateDto);

      expect(result.description).toBe('Updated Description');
    });

    it('should throw NotFoundException when updating non-existent value', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a value', async () => {
      mockRepository.findOne.mockResolvedValue(mockValue);
      mockRepository.remove.mockResolvedValue(mockValue);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockValue);
    });

    it('should throw NotFoundException when removing non-existent value', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
