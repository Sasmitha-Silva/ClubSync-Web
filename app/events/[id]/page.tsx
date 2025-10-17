"use client";
import { Calendar, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BeautifulLoader from "../../../components/Loader";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  venue?: string;
  coverImage?: string;
  category?: string;
  maxCapacity?: number;
  registeredCount?: number;
  isActive: boolean;
  isPaid: boolean;
  price?: number;
  organizer: {
    id: string;
    name: string;
    type: "club" | "organization";
  };
  createdAt: string;
  updatedAt: string;
}

// Reusable card list for committee/volunteers
function CardList({
  data,
  roleColor,
  roleLabel,
}: {
  data: Array<{ role?: string; name: string; photo?: string }>;
  roleColor: string;
  roleLabel?: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {data.map((person, i) => (
        <div
          key={i}
          className="relative flex flex-col items-center bg-orange-50 rounded-2xl p-5 shadow group hover:shadow-xl transition-all duration-200 border border-orange-100"
        >
          <div className="relative mb-3">
            <img
              src={
                person.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=FFEDD5&color=EA580C&size=128`
              }
              alt={person.name}
              className="w-20 h-20 rounded-full border-4 border-orange-200 object-cover shadow-lg group-hover:scale-105 transition-transform duration-200"
            />
            <span
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${roleColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow border-2 border-white group-hover:brightness-110 transition-colors`}
            >
              {person.role || roleLabel}
            </span>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-700 mb-1 group-hover:text-orange-900 transition-colors">
              {person.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const eventData = await response.json();
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  // Mock committee data (in real app, fetch from API)
  const committee = [
    {
      role: "President",
      name: "A. Kumar",
      photo: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      role: "Vice President",
      name: "B. Silva",
      photo: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      role: "Treasurer",
      name: "C. Lee",
      photo: "https://randomuser.me/api/portraits/men/33.jpg",
    },
    {
      role: "Secretary",
      name: "D. Perera",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  if (loading) {
    return <BeautifulLoader message="Loading Event Details" />;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!event) {
    return <div className="p-8 text-center text-red-500">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pb-20">
      {/* Hero Banner */}
      <div className="relative w-full h-72 sm:h-96 mb-12">
        <img
          src={
            event.coverImage ||
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
          }
          alt={event.title}
          className="w-full h-full object-cover object-center rounded-b-3xl shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 to-transparent rounded-b-3xl" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-2">
            {event.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-3 mb-2">
            {event.category && (
              <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                {event.category}
              </span>
            )}
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              {event.organizer.name}
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-orange-100 text-sm font-medium">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-5 h-5" />
              {new Date(event.date).toLocaleDateString()} {event.time}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-5 h-5" /> {event.registeredCount || 0}{" "}
              Registered
            </span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Club Committee & Event Photo */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow p-6 border border-orange-100">
            <h2 className="text-xl font-bold mb-6 text-orange-700 text-center">
              Club Committee
            </h2>
            <CardList
              data={committee}
              roleColor="bg-orange-500 group-hover:bg-orange-600"
            />
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border border-orange-100">
            <h2 className="text-xl font-bold mb-6 text-orange-700 text-center">
              Event Memories
            </h2>
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={
                    event.coverImage ||
                    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop"
                  }
                  alt="Event photo"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Event Info */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow p-6 border border-orange-100">
            <h2 className="text-2xl font-bold mb-2 text-orange-700">
              {event.title}
            </h2>
            <div className="text-gray-500 text-sm mb-2">
              Organized by{" "}
              <span className="font-semibold text-orange-700">
                {event.organizer.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {event.category && (
                <span className="inline-block bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-semibold text-xs">
                  {event.category}
                </span>
              )}
              {event.maxCapacity && (
                <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold text-xs">
                  Max {event.maxCapacity} Participants
                </span>
              )}
            </div>
            {event.location && (
              <div className="mb-2">
                <span className="font-semibold text-orange-700">Location:</span>{" "}
                <span className="text-gray-700">{event.location}</span>
              </div>
            )}
            {event.description && (
              <div className="mb-2">
                <span className="font-semibold text-orange-700">
                  Description:
                </span>{" "}
                <span className="text-gray-700">{event.description}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
