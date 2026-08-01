import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export interface Camper {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  form: 'alcove' | 'panel_van' | 'integrated' | 'semi_integrated';
  transmission: 'automatic' | 'manual';
  engine: 'diesel' | 'petrol' | 'hybrid' | 'electric';
  coverImage: string;
  totalReviews: number;
}

export interface CampersResponse {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  campers: Camper[];
}

export interface FiltersResponse {
  forms: string[];
  transmissions: string[];
  engines: string[];
}

export interface CampersParams {
  page?: number;
  perPage?: number;
  location?: string;
  form?: string;
  transmission?: string;
  engine?: string;
}

export const getCampers = async (
  params: CampersParams
): Promise<CampersResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '')
  );

  const { data } = await api.get('/campers', {
    params: cleanParams,
  });

  return data;
};

export const getFilters = async (): Promise<FiltersResponse> => {
  const { data } = await api.get('/campers/filters');
  return data;
};

export interface CamperDetails {
  id: string;
  name: string;
  price: number;
  rating: number;
  totalReviews: number;
  location: string;
  description: string;

  form: string;
  length: string;
  width: string;
  height: string;
  tank: string;
  consumption: string;

  transmission: string;
  engine: string;
  amenities: string[];

  gallery: {
    id: string;
    camperId: string;
    thumb: string;
    original: string;
    order: number;
  }[];
}

export interface Review {
  id: string;
  camperId: string;
  reviewer_name: string;
  reviewer_rating: number;
  comment: string;
  createdAt: string;
}

export const getCamperById = async (
  camperId: string
): Promise<CamperDetails> => {
  const { data } = await api.get(`/campers/${camperId}`);

  return data;
};

export const getCamperReviews = async (camperId: string): Promise<Review[]> => {
  const { data } = await api.get(`/campers/${camperId}/reviews`);

  return data;
};

export const createBookingRequest = async (
  camperId: string,
  payload: {
    name: string;
    email: string;
  }
) => {
  const { data } = await api.post(
    `/campers/${camperId}/booking-requests`,
    payload
  );

  return data;
};
