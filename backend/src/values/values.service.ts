import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Value } from './entities/value.entity';
import { CreateValueDto } from './dto/create-value.dto';
import { UpdateValueDto } from './dto/update-value.dto';

@Injectable()
export class ValuesService {
  private readonly logger = new Logger(ValuesService.name);

  constructor(
    @InjectRepository(Value)
    private readonly valueRepository: Repository<Value>,
  ) {}

  async create(createValueDto: CreateValueDto): Promise<Value> {
    this.logger.log(`Creating value: ${createValueDto.name}`);
    const value = this.valueRepository.create(createValueDto);
    const saved = await this.valueRepository.save(value);
    this.logger.log(`Created value with ID: ${saved.id}`);
    return saved;
  }

  async findAll(): Promise<Value[]> {
    this.logger.log('Fetching all values');
    const values = await this.valueRepository.find();
    this.logger.log(`Found ${values.length} values`);
    return values;
  }

  async findOne(id: number): Promise<Value> {
    this.logger.log(`Fetching value with ID: ${id}`);
    const value = await this.valueRepository.findOne({ where: { id } });
    if (!value) {
      this.logger.warn(`Value with ID ${id} not found`);
      throw new NotFoundException(`Value with ID ${id} not found`);
    }
    return value;
  }

  async update(id: number, updateValueDto: UpdateValueDto): Promise<Value> {
    this.logger.log(`Updating value with ID: ${id}`);
    const value = await this.findOne(id);
    Object.assign(value, updateValueDto);
    const updated = await this.valueRepository.save(value);
    this.logger.log(`Updated value with ID: ${id}`);
    return updated;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing value with ID: ${id}`);
    const value = await this.findOne(id);
    await this.valueRepository.remove(value);
    this.logger.log(`Removed value with ID: ${id}`);
  }
}
