export type Place = {
  id: number;
  name: string;
  description: string | null;
  visitLater: boolean;
  liked: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
};

export type Trip = {
  id: number;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  createdAt: string;
};

export type TripPlace = {
  id: number;
  tripId: number;
  placeId: number;
  orderIndex: number;
  visited: boolean;
  visitDate: string | null;
  notes: string | null;
  createdAt: string;
};

export type PlacePhoto = {
  id: number;
  placeId: number;
  uri: string;
  createdAt: string;
};
