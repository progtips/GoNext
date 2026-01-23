import * as SQLite from 'expo-sqlite';

import { schemaStatements } from './schema';
import { Place, Trip, TripPlace } from './types';

const db = SQLite.openDatabase('gonext.db');

const runSql = (sql: string, params: Array<string | number | null> = []) =>
  new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });

export const initDatabase = async () => {
  await new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        schemaStatements.forEach((statement) => {
          tx.executeSql(statement);
        });
      },
      (error) => reject(error),
      () => resolve()
    );
  });
};

const mapPlace = (row: any): Place => ({
  id: row.id,
  name: row.name,
  description: row.description ?? null,
  visitLater: row.visit_later === 1,
  liked: row.liked === 1,
  latitude: row.latitude ?? null,
  longitude: row.longitude ?? null,
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

export const getPlaces = async (): Promise<Place[]> => {
  const result = await runSql('SELECT * FROM places ORDER BY created_at DESC');
  return result.rows._array.map(mapPlace);
};

export const getPlaceById = async (id: number): Promise<Place | null> => {
  const result = await runSql('SELECT * FROM places WHERE id = ?', [id]);
  const row = result.rows._array[0];
  return row ? mapPlace(row) : null;
};

export const addPlace = async (place: {
  name: string;
  description?: string;
  visitLater?: boolean;
  liked?: boolean;
  latitude?: number | null;
  longitude?: number | null;
}) => {
  const createdAt = new Date().toISOString();
  const result = await runSql(
    `INSERT INTO places (name, description, visit_later, liked, latitude, longitude, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      place.name,
      place.description ?? null,
      place.visitLater ? 1 : 0,
      place.liked ? 1 : 0,
      place.latitude ?? null,
      place.longitude ?? null,
      createdAt,
    ]
  );
  return result.insertId ?? null;
};

export const getTrips = async (): Promise<Trip[]> => {
  const result = await runSql('SELECT * FROM trips ORDER BY created_at DESC');
  return result.rows._array.map(mapTrip);
};

export const getTripById = async (id: number): Promise<Trip | null> => {
  const result = await runSql('SELECT * FROM trips WHERE id = ?', [id]);
  const row = result.rows._array[0];
  return row ? mapTrip(row) : null;
};

export const addTrip = async (trip: {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}) => {
  const createdAt = new Date().toISOString();
  if (trip.current) {
    await runSql('UPDATE trips SET current = 0');
  }
  const result = await runSql(
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
  return result.insertId ?? null;
};

export const setCurrentTrip = async (tripId: number) => {
  await runSql('UPDATE trips SET current = 0');
  await runSql('UPDATE trips SET current = 1 WHERE id = ?', [tripId]);
};

export const addTripPlace = async (tripId: number, placeId: number) => {
  const orderResult = await runSql(
    'SELECT COALESCE(MAX(order_index), 0) + 1 as nextOrder FROM trip_places WHERE trip_id = ?',
    [tripId]
  );
  const nextOrder = orderResult.rows._array[0]?.nextOrder ?? 1;
  const createdAt = new Date().toISOString();
  const result = await runSql(
    `INSERT INTO trip_places (trip_id, place_id, order_index, visited, created_at)
     VALUES (?, ?, ?, 0, ?)`,
    [tripId, placeId, nextOrder, createdAt]
  );
  return result.insertId ?? null;
};

export const getTripPlaces = async (tripId: number) => {
  const result = await runSql(
    `SELECT tp.*, p.name as place_name
     FROM trip_places tp
     JOIN places p ON p.id = tp.place_id
     WHERE tp.trip_id = ?
     ORDER BY tp.order_index ASC`,
    [tripId]
  );
  return result.rows._array.map((row) => ({
    ...mapTripPlace(row),
    placeName: row.place_name as string,
  }));
};

export const markTripPlaceVisited = async (tripPlaceId: number) => {
  const visitDate = new Date().toISOString();
  await runSql(
    'UPDATE trip_places SET visited = 1, visit_date = ? WHERE id = ?',
    [visitDate, tripPlaceId]
  );
};

export const getNextTripPlace = async () => {
  const result = await runSql(
    `SELECT tp.*, p.name as place_name, p.description as place_description, p.latitude, p.longitude
     FROM trip_places tp
     JOIN trips t ON t.id = tp.trip_id
     JOIN places p ON p.id = tp.place_id
     WHERE t.current = 1 AND tp.visited = 0
     ORDER BY tp.order_index ASC
     LIMIT 1`
  );
  const row = result.rows._array[0];
  if (!row) {
    return null;
  }

  return {
    ...mapTripPlace(row),
    placeName: row.place_name as string,
    placeDescription: row.place_description as string | null,
    latitude: row.latitude as number | null,
    longitude: row.longitude as number | null,
  };
};
