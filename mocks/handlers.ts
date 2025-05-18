import { http, HttpResponse } from "msw";

import defaultFavourites from "./mock-data/favourites.json";
import defaultCharacters from "./mock-data/characters.json";
import {type favourite, getAllFavourites, addFavourite, removeFavourite} from "./db"
console.log(import.meta.env)



// Initialize favourites from IndexedDB
export let favourites: favourite[] = [];
getAllFavourites().then((favs) => {
  favourites = favs.length
    ? favs
    : defaultFavourites;
  // Persist initial data if IndexedDB was empty
  if (!favs.length) {
    favourites.forEach(addFavourite);
  }
});

const isTestingEnv = import.meta.env.MODE === "test";

export let characters = defaultCharacters;

export let handlers = [
  http.post("/api/favourites", async (req) => {
    const newFavourite = (await req.request.json()) as favourite;
    if (!newFavourite) return HttpResponse.json({ error: "Invalid request" });
    if (!favourites.find((fav) => fav.uid === newFavourite.uid)) {
      await addFavourite(newFavourite);
      return HttpResponse.json({ message: "Character added to favourites" });
    } else {
      return HttpResponse.json({ message: "Character already in favourites" });
    }
  }),

  // Handler for removing a character from favorites
  http.delete("/api/favourites/:id", (req) => {
    const { id } = req.params;
    removeFavourite(id as string);
    return HttpResponse.json({ message: "Character removed from favourites" });
  }),

  // Handler for getting all favorite characters
  http.get("/api/favourites", async (req) => {
    return HttpResponse.json(await getAllFavourites());
  }),
];

if (isTestingEnv) {
  handlers = handlers.concat([
    http.get(import.meta.env.VITE_SWAPI_BASE_URL + "/people/:id", (req) => {
      const { id } = req.params;
      //gen random planet id from 1 to 60
      const planetId = Math.floor(Math.random() * 60) + 1;
      // Mock response for the character details endpoint
      return HttpResponse.json({
        message: "ok",
        result: {
          properties: {
            created: "2025-05-15T20:25:38.019Z",
            edited: "2025-05-15T20:25:38.019Z",
            name: "Luke Skywalker",
            gender: "male",
            skin_color: "fair",
            hair_color: "blond",
            height: "172",
            eye_color: "blue",
            mass: "77",
            homeworld: "https://www.swapi.tech/api/planets/" + planetId,
            birth_year: "19BBY",
            url: "https://www.swapi.tech/api/people/" + id,
          },
          _id: "5f63a36eee9fd7000499be42",
          description: "A person within the Star Wars universe",
          uid: id,
          __v: 2,
        },
        apiVersion: "1.0",
        timestamp: "2025-05-16T16:24:07.361Z",
        support: {},
        social: {},
      });
    }),
    // Mock handlers for SWAPI endpoints (for testing)
    http.get(import.meta.env.VITE_SWAPI_BASE_URL + "/people*", (req: any) => {
      // console.log("Response from msw handler:", req.request.url);
      let charactersList = [...characters];

      const params = new URL(req.request.url).searchParams;
      const page = parseInt(params.get("page") || "1", 10);
      const name = params.get("name") || "";
      if (name) {
        charactersList = charactersList.filter((character) => {
          return character.name.toLowerCase().includes(name.toLowerCase());
        });
      }

      if (page && page > 1) {
        charactersList = charactersList.map((c) => ({
          ...c,
          name: c.name + " " + page,
        }));
      }
      // Mock response for the people endpoint
      return HttpResponse.json({
        message: "ok",
        total_records: 82,
        total_pages: 9,
        previous: null,
        next: "https://swapi.tech/api/people?page=2&limit=10",
        results: name ? undefined : charactersList,
        result: name
          ? charactersList.map((c) => {
              return { properties: c };
            })
          : undefined,
        apiVersion: "1.0",
        timestamp: "2025-05-16T14:24:06.643Z",
        support: {
          contact: "admin@swapi.tech",
          donate:
            "https://www.paypal.com/donate/?business=2HGAUVTWGR5T2&no_recurring=0&item_name=Support+Swapi+and+keep+the+galaxy%27s+data+free%21+Your+donation+fuels+open-source+innovation+and+helps+us+grow.+Thank+you%21+%F0%9F%9A%80&currency_code=USD",
          partnerDiscounts: {
            saberMasters: {
              link: "https://www.swapi.tech/partner-discount/sabermasters-swapi",
              details:
                "Use this link to automatically get $10 off your purchase!",
            },
            heartMath: {
              link: "https://www.heartmath.com/ryanc",
              details:
                "Looking for some Jedi-like inner peace? Take 10% off your heart-brain coherence tools from the HeartMath Institute!",
            },
          },
        },
        social: {
          discord: "https://discord.gg/zWvA6GPeNG",
          reddit: "https://www.reddit.com/r/SwapiOfficial/",
          github: "https://github.com/semperry/swapi/blob/main/CONTRIBUTORS.md",
        },
      });
    }),

    http.get(import.meta.env.VITE_SWAPI_BASE_URL + "/films/", (req) => {
      // Mock response for the films endpoint
      return HttpResponse.json({
        count: 6,
        next: null,
        previous: null,
        results: [
          {
            title: "A New Hope",
            episode_id: 4,
            opening_crawl: "...",
            director: "George Lucas",
            producer: "Gary Kurtz, Rick McCallum",
            release_date: "1977-05-25",
            characters: [
              import.meta.env.VITE_SWAPI_BASE_URL + "/people/1/",
              // ...
            ],
            planets: [
              import.meta.env.VITE_SWAPI_BASE_URL + "/planets/1/",
              // ...
            ],
            starships: [
              import.meta.env.VITE_SWAPI_BASE_URL + "/starships/2/",
              // ...
            ],
            vehicles: [
              import.meta.env.VITE_SWAPI_BASE_URL + "/vehicles/4/",
              // ...
            ],
            species: [
              import.meta.env.VITE_SWAPI_BASE_URL + "/species/1/",
              // ...
            ],
            created: "2014-12-10T14:23:31.880000Z",
            edited: "2014-12-20T21:17:50.309000Z",
            url: import.meta.env.VITE_SWAPI_BASE_URL + "/films/1/",
          },
          // ... more mock film data
        ],
      });
    }),

    http.get(import.meta.env.VITE_SWAPI_BASE_URL + "/starships/", (req) => {
      // Mock response for the starships endpoint
      return HttpResponse.json({
        count: 36,
        next: import.meta.env.VITE_SWAPI_BASE_URL + "/starships/?page=2",
        previous: null,
        results: [
          {
            name: "CR90 corvette",
            model: "CR90 corvette",
            manufacturer: "Corellian Engineering Corporation",
            cost_in_credits: "3500000",
            length: "150",
            max_atmosphering_speed: "950",
            crew: "30-165",
            passengers: "600",
            cargo_capacity: "3000000",
            consumables: "1 year",
            hyperdrive_rating: "2.0",
            MGLT: "60",
            starship_class: "corvette",
            pilots: [],
            films: [
              import.meta.env.VITE_SWAPI_BASE_URL + "/films/1/",
              import.meta.env.VITE_SWAPI_BASE_URL + "/films/3/",
              import.meta.env.VITE_SWAPI_BASE_URL + "/films/6/",
            ],
            created: "2014-12-10T14:20:33.369000Z",
            edited: "2014-12-20T21:23:49.867000Z",
            url: import.meta.env.VITE_SWAPI_BASE_URL + "/starships/2/",
          },
          // ... more mock starship data
        ],
      });
    }),
    http.get(import.meta.env.VITE_SWAPI_BASE_URL + "/planets/", (req) => {
      // Mock response for the planets endpoint
      return HttpResponse.json({
        count: 61,
        next: import.meta.env.VITE_SWAPI_BASE_URL + "/planets/?page=2",
        previous: null,
        results: [
          {
            name: "Tatooine",
            rotation_period: "23",
            orbital_period: "304",
            diameter: "10465",
            climate: "arid",
            gravity: "1 standard",
            terrain: "desert",
            surface_water: "1",
            population: "200000",
            residents: [
              import.meta.env.VITE_SWAPI_BASE_URL + "/people/1/",
              import.meta.env.VITE_SWAPI_BASE_URL + "/people/2/",
              // ...
            ],
            films: [
              import.meta.env.VITE_SWAPI_BASE_URL + "/films/1/",
              import.meta.env.VITE_SWAPI_BASE_URL + "/films/2/",
              // ...
            ],
            created: "2014-12-09T13:50:49.641000Z",
            edited: "2014-12-20T20:58:18.411000Z",
            url: import.meta.env.VITE_SWAPI_BASE_URL + "/planets/1/",
          },
          // ... more mock planet data
        ],
      });
    }),
    http.get(import.meta.env.VITE_SWAPI_BASE_URL + "/planets/:id", (req) => {
      const { id } = req.params;
      // console.log("Request to SWAPI:", req.request.url);
      // Mock response for the planet details endpoint
      return HttpResponse.json({
        message: "ok",
        result: {
          properties: {
            name: "Tatooine",
            rotation_period: "23",
            orbital_period: "304",
            diameter: "10465",
            climate: "arid",
            gravity: "1 standard",
            terrain: "desert",
            surface_water: "1",
            population: "200000",
            residents: [
              import.meta.env.VITE_SWAPI_BASE_URL + "/people/1/",
              import.meta.env.VITE_SWAPI_BASE_URL + "/people/2/",
              // ...
            ],
          },
          _id: id,
          description: "A planet in the Star Wars universe",
          uid: id,
          __v: 2,
        },
      });
    }),

    http.all(import.meta.env.VITE_SWAPI_BASE_URL + "/*", (req) => {
      console.warn("MSW: Unhandled request:", req.request.url);
      return HttpResponse.json({ error: "Unhandled request" });
    }),
  ]);
}
