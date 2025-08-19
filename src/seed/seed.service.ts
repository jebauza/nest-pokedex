import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {

    await this.pokemonModel.deleteMany({}); // Clear existing data

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach(async ({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2]; // Get the second last segment which is the ID

      // let pokemon = await this.pokemonModel.create({name, no});
      pokemonToInsert.push({name, no});
    });

    await this.pokemonModel.insertMany(pokemonToInsert); // Insert all pokemon at once

    return 'Seed executed successfully';
  }

  async executeSeed2() {

    await this.pokemonModel.deleteMany({}); // Clear existing data

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const insertPromisesArray: Promise<Pokemon>[] = [];

    data.results.forEach(async ({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2]; // Get the second last segment which is the ID

      // let pokemon = await this.pokemonModel.create({name, no});
      insertPromisesArray.push(this.pokemonModel.create({name, no}));
    });

    await Promise.all(insertPromisesArray); // Wait for all insertions to complete

    return 'Seed executed successfully';
  }

}
