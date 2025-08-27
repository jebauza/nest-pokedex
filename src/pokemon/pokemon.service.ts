import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService  
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit', 10);
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleExceptions(error);

    }
  }

  findAll(paginationDto: PaginationDto) {

    const {offset = 0, limit = this.defaultLimit} = paginationDto;

    return this.pokemonModel.find()
      .skip(offset)
      .limit(limit)
      .sort({
        no: 1
      })
      .select('-__v');
  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;

    // MongoID
    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Numeric Term
    if (!pokemon && !isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term});
    } 

    // Name
    pokemon ??= await this.pokemonModel.findOne({name: term.toLocaleLowerCase()});
    
    if (!pokemon) 
      throw new NotFoundException(`Pokemon with id, name or no ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto?.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return {...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error) {

      this.handleExceptions(error);
    }
  }

  async remove(id: string) {

    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`);
    }

    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}
