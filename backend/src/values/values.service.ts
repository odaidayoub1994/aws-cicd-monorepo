import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Value } from './entities/value.entity';
import { CreateValueDto } from './dto/create-value.dto';
import { UpdateValueDto } from './dto/update-value.dto';

@Injectable()
export class ValuesService {
  constructor(
    @InjectRepository(Value)
    private readonly valueRepository: Repository<Value>,
  ) {}

  async create(createValueDto: CreateValueDto): Promise<Value> {
    const value = this.valueRepository.create(createValueDto);
    return this.valueRepository.save(value);
  }

  async findAll(): Promise<Value[]> {
    return this.valueRepository.find();
  }

  async findOne(id: number): Promise<Value> {
    const value = await this.valueRepository.findOne({ where: { id } });
    if (!value) {
      throw new NotFoundException(`Value with ID ${id} not found`);
    }
    return value;
  }

  async update(id: number, updateValueDto: UpdateValueDto): Promise<Value> {
    const value = await this.findOne(id);
    Object.assign(value, updateValueDto);
    return this.valueRepository.save(value);
  }

  async remove(id: number): Promise<void> {
    const value = await this.findOne(id);
    await this.valueRepository.remove(value);
  }
}
