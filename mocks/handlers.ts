// mocks/handlers.ts
import { http } from 'msw';

// In-memory storage for favorites (replace with a more persistent solution if needed)
let favourites: string[] = [];

export const handlers = [
  // Handler for adding a character to favorites
  http.post('/api/favourites', (req, res, ctx) => {
    const { characterUrl } = req.body as { characterUrl: string };
    if (characterUrl && !favourites.includes(characterUrl)) {
      favourites = [...favourites, characterUrl];
      return res(ctx.status(200), ctx.json({ message: 'Character added to favourites' }));
    } else if (favourites.includes(characterUrl)) {
      return res(ctx.status(200), ctx.json({ message: 'Character already in favourites' }));
    }
    return res(ctx.status(400), ctx.json({ error: 'Invalid request' }));
  }),

  // Handler for removing a character from favorites
  http.delete('/api/favourites', (req, res, ctx) => {
    const { characterUrl } = req.body as { characterUrl: string };
    favourites = favourites.filter((url) => url !== characterUrl);
    return res(ctx.status(200), ctx.json({ message: 'Character removed from favourites' }));
  }),

  // Handler for getting all favorite characters
  http.get('/api/favourites', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(favourites));
  }),

  // Mock handlers for SWAPI endpoints (for testing)
  http.get('https://swapi.dev/api/people/', (req, res, ctx) => {
    // Mock response for the people endpoint
    return res(
      ctx.status(200),
      ctx.json({
        count: 82,
        next: 'https://swapi.dev/api/people/?page=2',
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            homeworld: 'https://swapi.dev/api/planets/1/',
            films: [
              'https://swapi.dev/api/films/1/',
              'https://swapi.dev/api/films/2/',
              'https://swapi.dev/api/films/3/',
              'https://swapi.dev/api/films/6/',
            ],
            species: [],
            vehicles: [
              'https://swapi.dev/api/vehicles/14/',
              'https://swapi.dev/api/vehicles/30/',
            ],
            starships: [
              'https://swapi.dev/api/starships/12/',
              'https://swapi.dev/api/starships/22/',
            ],
            created: '2014-12-10T15:10:51.357000Z',
            edited: '2014-12-20T21:17:56.891000Z',
            url: 'https://swapi.dev/api/people/1/',
          },
          // ... more mock character data
        ],
      })
    );
  }),

  http.get('https://swapi.dev/api/films/', (req, res, ctx) => {
    // Mock response for the films endpoint
    return res(
      ctx.status(200),
      ctx.json({
        count: 6,
        next: null,
        previous: null,
        results: [
          {
            title: 'A New Hope',
            episode_id: 4,
            opening_crawl: '...',
            director: 'George Lucas',
            producer: 'Gary Kurtz, Rick McCallum',
            release_date: '1977-05-25',
            characters: [
              'https://swapi.dev/api/people/1/',
              // ...
            ],
            planets: [
              'https://swapi.dev/api/planets/1/',
              // ...
            ],
            starships: [
              'https://swapi.dev/api/starships/2/',
              // ...
            ],
            vehicles: [
              'https://swapi.dev/api/vehicles/4/',
              // ...
            ],
            species: [
              'https://swapi.dev/api/species/1/',
              // ...
            ],
            created: '2014-12-10T14:23:31.880000Z',
            edited: '2014-12-20T21:17:50.309000Z',
            url: 'https://swapi.dev/api/films/1/',
          },
          // ... more mock film data
        ],
      })
    );
  }),

  http.get('https://swapi.dev/api/starships/', (req, res, ctx) => {
    // Mock response for the starships endpoint
    return res(
      ctx.status(200),
      ctx.json({
        count: 36,
        next: 'https://swapi.dev/api/starships/?page=2',
        previous: null,
        results: [
          {
            name: 'CR90 corvette',
            model: 'CR90 corvette',
            manufacturer: 'Corellian Engineering Corporation',
            cost_in_credits: '3500000',
            length: '150',
            max_atmosphering_speed: '950',
            crew: '30-165',
            passengers: '600',
            cargo_capacity: '3000000',
            consumables: '1 year',
            hyperdrive_rating: '2.0',
            MGLT: '60',
            starship_class: 'corvette',
            pilots: [],
            films: [
              'https://swapi.dev/api/films/1/',
              'https://swapi.dev/api/films/3/',
              'https://swapi.dev/api/films/6/',
            ],
            created: '2014-12-10T14:20:33.369000Z',
            edited: '2014-12-20T21:23:49.867000Z',
            url: 'https://swapi.dev/api/starships/2/',
          },
          // ... more mock starship data
        ],
      })
    );
  }),
];