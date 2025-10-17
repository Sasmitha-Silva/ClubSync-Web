"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BeautifulLoader from "../../components/Loader";
import {
  Calendar,
  Search,
  Filter,
  MapPin,
  ChevronRight,
  Sparkles,
  Clock,
  Users,
  Zap,
  Heart,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events");

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const eventsData = await response.json();
        setEvents(eventsData);
        setFilteredEvents(eventsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter((event) => event.category === filterCategory);
    }

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [events, searchTerm, filterCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get unique categories for filter
  const categories = Array.from(
    new Set(events.map((event) => event.category).filter(Boolean)),
  );

  if (loading) {
    return (
      <BeautifulLoader
        message="Discovering Amazing Events"
        subMessage="Loading experiences that inspire..."
        type="morphing"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Oops! Something went wrong
              </h3>
              <p className="text-red-600 text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-8 py-3 rounded-full hover:from-orange-500 hover:to-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/20 rounded-full animate-bounce delay-500"></div>
          <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-white/20 rounded-full animate-bounce delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 animate-pulse">
                <CalendarDays className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold">
                Discover Amazing
                <span className="block bg-gradient-to-r from-orange-200 to-red-200 bg-clip-text text-transparent">
                  Events
                </span>
              </h1>
            </div>

            <p className="text-2xl md:text-3xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join incredible experiences, meet like-minded people, and
              <span className="font-semibold"> create lasting memories</span>
            </p>

            <div className="flex flex-wrap justify-center gap-12 mb-16">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-8 py-4">
                <CalendarDays className="h-8 w-8 mr-3 text-orange-200" />
                <span className="font-semibold text-lg">50+ Events</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-8 py-4">
                <Users className="h-8 w-8 mr-3 text-orange-200" />
                <span className="font-semibold text-lg">1000+ Attendees</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-8 py-4">
                <Sparkles className="h-8 w-8 mr-3 text-orange-200" />
                <span className="font-semibold text-lg">
                  Multiple Categories
                </span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center text-white/80">
              <span className="text-sm mb-2 font-medium">
                Scroll to explore
              </span>
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Search and Filter Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Enhanced Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events by title, description, location, or organizer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 text-base placeholder-gray-500 bg-white/90 backdrop-blur-sm hover:border-gray-300"
                />
              </div>

              {/* Category Filter */}
              <div className="relative lg:w-48">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full appearance-none bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl px-4 py-4 pr-10 focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 text-base font-medium hover:border-gray-300"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Enhanced Results Summary */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2">
                  <Zap className="h-5 w-5 mr-2 text-orange-600" />
                  <span className="font-bold text-orange-700 text-lg">
                    {filteredEvents.length}
                  </span>
                  <span className="ml-1 text-orange-600 font-medium">
                    event{filteredEvents.length !== 1 ? "s" : ""} found
                  </span>
                </div>
                {(searchTerm || filterCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterCategory("");
                    }}
                    className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200 underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {filteredEvents.length > 0 && (
                <div className="flex items-center text-gray-400">
                  <span className="text-sm mr-2">
                    Click any event to view details
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {searchTerm || filterCategory
                  ? "No events found"
                  : "No events available"}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm || filterCategory
                  ? "Try adjusting your search"
                  : "Check back soon for new events!"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentEvents.map((event, index) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group block"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50 hover:border-orange-300 h-full group-hover:bg-white">
                    {/* Compact Cover Image */}
                    <div className="relative h-36 overflow-hidden">
                      {event.coverImage ? (
                        <Image
                          src={event.coverImage}
                          alt={`${event.title} cover`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                          <Calendar className="h-14 w-14 text-white/60" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Price Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {event.isPaid && (
                          <span className="px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm bg-yellow-500/95 text-white">
                            ${event.price}
                          </span>
                        )}
                        {!event.isPaid && (
                          <span className="px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm bg-green-500/95 text-white">
                            Free
                          </span>
                        )}
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                          <ArrowRight className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>
                    </div>

                    {/* Compact Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 leading-tight flex-1 pr-2">
                          {event.title}
                        </h3>
                        <ChevronRight className="h-5 w-5 text-orange-500 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                      </div>{" "}
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                          <span>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-orange-500" />
                          <span>{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                      {/* Category Badge */}
                      {event.category && (
                        <div className="mb-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-xs rounded-full font-medium border border-orange-200/50">
                            {event.category}
                          </span>
                        </div>
                      )}
                      {/* Compact Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-600 font-medium">
                          <Users className="h-4 w-4 mr-1.5 text-orange-500" />
                          <span>
                            {event.registeredCount || 0}
                            {event.maxCapacity && `/${event.maxCapacity}`}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                          {event.organizer.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-orange-400 to-red-400 text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredEvents.length)} of{" "}
              {filteredEvents.length} events
            </div>
          </>
        )}
      </div>
    </div>
  );
}
