import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { Pokemon } from 'src/pokemons/entities/pokemon.entity';

describe('Pokemons (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true
            })
        )

        await app.init();
    });

    it('/pokemons (POST) - with no body', async () => {
        const response = await request(app.getHttpServer()).post("/pokemons")
        const messageArray = response.body.message ?? []

        const mostHaveErrorMessage = [
            'name must be a string',
            'name should not be empty',
            'type must be a string',
            'type should not be empty'
        ]

        expect(response.statusCode).toBe(400)
        expect(messageArray).toEqual(
            expect.arrayContaining(mostHaveErrorMessage)
        )
    });


    it('/pokemons (POST) - with valid body', async () => {
        const response = await request(app.getHttpServer()).post("/pokemons")
            .send({
                name: "Pikachu",
                type: "Electric"
            })

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            name: "Pikachu",
            type: "Electric",
            id: expect.any(Number),
            hp: 0,
            sprites: []
        })
    });


    it('/pokemons (GET) should paginated list of pokemons', async () => {
        const response = await request(app.getHttpServer())
            .get("/pokemons")
            .query({
                limit: 5,
                page: 1
            })

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(5);

        (response.body as Pokemon[]).forEach(pokemon => {
            expect(pokemon).toHaveProperty("id")
            expect(pokemon).toHaveProperty("name")
            expect(pokemon).toHaveProperty("type")
            expect(pokemon).toHaveProperty("hp")
            expect(pokemon).toHaveProperty("sprites")
        });
    });

    it('/pokemons/:id (GET) should return a Pokemon by ID', async () => {
        const response = await request(app.getHttpServer())
            .get("/pokemons/1")
            .query({
                limit: 5,
                page: 1
            })

        const pokemon = response.body as Pokemon;
        expect(response.statusCode).toBe(200);
        expect(pokemon).toEqual({
            id: 1,
            name: 'bulbasaur',
            type: 'grass',
            hp: 45,
            sprites: [
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png'
            ]
        });
    });

    it('/pokemons/:id (GET) should return a Pokemon NOT FOUND', async () => {
        const pokeId = 40000;
        const response = await request(app.getHttpServer())
            .get(`/pokemons/${pokeId}`)

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            message: `Pokemon with id ${pokeId} not found`,
            error: 'Not Found',
            statusCode: 404
        });
    });

    it('/pokemons/:id (PATCH) should update Pokemon', async () => {
        const pokeId = 2;
        const dto = { name: 'Pikachu', type: 'Electric' }
        const currentPokemon = await request(app.getHttpServer())
            .get(`/pokemons/${pokeId}`)

        const response = await request(app.getHttpServer())
            .patch(`/pokemons/${pokeId}`)
            .send(dto)

        expect(currentPokemon.body.id).toBe(response.body.id);
        expect(currentPokemon.body.hp).toBe(response.body.hp);
        expect(currentPokemon.body.sprites).toEqual(response.body.sprites);
        expect(response.body.name).toBe(dto.name);
        expect(response.body.type).toBe(dto.type);

    });

    it('/pokemons/:id (PATCH) should throw an 404', async () => {
        const pokeId = 40000;
        const response = await request(app.getHttpServer())
            .patch(`/pokemons/${pokeId}`)
            .send({})

        expect(response.statusCode).toBe(404);
    });

    it('/pokemons/:id (DELETE) should delete Pokemon', async () => {
        const pokeId = 1;
        const response = await request(app.getHttpServer())
            .delete(`/pokemons/${pokeId}`)

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Pokemon #bulbasaur removed!')
    });

    it('/pokemons/:id (DELETE) should throw an 404', async () => {
        const pokeId = 1000000;
        const response = await request(app.getHttpServer())
            .delete(`/pokemons/${pokeId}`)

        expect(response.statusCode).toBe(404);
    });
});
