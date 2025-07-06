import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationParams {
  @ApiProperty({ example: 1 })
  @IsDefined()
  page: number;
  @ApiProperty({ example: 10, examples: [10, 20, 30, 40, 50] })
  @IsDefined()
  limit: number;
}

export class ParamIdDto {
  @ApiProperty({ example: 1 })
  @IsDefined()
  id: number;
}

export class ParamUserIdDto {
  @ApiProperty({ example: 1 })
  @IsDefined()
  user_id: number;
}
export interface SingleResponse<T> {
  result: T;
}
