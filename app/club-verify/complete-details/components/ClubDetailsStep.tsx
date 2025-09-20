"use client";

import { Tags, Type } from "lucide-react";
import { ClubFormData } from "../types";

interface Props {
  formData: ClubFormData;
  setFormData: (data: ClubFormData) => void;
}

export default function ClubDetailsStep({ formData, setFormData }: Props) {
  const handleValuesChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value) {
      event.preventDefault();
      const newValue = event.currentTarget.value.trim();
      if (newValue && !formData.details.values.includes(newValue)) {
        setFormData({
          ...formData,
          details: {
            ...formData.details,
            values: [...formData.details.values, newValue],
          },
        });
        event.currentTarget.value = '';
      }
    }
  };

  const handleAvenuesChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value) {
      event.preventDefault();
      const newAvenue = event.currentTarget.value.trim();
      if (newAvenue && !formData.details.avenues.includes(newAvenue)) {
        setFormData({
          ...formData,
          details: {
            ...formData.details,
            avenues: [...formData.details.avenues, newAvenue],
          },
        });
        event.currentTarget.value = '';
      }
    }
  };

  const handleAboutChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        about: event.target.value,
      },
    });
  };

  const handleMissionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        mission: event.target.value,
      },
    });
  };

  const removeValue = (value: string) => {
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        values: formData.details.values.filter(v => v !== value),
      },
    });
  };

  const removeAvenue = (avenue: string) => {
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        avenues: formData.details.avenues.filter(a => a !== avenue),
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Club Details</h2>
        <p className="text-gray-600">Tell us more about your club</p>
      </div>

      <div className="space-y-6">
        {/* Values */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Club Values</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tags className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Type a value and press Enter"
              onKeyDown={handleValuesChange}
              className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.details.values.map((value, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center"
              >
                {value}
                <button
                  onClick={() => removeValue(value)}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Avenues */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Club Avenues</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tags className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Type an avenue and press Enter"
              onKeyDown={handleAvenuesChange}
              className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.details.avenues.map((avenue, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center"
              >
                {avenue}
                <button
                  onClick={() => removeAvenue(avenue)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">About the Club</label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <Type className="w-5 h-5 text-gray-400" />
            </div>
            <textarea
              placeholder="Tell us about your club's history and overview..."
              value={formData.details.about}
              onChange={handleAboutChange}
              rows={4}
              className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
            />
          </div>
        </div>

        {/* Mission */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Club Mission</label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <Type className="w-5 h-5 text-gray-400" />
            </div>
            <textarea
              placeholder="Describe your club's mission, vision, and goals..."
              value={formData.details.mission || ""}
              onChange={handleMissionChange}
              rows={4}
              className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
