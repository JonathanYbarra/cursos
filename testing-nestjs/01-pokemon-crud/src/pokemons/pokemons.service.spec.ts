import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a pokemon', async () => {
    const newPokemon = {
      name: "Pikachu",
      type: "Electric",
      sprites: []
    }
    const result = await service.create(newPokemon)

    expect(result).toEqual({
      "name": "Pikachu",
      "type": "Electric",
      "hp": 0,
      "sprites": [],
      "id": expect.any(Number)
    })
  });

  it('should throw an error if pokemon exist', async () => {
    const data = {
      name: "Pikachu",
      type: "Electric",
      sprites: []
    }
    await service.create(data)

    try {
      await service.create(data)
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
    }
  })

  it('should return pokemon if exist', async () => {
    const id = 4
    const result = await service.findOne(id)

    expect(result).toEqual({
      id: 4,
      name: 'charmander',
      type: 'fire',
      hp: 39,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png'
      ]
    })
  });

  it('should return 404 error if pokemon doesnt exists', async () => {
    const id = 400_000
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException)
    await expect(service.findOne(id)).rejects.toThrow(`Pokemon with id ${id} not found`)
  });

  it('should return a pokemon from cache', async () => {
    const cacheSpy = jest.spyOn(service.paginatedPokemonsCache, 'get')
    const id = 1
    await service.findOne(id)
    await service.findOne(id)

    expect(cacheSpy).toHaveBeenCalledTimes(0)
  });

  it('should check properties of the pokemon', async () => {
    const id = 4
    const pokemon = await service.findOne(id)

    expect(pokemon).toHaveProperty('id')
    expect(pokemon).toHaveProperty('name')
    expect(pokemon).toEqual(
      expect.objectContaining({
        id,
        hp: expect.any(Number)
      })
    )
  });

  it('should find all pokemons and cache them', async () => {
    const pokemons = await service.findAll({ limit: 10, page: 1 })

    expect(pokemons).toBeInstanceOf(Array)
    expect(pokemons.length).toBe(10)
    expect(service.paginatedPokemonsCache.has('10-1')).toBeTruthy()
    expect(service.paginatedPokemonsCache.get('10-1')).toEqual(pokemons)
  });

  it('should return pokemons from cache', async () => {
    const cacheSpy = jest.spyOn(service.paginatedPokemonsCache, 'get')
    const fetchSpy = jest.spyOn(global, 'fetch')

    await service.findAll({ limit: 10, page: 1 })

    await service.findAll({ limit: 10, page: 1 })

    expect(fetchSpy).toHaveBeenCalledTimes(11)
    expect(cacheSpy).toHaveBeenCalledTimes(1)
    expect(cacheSpy).toHaveBeenCalledWith("10-1")
  });

  it('should update pokemon', async () => {
    const id = 1
    const dto = { name: "Charmander 2" }

    const updatedPokemon = await service.update(id, dto)

    expect(updatedPokemon).toEqual({
      id: 1,
      name: 'Charmander 2',
      type: 'grass',
      hp: 45,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png'
      ]
    })
  })

  it('should not update pokemon if not exists', async () => {
    const id = 100000
    const dto = { name: "Charmander 2" }


    try {
      await service.update(id, dto)
      expect(true).toBeFalsy()
    }
    catch (err) {
      expect(err).toBeInstanceOf(NotFoundException)
    }
  });

  it('should remove pokemon from cache', async () => {
    const id = 1
    await service.findOne(id)

    await service.remove(id)

    expect(service.pokemonsCache.get(id)).toBeUndefined()
  });
});
