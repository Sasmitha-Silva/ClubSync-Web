"use client";

import { Upload } from "lucide-react";
import { ClubFormData } from "../types";
import Image from "next/image";

interface Props {
  formData: ClubFormData;
  setFormData: (data: ClubFormData) => void;
}

export default function ImageUploadStep({ formData, setFormData }: Props) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'profile') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [type === 'cover' ? 'coverImage' : 'profileImage']: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Upload Club Images (Optional)</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          You can personalize your club's profile with custom images. Don't have them ready? No worries - you can always add them later.
        </p>
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Cover Image (Optional)</label>
          {formData.coverImage && (
            <button
              onClick={() => setFormData({ ...formData, coverImage: "" })}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          )}
        </div>
        <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
          {formData.coverImage ? (
            <Image
              src={formData.coverImage}
              alt="Cover Preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-300 transition-colors duration-300">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">Click to upload cover image</p>
                <p className="text-xs text-gray-400">(Optional)</p>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'cover')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Profile Image Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Profile Image (Optional)</label>
          {formData.profileImage && (
            <button
              onClick={() => setFormData({ ...formData, profileImage: "" })}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          )}
        </div>
        <div className="relative h-32 w-32 mx-auto bg-gray-100 rounded-full overflow-hidden">
          {formData.profileImage ? (
            <Image
              src={formData.profileImage}
              alt="Profile Preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-full hover:border-orange-300 transition-colors duration-300">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-[10px] text-gray-400 mt-1">(Optional)</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'profile')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <p className="text-center text-sm text-gray-500">Click to upload profile image</p>
      </div>

      {/* Skip Message */}
      <div className="text-center mt-8 pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Don't have images ready?{" "}
          <span className="text-orange-500">
            No problem! You can add them later from your club settings.
          </span>
        </p>
      </div>
    </div>
  );
}
