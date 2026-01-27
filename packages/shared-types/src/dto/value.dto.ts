export interface CreateValueDto {
  name: string;
  description?: string;
}

export interface UpdateValueDto {
  name?: string;
  description?: string;
}
