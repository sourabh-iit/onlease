interface MobileNumber {
  id: number;
  value: string;
  created_at: Date;
}

interface Region {
  id: number;
  name: string;
  state: {
    id: number;
    name: string;
  }
}

interface LodgingImage {
  id: number;
  image: string;
  image_mobile: string;
  image_thumbnail: string;
  created_at: string;
  tag: string;
  tag_other: string;
}

interface Lodging {
  id: number;
  region?: Region;
  region_id?: number;
  facilities: any;
  available_from: any;
  address: string;
  lodging_type: string;
  lodging_type_other: string;
  total_floors: number;
  floor_no: number;
  furnishing: string;
  rent: string;
  area: string;
  unit: string;
  bathrooms: number;
  rooms: number;
  balconies: number;
  halls: number;
  advance_rent_of_months: number;
  flooring: string;
  flooring_other: string;
  additional_details: string;
  is_booked: boolean;
  latlng: string;
  virtual_tour_link: string;
  region_temp?: Region;
  images: LodgingImage[];
  charges: Charge[];
  posted_by?: User;
  isHidden: boolean;
}

interface Image {
  id: number;
  file: string;
  thumbnail: string;
  created_at: Date;
}

interface AgreementPoint {
  id: number;
  text: string;
  updated_at: Date;
}

interface Agreement {
  id: number;
  points: AgreementPoint[];
  title: string;
}

interface User {
  mobile_number: string;
  first_name: string;
  last_name: string;
  mobile_numbers: MobileNumber[];
  email: string;
  is_allowed: boolean;
  gender: string;
  created_at: Date;
  favorites: Array<number>;
  image?: Image;
  agreements: Agreement[];
}

interface Charge {
  id?: number;
  amount: string;
  description: string;
  is_per_month: boolean;
}