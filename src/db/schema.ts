export const schemaVersion = 2;

export const migrations = [
  {
    version: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        visit_later INTEGER NOT NULL DEFAULT 0,
        liked INTEGER NOT NULL DEFAULT 0,
        latitude REAL,
        longitude REAL,
        created_at TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        start_date TEXT,
        end_date TEXT,
        current INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS trip_places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER NOT NULL,
        place_id INTEGER NOT NULL,
        order_index INTEGER NOT NULL,
        visited INTEGER NOT NULL DEFAULT 0,
        visit_date TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (trip_id) REFERENCES trips(id),
        FOREIGN KEY (place_id) REFERENCES places(id)
      );`,
      `CREATE TABLE IF NOT EXISTS place_photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        place_id INTEGER NOT NULL,
        uri TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (place_id) REFERENCES places(id)
      );`,
      `CREATE TABLE IF NOT EXISTS trip_place_photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_place_id INTEGER NOT NULL,
        uri TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (trip_place_id) REFERENCES trip_places(id)
      );`,
    ],
  },
  {
    version: 2,
    statements: [
      `ALTER TABLE places ADD COLUMN visit_later INTEGER NOT NULL DEFAULT 0;`,
      `ALTER TABLE places ADD COLUMN liked INTEGER NOT NULL DEFAULT 0;`,
      `ALTER TABLE places ADD COLUMN latitude REAL;`,
      `ALTER TABLE places ADD COLUMN longitude REAL;`,
    ],
  },
];
