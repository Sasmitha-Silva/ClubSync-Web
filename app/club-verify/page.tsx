'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { 
  CheckCircle, 
  Upload, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  HelpCircle,
  FileText,
  Users,
  Calendar,
  Shield,
  Building2,
  User,
  FileImage,
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';

// Interface for form values
interface ClubVerificationFormValues {
  // Club Details
  clubName: string;
  clubType: string;
  description: string;
  affiliation: string;
  clubCategory: string; // new field

  // Primary Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactPosition: string;
  contactIdProof: File | null;

  // Documentation Upload
  clubConstitution: File | null;
  approvalLetter: File | null;
  meetingMinutes: File | null;
  clubLogo: File | null;

  // Planned Activities
  upcomingEvent1: string;
  upcomingEvent2: string;
  expectedMembers: number;
  focusAreas: string[];

  // Agreements
  isOfficialRepresentative: boolean;
  documentsVerified: boolean;
  agreeToTerms: boolean;
}

// Focus areas options
const focusAreas = [
  { id: 'social', label: 'Social' },
  { id: 'tech', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'academic', label: 'Academic' },
  { id: 'environmental', label: 'Environmental' },
  { id: 'community', label: 'Community Service' },
];

// --- ENUMS (should match your Prisma enums) ---
const clubTypes = [
  { value: 'academic', label: 'Academic' },
  { value: 'sports', label: 'Sports' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'professional', label: 'Professional' },
  { value: 'hobby', label: 'Hobby' },
  { value: 'other', label: 'Other' },
];

const clubCategories = [
  { value: 'communityBased', label: 'Community-Based' },
  { value: 'instituteBased', label: 'Institute-Based' },
];

// Form steps configuration
const formSteps = [
  {
    id: 1,
    title: 'Club Details',
    icon: <Building2 className="w-5 h-5" />,
    description: 'Basic information about your club'
  },
  {
    id: 2,
    title: 'Club Profile',
    icon: <FileText className="w-5 h-5" />,
    description: 'Description and mission'
  },
  {
    id: 3,
    title: 'Organization Info',
    icon: <User className="w-5 h-5" />,
    description: 'Affiliation and contact details'
  },
  {
    id: 4,
    title: 'Document Uploads',
    icon: <CheckSquare className="w-5 h-5" />,
    description: 'Upload required documents'
  },
  {
    id: 5,
    title: 'Agreements',
    icon: <CheckSquare className="w-5 h-5" />,
    description: 'Confirm and agree to terms'
  }
];

// Tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center cursor-help"
      >
        {children}
        <HelpCircle className="w-4 h-4 ml-1 text-gray-400 hover:text-orange-500 transition-colors" />
      </div>
      {isVisible && (
        <div className="absolute z-10 w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-full ml-2">
          {content}
          <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// Progress stepper component
const ProgressStepper = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Step {currentStep} of {totalSteps}
        </h2>
        <div className="text-sm text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-3">
        {formSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              index + 1 < currentStep
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : index + 1 === currentStep
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {index + 1 < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                step.icon
              )}
            </div>
            <span className={`text-xs mt-1 text-center max-w-16 ${
              index + 1 === currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface FileUploadProps {
  name: string;
  label: string;
  accept: string;
  setFieldValue: (field: string, value: any) => void;
  tooltip?: string;
  required?: boolean;
  errors: any;
  touched: any;
  currentStep: number;
  values: any;
}

const FileUpload = ({
  name, label, accept, setFieldValue, tooltip, required, errors, touched, currentStep, values
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFieldValue(name, url);
    } catch (e) {
      alert('Upload failed. Please try again.');
    }
    setUploading(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        setFieldValue(name, url);
      } catch (e) {
        alert('Upload failed. Please try again.');
      }
      setUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
        {tooltip ? (
          <Tooltip content={tooltip}>
            <span>{label} {required && <span className="text-red-500">*</span>}</span>
          </Tooltip>
        ) : (
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
        )}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          uploading ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-300 hover:bg-gray-50'
        }`}
        onDragOver={e => { e.preventDefault(); }}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 mb-4 ${uploading ? 'text-orange-500' : 'text-gray-400'}`} />
          <label
            htmlFor={name}
            className="relative cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md font-medium px-4 py-2 hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
          >
            Choose a file
            <input
              id={name}
              name={name}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          <p className="mt-2 text-gray-500 font-medium">or drag and drop</p>
          {uploading && <span className="text-xs text-orange-500 ml-2">Uploading...</span>}
          <p className="text-xs text-gray-500 mt-2">
            {values && typeof values[name] === 'string' && values[name]
              ? 'File uploaded!'
              : 'No file uploaded yet.'}
          </p>
          {errors[name] && touched[name] && (
            <div className="mt-1 text-sm text-red-500">{errors[name]}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Validation schema
const onlyNumbersRegex = /^\d+$/;
const onlySpecialCharsRegex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/;
const notOnlyNumbersOrSpecialChars = (msg: string) =>
  Yup.string().test('not-only-numbers-or-special', msg, value => {
    if (!value) return true; // Let required validation handle empty values
    const onlyNumbers = /^\d+$/;
    const onlySpecial = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/;
    return !onlyNumbers.test(value) && !onlySpecial.test(value);
  });

const ClubVerificationSchema = Yup.object().shape({
  // Club Details
  clubName: notOnlyNumbersOrSpecialChars('Club name cannot be only numbers or special characters').required('Club name is required'),
  clubType: Yup.string().oneOf(clubTypes.map(t => t.value)).required('Club type is required'),
  clubTypeOther: Yup.string().test(
    'clubTypeOther-required',
    'Please specify a valid club type',
    function (value) {
      const { clubType } = this.parent;
      if (clubType === 'other') {
        if (!value) return this.createError({ message: 'Please specify your club type' });
        const onlyNumbers = /^\d+$/;
        const onlySpecial = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/;
        return !onlyNumbers.test(value) && !onlySpecial.test(value);
      }
      return true;
    }
  ),
  description: notOnlyNumbersOrSpecialChars('Description cannot be only numbers or special characters')
    .max(300, 'Description must be 300 characters or less')
    .required('Description is required'),
  affiliation: notOnlyNumbersOrSpecialChars('Affiliation cannot be only numbers or special characters').required('University/Organization is required'),
  clubCategory: Yup.string().oneOf(['community', 'institute'], 'Select a club category').required('Club category is required'),

  // Primary Contact
  contactName: notOnlyNumbersOrSpecialChars('Contact name cannot be only numbers or special characters').required('Contact name is required'),
  contactEmail: Yup.string()
    .email('Invalid email address')
    .required('Contact email is required'),
  contactPhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Contact phone is required'),
  contactPosition: notOnlyNumbersOrSpecialChars('Position cannot be only numbers or special characters').required('Position is required'),
  
  // Documentation
  approvalLetter: Yup.mixed().required('Approval letter is required'),
  
  // Planned Activities
  upcomingEvent1: notOnlyNumbersOrSpecialChars('Event name/description cannot be only numbers or special characters').required('At least one upcoming event is required'),
  expectedMembers: Yup.number()
    .min(1, 'Must have at least one member')
    .required('Expected member count is required'),
  focusAreas: Yup.array()
    .min(1, 'Select at least one focus area')
    .required('Focus areas are required'),

  // Agreements
  isOfficialRepresentative: Yup.boolean().oneOf([true], 'You must confirm you are an official representative'),
  documentsVerified: Yup.boolean().oneOf([true], 'You must confirm your documents are verified'),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

const ClubRequestSchema = Yup.object().shape({
  clubName: notOnlyNumbersOrSpecialChars('Club name cannot be only numbers or special characters').required('Club name is required'),
  motto: notOnlyNumbersOrSpecialChars('Motto cannot be only numbers or special characters').required('Motto is required'),
  clubType: Yup.string().oneOf(clubTypes.map(t => t.value)).required('Club type is required'),
  clubTypeOther: notOnlyNumbersOrSpecialChars('Please specify a valid club type').when('clubType', {
    is: 'other',
    then: schema => schema.required('Please specify your club type'),
    otherwise: schema => schema.notRequired(),
  }),
  clubCategory: Yup.string().oneOf(clubCategories.map(c => c.value)).required('Club category is required'),
  founded: Yup.number()
    .typeError('Year must be a number')
    .integer('Year must be an integer')
    .min(1800, 'Year must be after 1800')
    .max(new Date().getFullYear(), `Year cannot be in the future`)
    .required('Year of establishment is required'),
  description: notOnlyNumbersOrSpecialChars('Description cannot be only numbers or special characters')
    .test('max-words', 'Description must be 100 words or less', value => {
      if (!value) return true;
      return value.trim().split(/\s+/).filter(Boolean).length <= 100;
    })
    .required('Description is required'),
  mission: notOnlyNumbersOrSpecialChars('Mission cannot be only numbers or special characters').required('Mission is required'),
  university: notOnlyNumbersOrSpecialChars('University cannot be only numbers or special characters').required('University/Institute is required'),
  headquarters: notOnlyNumbersOrSpecialChars('Headquarters cannot be only numbers or special characters').required('Headquarters is required'),
  designation: notOnlyNumbersOrSpecialChars('Designation cannot be only numbers or special characters').required('Designation is required'),
  idProofDocument: Yup.mixed().required('ID Proof Document is required'),
  constitutionDoc: Yup.mixed().required('Club Constitution is required'),
  approvalLetter: Yup.mixed().required('Official Approval Letter is required'),
  clubLogo: Yup.mixed().required('Club Logo is required'),
  isOfficialRepresentative: Yup.boolean().oneOf([true], 'You must confirm you are an official representative').required('Required'),
  documentsVerified: Yup.boolean().oneOf([true], 'You must confirm your documents are verified').required('Required'),
});

const initialValues = {
  clubName: '',
  motto: '',
  clubType: '',
  clubTypeOther: '',
  clubCategory: '',
  founded: '',
  description: '',
  mission: '',
  university: '',
  headquarters: '',
  designation: '',
  idProofDocument: null,
  constitutionDoc: null,
  approvalLetter: null,
  clubLogo: null,
  isOfficialRepresentative: false,
  documentsVerified: false,
};

const stepFields: { [key: number]: string[] } = {
  1: ['clubName', 'clubType', 'clubTypeOther', 'clubCategory', 'founded'],
  2: ['motto', 'description', 'mission'],
  3: ['university', 'headquarters', 'designation'],
  4: ['idProofDocument', 'constitutionDoc', 'approvalLetter', 'clubLogo'],
  5: ['isOfficialRepresentative', 'documentsVerified'],
};

export default function ClubRequestForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const wordCount = (text: string) => text ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  const renderStepContent = (values: any, errors: any, touched: any, setFieldValue: any) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start min-h-[250px]">
            <div>
              <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-2">
                Club Name <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="clubName"
                id="clubName"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.clubName && touched.clubName ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="e.g., Robotics Club"
              />
              {errors.clubName && touched.clubName && (
                <div className="mt-1 text-sm text-red-500">{errors.clubName}</div>
              )}
            </div>
            <div>
              <label htmlFor="clubType" className="block text-sm font-medium text-gray-700 mb-2">
                <Tooltip content="Select the type that best describes your club.">
                  Club Type <span className="text-red-500">*</span>
                </Tooltip>
              </label>
              <Field
                as="select"
                name="clubType"
                id="clubType"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.clubType && touched.clubType ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                }`}
              >
                <option value="">Select Club Type</option>
                {clubTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Field>
              {errors.clubType && touched.clubType && (
                <div className="mt-1 text-sm text-red-500">{errors.clubType}</div>
              )}
            </div>
            {values.clubType === 'other' && (
              <div>
                <label htmlFor="clubTypeOther" className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify club type <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="clubTypeOther"
                  id="clubTypeOther"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.clubTypeOther && touched.clubTypeOther ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                  }`}
                  placeholder="e.g., Debate, Astronomy, etc."
                />
                {errors.clubTypeOther && touched.clubTypeOther && (
                  <div className="mt-1 text-sm text-red-500">{errors.clubTypeOther}</div>
                )}
              </div>
            )}
            <div>
              <label htmlFor="clubCategory" className="block text-sm font-medium text-gray-700 mb-2">
                <Tooltip content="Is your club community-based or institute-based?">
                  Club Category <span className="text-red-500">*</span>
                </Tooltip>
              </label>
              <Field
                as="select"
                name="clubCategory"
                id="clubCategory"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.clubCategory && touched.clubCategory ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                }`}
              >
                <option value="">Select Club Category</option>
                {clubCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </Field>
              {errors.clubCategory && touched.clubCategory && (
                <div className="mt-1 text-sm text-red-500">{errors.clubCategory}</div>
              )}
            </div>
            <div>
              <label htmlFor="founded" className="block text-sm font-medium text-gray-700 mb-2">
                <Tooltip content="Year of establishment">
                  Founded <span className="text-red-500">*</span>
                </Tooltip>
              </label>
              <Field
                type="number"
                name="founded"
                id="founded"
                min={1800}
                max={new Date().getFullYear()}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.founded && touched.founded ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="e.g., 2020"
              />
              {errors.founded && touched.founded && (
                <div className="mt-1 text-sm text-red-500">{errors.founded}</div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start min-h-[250px]">
            <div className="md:col-span-2">
              <label htmlFor="motto" className="block text-sm font-medium text-gray-700 mb-2">
                <Tooltip content="A short phrase that captures your club's spirit or values.">
                  Motto <span className="text-red-500">*</span>
                </Tooltip>
              </label>
              <Field
                type="text"
                name="motto"
                id="motto"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.motto && touched.motto ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="e.g., Innovate and Inspire"
              />
              {errors.motto && touched.motto && (
                <div className="mt-1 text-sm text-red-500">{errors.motto}</div>
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                <Tooltip content="Describe your club in 100 words or less.">
                  Description <span className="text-red-500">*</span>
                </Tooltip>
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                  errors.description && touched.description ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="Describe your club's vision, activities, and goals..."
                maxLength={1000}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {100 - wordCount(values.description)} words left
                </span>
                {errors.description && touched.description && (
                  <span className="text-xs text-red-500">{errors.description}</span>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="mission" className="block text-sm font-medium text-gray-700 mb-2">
                <Tooltip content="What is your club's mission or main purpose?">
                  Mission <span className="text-red-500">*</span>
                </Tooltip>
              </label>
              <Field
                as="textarea"
                name="mission"
                id="mission"
                rows={2}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                  errors.mission && touched.mission ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="What is your club's mission?"
              />
              {errors.mission && touched.mission && (
                <div className="mt-1 text-sm text-red-500">{errors.mission}</div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start min-h-[250px]">
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                University/Institute <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="university"
                id="university"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.university && touched.university ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="e.g., University of California, Santa Cruz"
              />
              {errors.university && touched.university && (
                <div className="mt-1 text-sm text-red-500">{errors.university}</div>
              )}
            </div>
            <div>
              <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700 mb-2">
                <Tooltip content="Where is your club based? (e.g., Student Center, Room 101)">
                  Headquarters <span className="text-red-500">*</span>
                </Tooltip>
              </label>
              <Field
                type="text"
                name="headquarters"
                id="headquarters"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.headquarters && touched.headquarters ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="e.g., Student Center, Room 101"
              />
              {errors.headquarters && touched.headquarters && (
                <div className="mt-1 text-sm text-red-500">{errors.headquarters}</div>
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                <Tooltip content="Your position in the club (e.g., President, Secretary)">
                  Your Designation <span className="text-red-500">*</span>
                </Tooltip>
              </label>
              <Field
                type="text"
                name="designation"
                id="designation"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.designation && touched.designation ? 'border-red-500' : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="e.g., President, Secretary"
              />
              {errors.designation && touched.designation && (
                <div className="mt-1 text-sm text-red-500">{errors.designation}</div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start min-h-[250px]">
            <div className="md:col-span-2 mb-2">
              <span className="text-sm text-orange-700 font-semibold">
                All documents below are <span className="text-red-500">*</span> required. Please upload each file to proceed.
              </span>
            </div>
            <FileUpload
              name="idProofDocument"
              label="ID Proof Document"
              accept=".pdf,.jpg,.jpeg,.png"
              setFieldValue={setFieldValue}
              tooltip="Upload a valid government or university ID (required)."
              required={true}
              errors={errors}
              touched={touched}
              currentStep={currentStep}
              values={values}
            />
            <FileUpload
              name="constitutionDoc"
              label="Club Constitution"
              accept=".pdf,.docx"
              setFieldValue={setFieldValue}
              tooltip="Upload your club's constitution or bylaws document (required)."
              required={true}
              errors={errors}
              touched={touched}
              currentStep={currentStep}
              values={values}
            />
            <FileUpload
              name="approvalLetter"
              label="Official Approval Letter"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              setFieldValue={setFieldValue}
              tooltip="Upload the official approval letter from your university or organization (required)."
              required={true}
              errors={errors}
              touched={touched}
              currentStep={currentStep}
              values={values}
            />
            <FileUpload
              name="clubLogo"
              label="Club Logo"
              accept=".jpg,.jpeg,.png,.svg"
              setFieldValue={setFieldValue}
              tooltip="Upload your club's logo or emblem (required)."
              required={true}
              errors={errors}
              touched={touched}
              currentStep={currentStep}
              values={values}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 min-h-[120px]">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="isOfficialRepresentative"
                id="isOfficialRepresentative"
                checked={values.isOfficialRepresentative}
                onChange={e => setFieldValue('isOfficialRepresentative', e.target.checked)}
                className="h-5 w-5 accent-orange-500 rounded border-gray-300 focus:ring-orange-500 transition-all duration-200"
              />
              <div className="ml-3 text-sm">
                <label htmlFor="isOfficialRepresentative" className="text-gray-700 cursor-pointer hover:text-orange-600 transition-colors">
                  I confirm that I am an official representative of this club <span className="text-red-500">*</span>
                </label>
                {errors.isOfficialRepresentative && touched.isOfficialRepresentative && (
                  <div className="mt-1 text-sm text-red-500">{errors.isOfficialRepresentative}</div>
                )}
              </div>
            </div>
            <div className="flex items-start">
              <input
                type="checkbox"
                name="documentsVerified"
                id="documentsVerified"
                checked={values.documentsVerified}
                onChange={e => setFieldValue('documentsVerified', e.target.checked)}
                className="h-5 w-5 accent-orange-500 rounded border-gray-300 focus:ring-orange-500 transition-all duration-200"
              />
              <div className="ml-3 text-sm">
                <label htmlFor="documentsVerified" className="text-gray-700 cursor-pointer hover:text-orange-600 transition-colors">
                  All documents are verified by the university/organization <span className="text-red-500">*</span>
                </label>
                {errors.documentsVerified && touched.documentsVerified && (
                  <div className="mt-1 text-sm text-red-500">{errors.documentsVerified}</div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Creative colored bubbles */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-orange-100 rounded-full filter blur-2xl opacity-40" />
        <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30" />
        <div className="absolute top-1/3 right-[-40px] w-40 h-40 bg-orange-200 rounded-full filter blur-xl opacity-30" />
        <div className="absolute bottom-1/4 left-[-40px] w-32 h-32 bg-purple-200 rounded-full filter blur-xl opacity-20" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4 group">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
              Create New Club
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Complete this form to register and verify your club on ClubSync
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={ClubRequestSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              // If clubType is 'other', use clubTypeOther
              const dataToSend = {
                ...values,
                clubType: values.clubType === 'other' ? values.clubType : values.clubType,
              };
              console.log('DEBUG: Formik values on submit:', dataToSend);
              try {
                const res = await fetch('/api/club-verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(dataToSend),
                  credentials: 'include', // Ensure cookies/session are sent
                });
                if (!res.ok) throw new Error('Failed to submit club verification');
                alert('Club verification submitted!');
                resetForm();
              } catch (e) {
                alert('Submission failed. Please try again.');
              }
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting, setFieldValue, values, validateForm, setTouched }) => {
              // Helper to validate only current step fields
              const validateCurrentStep = async () => {
                const fields = stepFields[currentStep] || [];
                // Mark all fields in this step as touched
                await setTouched(
                  fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}),
                  true
                );
                // Validate the form
                const formErrors = await validateForm();
                // Only allow next if none of the current step fields have errors
                return fields.every((field) => !(formErrors as Record<string, any>)[field]);
              };
              return (
                <Form className="space-y-8">
                  <ProgressStepper currentStep={currentStep} totalSteps={formSteps.length} />
                  <div className="min-h-[400px]">
                    {renderStepContent(values, errors, touched, setFieldValue)}
                  </div>
                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                      disabled={currentStep === 1}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        currentStep === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {currentStep < formSteps.length ? (
                      <button
                        type="button"
                        onClick={async () => {
                          const valid = await validateCurrentStep();
                          if (valid) setCurrentStep(s => s + 1);
                        }}
                        className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit for Verification</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
