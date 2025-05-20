/* eslint-disable */
/* @ts-nocheck */
export default function planetFactory({ id }:any) {
  return {
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
        residents: ["/people/1/", "/people/2/"],
      },
      _id: id,
      description: "A planet in the Star Wars universe",
      uid: id,
      __v: 2,
    },
  };
}
