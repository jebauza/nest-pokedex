import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    offset?: number;

    @IsOptional()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    limit?: number;

}