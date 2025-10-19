"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  Award,
  Calendar,
  Edit3,
  Badge,
  IdCard,
  Clock,
  CheckCircle,
  X,
  Star,
  Camera,
  Briefcase,
  BookOpen,
  Shield,
  Target,
} from "lucide-react";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";


export default function VolunteerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  
  const [user, setUser] = useState({
    name: "Loading...", // This will be fetched from database
    email: "Loading...", // This will be fetched from database
    universityId: "2022IS066",
    mobile: "Loading...", // This will be fetched from database
    role: "Volunteer",
    profilePicture: null as string | null,
    rewardPoints: 320,
    level: "Silver",
    joinedDate: null as string | null,
    totalEvents: 15,
    completedEvents: 12,
    upcomingEvents: 3,
    certificates: [],
    eventHistory: [],
    serviceLetters: []
  });

  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    universityId: user.universityId,
  });

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (response.ok) {
            const userData = await response.json();
            const fullName = `${userData.firstName} ${userData.lastName}`;
            // prefer camelCase createdAt, fallback to snake_case created_at
            const createdAt = userData.createdAt ?? userData.created_at ?? null;
            setUser(prevUser => ({
              ...prevUser,
              name: fullName,
              email: userData.email,
              mobile: userData.phone,
              joinedDate: createdAt,
              // prefer image from DB, fallback to session image if available
              profilePicture: userData.image ?? session?.user?.image ?? null,
            }));
            setEditData(prevEditData => ({
              ...prevEditData,
              name: fullName,
              email: userData.email,
              mobile: userData.phone
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(prevUser => ({
            ...prevUser,
            name: "Error loading name",
            email: "Error loading email",
            mobile: "Error loading mobile"
          }));
        }
      }
    };

    fetchUserData();
  }, [session?.user?.id]);

  // File input ref behavior: we'll use a hidden input to pick files
  const fileInputId = "profile-image-input";
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    try {
      setIsUploading(true);
      // Upload to Cloudinary
      const uploadedUrl = await uploadToCloudinary(file as File);

      // Persist to DB
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadedUrl }),
      });

      if (!res.ok) throw new Error("Failed to save profile image");

      // Update local state
      setUser((prev) => ({ ...prev, profilePicture: uploadedUrl }));
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setIsUploading(false);
      // reset input value so same file can be selected again if needed
      const input = document.getElementById(fileInputId) as HTMLInputElement | null;
      if (input) input.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error("No user session found");
      return;
    }

    try {
      // Update user data in database
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: editData.name.split(' ')[0] || editData.name,
          lastName: editData.name.split(' ').slice(1).join(' ') || '',
          email: editData.email,
          phone: editData.mobile,
        }),
      });

      if (response.ok) {
        // Update local state with edited values
        setUser(prevUser => ({
          ...prevUser,
          name: editData.name,
          email: editData.email,
          mobile: editData.mobile,
          universityId: editData.universityId,
        }));
        setIsEditing(false);
        
        // Show success message (optional)
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
        // Handle error - maybe show an error message to user
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error - maybe show an error message to user
    }
  };

  const handleCancel = () => {
    // Reset editData to current user values
    setEditData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      universityId: user.universityId,
    });
    setIsEditing(false);
  };

  // Tabs removed per request.

  // Status color helper removed (no longer needed after removing status-driven UIs)

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Bronze": return { icon: <Shield className="w-4 h-4 text-orange-600" />, text: "Bronze Member" };
      case "Silver": return { icon: <Star className="w-4 h-4 text-orange-600" />, text: "Silver Member" };
      case "Gold": return { icon: <Award className="w-4 h-4 text-orange-600" />, text: "Gold Member" };
      default: return { icon: <Badge className="w-4 h-4 text-orange-600" />, text: "Member" };
    }
  };

  const getPointsNeededForGold = () => {
    const goldThreshold = 500; // Assuming 500 points needed for Gold level
    const pointsNeeded = goldThreshold - user.rewardPoints;
    return pointsNeeded > 0 ? pointsNeeded : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="w-full px-4 py-6">
        {/* Professional Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-100 border-3 border-orange-300 shadow-lg flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => document.getElementById(fileInputId)?.click()}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
                    title={isUploading ? "Uploading..." : "Change profile image"}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  {/* Hidden file input */}
                  <input id={fileInputId} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                
                {/* Level Badge */}
                <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full text-sm text-orange-700">
                  {getLevelBadge(user.level).icon}
                  <span className="font-medium">{getLevelBadge(user.level).text}</span>
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {user.role}
                    </span>
                    {/* department removed from UI per request */}
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <IdCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Student ID</p>
                      <p className="text-sm font-medium text-gray-900">{user.universityId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Mobile</p>
                      <p className="text-sm font-medium text-gray-900">{user.mobile}</p>
                    </div>
                  </div>
                </div>

                {/* Reward Points and Quick Stats */}
                <div className="flex flex-wrap items-center gap-6">
                  {/* Reward Points - Only Colored Section */}
                  <div className="inline-flex items-center gap-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Reward Points</p>
                        <p className="text-2xl font-bold">{user.rewardPoints}</p>
                      </div>
                    </div>
                    <div className="h-12 w-px bg-white/20"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Points to Gold</p>
                        <p className="text-lg font-semibold">{getPointsNeededForGold() === 0 ? "Achieved!" : getPointsNeededForGold()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">{user.completedEvents} Completed</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{user.certificates.length} Certificates</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">{user.upcomingEvents} Upcoming</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs removed */}

        {/* Content Sections */}
        {/* Edit Profile Popup Modal */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-orange-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Profile Information</h2>
                  <button
                    onClick={handleCancel}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={editData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University ID</label>
                    <input
                      type="text"
                      name="universityId"
                      value={editData.universityId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-8">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab content removed per request */}
      </div>
    </div>
  );
}
