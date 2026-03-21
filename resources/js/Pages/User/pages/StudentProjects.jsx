import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Search, Star, Users, Calendar, Microscope, Trophy, Leaf, GraduationCap, Music, Handshake, FolderKanban } from 'lucide-react';

export default function StudentProjectsPage({ onNavigate, onViewDetails, projects = [], userRatingMap = {} }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);

  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1024) setCardsPerPage(6);
      else if (width >= 768) setCardsPerPage(4);
      else setCardsPerPage(1);
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  const categories = useMemo(() => {
    const values = new Set(projects.map((p) => (p.category || 'General').trim()));
    return ['all', ...Array.from(values)];
  }, [projects]);

  const statuses = useMemo(() => {
    const values = new Set(projects.map((p) => (p.status || 'Draft').trim()));
    return ['all', ...Array.from(values)];
  }, [projects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const projectCategory = (project.category || 'General').toLowerCase();
    const projectStatus = (project.status || 'Draft').toLowerCase();
    const matchesCategory = selectedCategory === 'all' || projectCategory === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || projectStatus === selectedStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, cardsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / cardsPerPage));
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

  const getCategoryVisual = (category) => {
    const key = (category || '').toLowerCase();
    if (key.includes('tech')) return { Icon: Microscope, color: 'from-sky-500 to-blue-700' };
    if (key.includes('sport')) return { Icon: Trophy, color: 'from-orange-500 to-red-600' };
    if (key.includes('env')) return { Icon: Leaf, color: 'from-emerald-500 to-green-700' };
    if (key.includes('educ')) return { Icon: GraduationCap, color: 'from-indigo-500 to-violet-700' };
    if (key.includes('cultur')) return { Icon: Music, color: 'from-fuchsia-500 to-pink-700' };
    if (key.includes('social')) return { Icon: Handshake, color: 'from-cyan-500 to-teal-700' };
    return { Icon: FolderKanban, color: 'from-slate-500 to-slate-700' };
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 text-2xl font-semibold mb-2">Projects</h1>
        <p className="text-gray-500">Explore and rate CSG projects</p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-200 px-3"
        >
          <option value="all">All Categories</option>
          {categories
            .filter((c) => c !== 'all')
            .map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-200 px-3"
        >
          <option value="all">All Status</option>
          {statuses
            .filter((s) => s !== 'all')
            .map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
        </select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {paginatedProjects.length} of {filteredProjects.length} filtered projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden rounded-[20px] border-0 shadow-sm hover:shadow-md transition-all">
            {/* Project Icon */}
            <div className={`h-32 bg-gradient-to-br ${getCategoryVisual(project.category).color} flex items-center justify-center`}>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {(() => {
                  const CategoryIcon = getCategoryVisual(project.category).Icon;
                  return <CategoryIcon className="w-9 h-9 text-white" />;
                })()}
              </div>
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-gray-900 font-semibold mb-1">{project.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700 text-xs">{project.category}</Badge>
                    <Badge className="bg-gray-100 text-gray-700 text-xs">{project.status || 'Draft'}</Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{project.ratingsCount || 0} raters</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">{project.endDate || 'N/A'}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(project.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{project.rating || 0}</span>
                  <span className="text-xs text-gray-400">({project.ratingsCount})</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => onViewDetails(project.id)}
                  className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Details
                </Button>
                <Button
                  onClick={() => onViewDetails(project.id)}
                  variant="outline"
                  className="rounded-xl"
                >
                  <Star className={`w-4 h-4 ${userRatingMap[project.id] ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProjects.length > cardsPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
