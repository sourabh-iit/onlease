interface MobileNumber {
  id: number;
  value: string;
  created_at: Date;
}

interface Lodging {
  id: number;
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
  favorite_properties?: Lodging[];
  image?: Image;
  agreements: Agreement[];
}
