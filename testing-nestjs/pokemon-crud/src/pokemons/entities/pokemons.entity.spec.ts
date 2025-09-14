import { Pokemon } from "./pokemon.entity"

describe('PokemonEntity', () => {

    it("should create a Pokemon instance", () => {
        const pokemon = new Pokemon()

        expect(pokemon).toBeInstanceOf(Pokemon);
    })

    it('should have these properties', () => {
        const pokemon = new Pokemon()

        pokemon.id = 1;
        pokemon.name = 'Pikachu'
        pokemon.type = 'Electric';
        pokemon.hp = 10;
        pokemon.sprites = ['sprite.png']

        expect(pokemon.id).toEqual(1)
        expect(pokemon.name).toEqual("Pikachu")
        expect(pokemon.type).toEqual("Electric")
        expect(pokemon.hp).toEqual(10)
        expect(pokemon.sprites).toEqual(['sprite.png'])
    })
})