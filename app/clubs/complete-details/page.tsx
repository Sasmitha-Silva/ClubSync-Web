"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Upload, Link, Phone, Tags, Check, ArrowLeft, ArrowRight } from "lucide-react";
import type { ClubFormData } from "./types";
import ImageUploadStep from "./components/ImageUploadStep";
import SocialMediaStep from "./components/SocialMediaStep";
import ContactDetailsStep from "./components/ContactDetailsStep";
import ClubDetailsStep from "./components/ClubDetailsStep";
import PreviewStep from "./components/PreviewStep";

import type { FormData } from "./types";

const initialFormData: ClubFormData = {
  coverImage: "",
  profileImage: "",
  socialMedia: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedIn: "",
    website: "",
  },
  contact: {
    email: "",
    phone: "",
    googleMapURL: "",
    headquarters: "",
  },
  details: {
    values: [],
    avenues: [],
    about: "",
  },
};

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export default function CompleteClubDetails() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClubFormData>(initialFormData);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(current => current + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(current => current - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/clubs/complete-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit club details");
      }

      // Handle success (e.g., redirect or show success message)
    } catch (error) {
      // Handle error
      console.error("Error submitting club details:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ImageUploadStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <SocialMediaStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <ContactDetailsStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return (
          <ClubDetailsStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 5:
        return (
          <PreviewStep
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 pt-20">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-100/50 via-pink-50/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-red-100/40 via-orange-50/30 to-transparent rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-orange-50/20 to-red-50/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Club Profile</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's make your club profile more informative and engaging. Fill in the details below.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-gray-200 text-gray-500"
                  } transition-all duration-300 transform ${
                    step === currentStep ? "scale-110" : ""
                  }`}
                >
                  {step}
                </div>
                <span className={`mt-2 text-sm ${
                  step <= currentStep ? "text-gray-800" : "text-gray-400"
                }`}>
                  {step === 1 && "Images"}
                  {step === 2 && "Social"}
                  {step === 3 && "Contact"}
                  {step === 4 && "Details"}
                  {step === 5 && "Preview"}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-100 rounded-full mt-4">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500 ease-in-out shadow-lg"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Form content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden max-w-4xl mx-auto">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-orange-500/10 to-transparent rounded-br-3xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-red-500/10 to-transparent rounded-tl-3xl" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
              className="relative z-10"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-12 relative z-10">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-200"
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Previous Step
            </button>
            
            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                className="flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 shadow-lg"
              >
                <Check className="w-5 h-5 mr-3" />
                Complete Setup
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 shadow-lg"
              >
                Next Step
                <ArrowRight className="w-5 h-5 ml-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
