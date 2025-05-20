import { openDB } from "idb";
export type favourite = {
  name: string;
  height: string;
  gender: string;
  homeWorld: string;
  uid: string;
  url: string;
};
const DB_NAME = "star-wars";
const STORE_NAME = "favourites";
const DB_VERSION = 1;

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "uid" });
      }
    },
  });
}

export async function getAllFavourites(): Promise<favourite[]> {
  const db = await getDB();
  return (await db.getAll(STORE_NAME)) as favourite[];
}

export async function addFavourite(fav: favourite): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, fav);
}

export async function removeFavourite(uid: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, uid);
}

export async function getFavouriteById(uid: string): Promise<favourite | undefined> {
  const db = await getDB();
  return (await db.get(STORE_NAME, uid)) as favourite;
}

export async function clearFavourites(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
