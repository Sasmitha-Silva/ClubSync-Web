"use client";

import { ClubFormData } from "../types";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Linkedin, Globe, Mail, Phone, MapPin } from "lucide-react";

interface Props {
  formData: ClubFormData;
}

export default function PreviewStep({ formData }: Props) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Preview Club Profile</h2>
        <p className="text-gray-600">Review your club's information before submission</p>
      </div>

      {/* Images Preview */}
      <div className="relative">
        <div className="h-48 w-full relative rounded-xl overflow-hidden">
          {formData.coverImage ? (
            <Image
              src={formData.coverImage}
              alt="Club Cover"
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No cover image</span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-8 left-8">
          <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden relative bg-white">
            {formData.profileImage ? (
              <Image
                src={formData.profileImage}
                alt="Club Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No profile</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Social Media Links</h3>
          <div className="space-y-3">
            {formData.socialMedia.facebook && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Facebook className="w-5 h-5" />
                <a href={formData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
                  Facebook
                </a>
              </div>
            )}
            {formData.socialMedia.instagram && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Instagram className="w-5 h-5" />
                <a href={formData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
                  Instagram
                </a>
              </div>
            )}
            {formData.socialMedia.twitter && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Twitter className="w-5 h-5" />
                <a href={formData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
                  Twitter
                </a>
              </div>
            )}
            {formData.socialMedia.linkedIn && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Linkedin className="w-5 h-5" />
                <a href={formData.socialMedia.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
                  LinkedIn
                </a>
              </div>
            )}
            {formData.socialMedia.website && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Globe className="w-5 h-5" />
                <a href={formData.socialMedia.website} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
                  Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Contact Information</h3>
          <div className="space-y-3">
            {formData.contact.email && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-5 h-5" />
                <a href={`mailto:${formData.contact.email}`} className="hover:text-orange-500">
                  {formData.contact.email}
                </a>
              </div>
            )}
            {formData.contact.phone && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-5 h-5" />
                <a href={`tel:${formData.contact.phone}`} className="hover:text-orange-500">
                  {formData.contact.phone}
                </a>
              </div>
            )}
            {formData.contact.headquarters && (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{formData.contact.headquarters}</span>
              </div>
            )}
          </div>
        </div>

        {/* Club Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">About the Club</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{formData.details.about}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Club Values</h3>
            <div className="flex flex-wrap gap-2">
              {formData.details.values.map((value, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Club Avenues</h3>
            <div className="flex flex-wrap gap-2">
              {formData.details.avenues.map((avenue, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {avenue}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
