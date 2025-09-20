export interface ClubFormData {
  coverImage: string;
  profileImage: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedIn: string;
    website: string;
  };
  contact: {
    email: string;
    phone: string;
    googleMapURL: string;
    headquarters: string;
  };
  details: {
    values: string[];
    avenues: string[];
    about: string;
    mission?: string; // Optional mission field
  };
}
