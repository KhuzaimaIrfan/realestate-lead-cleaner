export type Intent = 'buy' | 'rent' | 'sell' | 'unknown';
export type Role = 'buyer' | 'tenant' | 'owner' | 'agent' | 'unknown';
export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'room' | 'office' | 'land' | 'unknown';
export type FurnishedStatus = 'furnished' | 'semi-furnished' | 'unfurnished' | 'unknown' | null;
export type FamilyOrBachelor = 'family' | 'bachelor' | 'mixed' | 'unknown' | null;

export interface LeadData {
  intent: Intent;
  role: Role;
  property_type: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  location: string | null;
  furnished: FurnishedStatus;
  budget_min: number | null;
  budget_max: number | null;
  budget_currency: string | null;
  parking_required: boolean | null;
  family_or_bachelor: FamilyOrBachelor;
  move_in_date: string | null;
  contact: string | null;
  notes: string | null;
  short_summary: string;
}

export interface LeadFormState {
  leadText: string;
  marketHint: string;
}