import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

import { migrations, schemaVersion } from './schema';
import { Place, PlacePhoto, Trip, TripPlace } from './types';

let dbPromise: Promise<SQLiteDatabase> | null = null;

const getDatabase = () => {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync('gonext.db');
  }
  return dbPromise;
};

const withTransaction = async (db: SQLiteDatabase, task: () => Promise<void>) => {
  await db.execAsync('BEGIN');
  try {
    await task();
    await db.execAsync('COMMIT');
  } catch (error) {
    await db.execAsync('ROLLBACK');
    throw error;
  }
};

const execStatements = async (db: SQLiteDatabase, statements: string[]) => {
  for (const statement of statements) {
    try {
      await db.execAsync(statement);
    } catch (error) {
      const message = String(error);
      if (message.includes('duplicate column name')) {
        continue;
      }
      throw error;
    }
  }
};

export const initDatabase = async () => {
  const db = await getDatabase();
  const versionRows = await db.getAllAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = versionRows[0]?.user_version ?? 0;

  for (const migration of migrations) {
    if (migration.version <= currentVersion) {
      continue;
    }
    await withTransaction(db, async () => {
      await execStatements(db, migration.statements);
      await db.execAsync(`PRAGMA user_version = ${migration.version}`);
    });
    currentVersion = migration.version;
  }

  if (currentVersion < schemaVersion) {
    await db.execAsync(`PRAGMA user_version = ${schemaVersion}`);
  }
};

const mapPlace = (row: any): Place => ({
  id: row.id,
  name: row.name,
  description: row.description ?? null,
  visitLater: row.visit_later === 1,
  liked: row.liked === 1,
  dd: row.dd ?? null,
  createdAt: row.created_at,
});

const mapTrip = (row: any): Trip => ({
  id: row.id,
  title: row.title,
  description: row.description ?? null,
  startDate: row.start_date ?? null,
  endDate: row.end_date ?? null,
  current: row.current === 1,
  createdAt: row.created_at,
});

const mapTripPlace = (row: any): TripPlace => ({
  id: row.id,
  tripId: row.trip_id,
  placeId: row.place_id,
  orderIndex: row.order_index,
  visited: row.visited === 1,
  visitDate: row.visit_date ?? null,
  notes: row.notes ?? null,
  createdAt: row.created_at,
});

const mapPlacePhoto = (row: any): PlacePhoto => ({
  id: row.id,
  placeId: row.place_id,
  uri: row.uri,
  createdAt: row.created_at,
});

export const getPlaces = async (): Promise<Place[]> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM places ORDER BY created_at DESC');
  return rows.map(mapPlace);
};

export const getPlaceById = async (id: number): Promise<Place | null> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM places WHERE id = ?', [id]);
  const row = rows[0];
  return row ? mapPlace(row) : null;
};

export const getPlacePhotos = async (placeId: number): Promise<PlacePhoto[]> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM place_photos WHERE place_id = ? ORDER BY created_at DESC',
    [placeId]
  );
  return rows.map(mapPlacePhoto);
};

export const addPlace = async (place: {
  name: string;
  description?: string;
  visitLater?: boolean;
  liked?: boolean;
  dd?: string | null;
}) => {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO places (name, description, visit_later, liked, dd, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      place.name,
      place.description ?? null,
      place.visitLater ? 1 : 0,
      place.liked ? 1 : 0,
      place.dd ?? null,
      createdAt,
    ]
  );
  return result.lastInsertRowId ?? null;
};

export const addPlacePhoto = async (placeId: number, uri: string) => {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO place_photos (place_id, uri, created_at)
     VALUES (?, ?, ?)`,
    [placeId, uri, createdAt]
  );
  return result.lastInsertRowId ?? null;
};

export const getTrips = async (): Promise<Trip[]> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM trips ORDER BY created_at DESC');
  return rows.map(mapTrip);
};

export const getTripById = async (id: number): Promise<Trip | null> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM trips WHERE id = ?', [id]);
  const row = rows[0];
  return row ? mapTrip(row) : null;
};

export const addTrip = async (trip: {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}) => {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  if (trip.current) {
    await db.runAsync('UPDATE trips SET current = 0');
  }
  const result = await db.runAsync(
    `INSERT INTO trips (title, description, start_date, end_date, current, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      trip.title,
      trip.description ?? null,
      trip.startDate ?? null,
      trip.endDate ?? null,
      trip.current ? 1 : 0,
      createdAt,
    ]
  );
  return result.lastInsertRowId ?? null;
};

export const setCurrentTrip = async (tripId: number) => {
  const db = await getDatabase();
  await withTransaction(db, async () => {
    await db.runAsync('UPDATE trips SET current = 0');
    await db.runAsync('UPDATE trips SET current = 1 WHERE id = ?', [tripId]);
  });
};

export const addTripPlace = async (tripId: number, placeId: number) => {
  const db = await getDatabase();
  const orderRows = await db.getAllAsync<{ nextOrder: number }>(
    'SELECT COALESCE(MAX(order_index), 0) + 1 as nextOrder FROM trip_places WHERE trip_id = ?',
    [tripId]
  );
  const nextOrder = orderRows[0]?.nextOrder ?? 1;
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO trip_places (trip_id, place_id, order_index, visited, created_at)
     VALUES (?, ?, ?, 0, ?)`,
    [tripId, placeId, nextOrder, createdAt]
  );
  return result.lastInsertRowId ?? null;
};

export const getTripPlaces = async (tripId: number) => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>(
    `SELECT tp.*, p.name as place_name
     FROM trip_places tp
     JOIN places p ON p.id = tp.place_id
     WHERE tp.trip_id = ?
     ORDER BY tp.order_index ASC`,
    [tripId]
  );
  return rows.map((row) => ({
    ...mapTripPlace(row),
    placeName: row.place_name as string,
  }));
};

export const markTripPlaceVisited = async (tripPlaceId: number) => {
  const db = await getDatabase();
  const visitDate = new Date().toISOString();
  await db.runAsync(
    'UPDATE trip_places SET visited = 1, visit_date = ? WHERE id = ?',
    [visitDate, tripPlaceId]
  );
};

export const getNextTripPlace = async () => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>(
    `SELECT tp.*, p.name as place_name, p.description as place_description, p.dd
     FROM trip_places tp
     JOIN trips t ON t.id = tp.trip_id
     JOIN places p ON p.id = tp.place_id
     WHERE t.current = 1 AND tp.visited = 0
     ORDER BY tp.order_index ASC
     LIMIT 1`
  );
  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    ...mapTripPlace(row),
    placeName: row.place_name as string,
    placeDescription: row.place_description as string | null,
    dd: row.dd as string | null,
  };
};
