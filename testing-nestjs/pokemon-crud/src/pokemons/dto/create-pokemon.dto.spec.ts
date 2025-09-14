import 'reflect-metadata';
import { CreatePokemonDto } from './create-pokemon.dto';
import { validate } from 'class-validator';

describe('CreatePokemonDto', () => {
    it('should be valid with correct data', async () => {
        const dto = new CreatePokemonDto();

        dto.name = 'Pikachu';
        dto.type = 'Electric';

        const errors = await validate(dto);

        expect(errors.length).toBe(0)
    })

    it('should be invalid if name is not present', async () => {
        const dto = new CreatePokemonDto();

        dto.type = 'Electric';

        const errors = await validate(dto);

        const nameError = errors.find(err => err.property === 'name')

        expect(nameError).toBeDefined()
    })

    it('should be invalid if type is not present', async () => {
        const dto = new CreatePokemonDto();

        dto.name = 'Pikachu';

        const errors = await validate(dto);

        const typeError = errors.find(err => err.property === 'type')

        expect(typeError).toBeDefined()
    })


    it('should hp must be positive number', async () => {
        const dto = new CreatePokemonDto();
        dto.name = 'Pikachu';
        dto.type = 'Electric';
        dto.hp = -10;

        const errors = await validate(dto);
        const hpError = errors.find(err => err.property === 'hp');

        const constrains = hpError?.constraints;

        expect(hpError).toBeDefined()
        expect(constrains).toEqual({ min: 'hp must not be less than 0' })

    })

    it('should be invalid with non-strings sprites', async () => {
        const dto = new CreatePokemonDto();
        dto.name = 'Pikachu';
        dto.type = 'Electric';
        dto.sprites = [12, 345] as unknown as string[]

        const errors = await validate(dto);
        const spritesError = errors.find(err => err.property === 'sprites');

        expect(spritesError).toBeDefined()
    })

    it('should be valid with string sprites', async () => {
        const dto = new CreatePokemonDto();
        dto.name = 'Pikachu';
        dto.type = 'Electric';
        dto.sprites = ['sprite.png', 'sprite2.png']

        const errors = await validate(dto);
        const spritesError = errors.find(err => err.property === 'sprites');

        expect(spritesError).toBeUndefined()
    })
})