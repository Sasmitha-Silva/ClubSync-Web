"use client";

import { Phone, Mail, MapPin, Building } from "lucide-react";
import { ClubFormData } from "../types";

interface Props {
  formData: ClubFormData;
  setFormData: (data: ClubFormData) => void;
}

export default function ContactDetailsStep({ formData, setFormData }: Props) {
  const handleInputChange = (field: keyof ClubFormData['contact'], value: string) => {
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="text-gray-600">How can members reach your club?</p>
      </div>

      <div className="space-y-6">
        {/* Email */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="email"
            placeholder="Official club email"
            value={formData.contact.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="tel"
            placeholder="Contact number"
            value={formData.contact.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
          />
        </div>

        {/* Google Maps URL */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="url"
            placeholder="Google Maps location URL"
            value={formData.contact.googleMapURL}
            onChange={(e) => handleInputChange('googleMapURL', e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
          />
        </div>

        {/* Headquarters */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="w-5 h-5 text-gray-400" />
          </div>
          <textarea
            placeholder="Club headquarters address"
            value={formData.contact.headquarters}
            onChange={(e) => handleInputChange('headquarters', e.target.value)}
            rows={3}
            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
