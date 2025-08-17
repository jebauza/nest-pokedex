import { IsNumber, IsPositive, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {

    @IsNumber()
    @IsPositive()
    @Min(1)
    no: number;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    name: string;

}
