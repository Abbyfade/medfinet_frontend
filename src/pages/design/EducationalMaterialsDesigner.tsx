import { useState, useEffect } from 'react';
import { 
  Book, 
  Palette, 
  Download, 
  Share, 
  Edit, 
  Search, 
  Filter,
  Loader2,
  FileText,
  Image,
  Layout,
  Type,
  Copy,
  Trash2,
  Plus,
  CheckCircle
} from 'lucide-react';
import canvaApi from '../../services/canvaApi';

interface DesignTemplate {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  description: string;
}

interface UserDesign {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: string;
  lastModified: string;
  category: string;
}

const EducationalMaterialsDesigner = () => {
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [userDesigns, setUserDesigns] = useState<UserDesign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  const [isCreatingDesign, setIsCreatingDesign] = useState<boolean>(false);
  const [isCanvaSDKLoaded, setIsCanvaSDKLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Load Canva SDK
    const loadCanvaSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://sdk.canva.com/designbutton/v2/api.js';
      script.async = true;
      script.onload = () => {
        setIsCanvaSDKLoaded(true);
      };
      document.body.appendChild(script);
    };

    loadCanvaSDK();

    // Load templates
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would call the actual API
        // For now, we'll use mock data
        const mockTemplates = [
          {
            id: 'template_003',
            name: 'Vaccine Information Sheet',
            thumbnail: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
            category: 'educational',
            description: 'Educational material about vaccines',
          },
          {
            id: 'template_005',
            name: 'Immunization Schedule',
            thumbnail: 'https://images.pexels.com/photos/4386465/pexels-photo-4386465.jpeg?auto=compress&cs=tinysrgb&w=300',
            category: 'educational',
            description: 'Visual immunization schedule for parents',
          },
          {
            id: 'template_006',
            name: 'Health Infographic',
            thumbnail: 'https://images.pexels.com/photos/4386468/pexels-photo-4386468.jpeg?auto=compress&cs=tinysrgb&w=300',
            category: 'infographics',
            description: 'Customizable health infographic template',
          },
          {
            id: 'template_007',
            name: 'Vaccine Safety Brochure',
            thumbnail: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
            category: 'educational',
            description: 'Informational brochure about vaccine safety',
          },
          {
            id: 'template_008',
            name: 'Child Development Milestones',
            thumbnail: 'https://images.pexels.com/photos/4386462/pexels-photo-4386462.jpeg?auto=compress&cs=tinysrgb&w=300',
            category: 'educational',
            description: 'Guide to child development milestones',
          },
          {
            id: 'template_009',
            name: 'Nutrition Guide for Children',
            thumbnail: 'https://images.pexels.com/photos/5452291/pexels-photo-5452291.jpeg?auto=compress&cs=tinysrgb&w=300',
            category: 'educational',
            description: 'Nutritional guidance for children of different ages',
          }
        ];
        
        setTemplates(mockTemplates);

        // Mock user designs
        setUserDesigns([
          {
            id: 'design_003',
            name: 'Vaccine Information for Parents',
            thumbnail: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
            createdAt: '2024-06-05T14:20:00Z',
            lastModified: '2024-06-05T16:15:00Z',
            category: 'educational'
          }
        ]);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter templates based on category and search term
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter user designs based on search term
  const filteredDesigns = userDesigns.filter(design => {
    return design.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateDesign = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    setIsCreatingDesign(true);
    
    // In a real implementation, we would use the Canva SDK to create a design
    // For now, we'll simulate the process
    setTimeout(() => {
      setIsCreatingDesign(false);
      
      // Add the new design to user designs
      const newDesign: UserDesign = {
        id: `design_${Date.now()}`,
        name: `New ${template.name}`,
        thumbnail: template.thumbnail,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        category: template.category
      };
      
      setUserDesigns(prev => [newDesign, ...prev]);
      
      // Show success message
      alert('Design created successfully!');
    }, 2000);
  };

  const handleEditDesign = (design: UserDesign) => {
    // In a real implementation, we would use the Canva SDK to open the design editor
    // For now, we'll just open a new window
    window.open('https://www.canva.com/design', '_blank');
  };

  const handleDeleteDesign = (designId: string) => {
    if (confirm('Are you sure you want to delete this design?')) {
      setUserDesigns(prev => prev.filter(design => design.id !== designId));
    }
  };

  const handleExportDesign = (design: UserDesign, format: 'pdf' | 'png' | 'jpg') => {
    // In a real implementation, we would call the Canva API to export the design
    // For now, we'll just show a message
    alert(`Exporting design as ${format.toUpperCase()}...`);
  };

  const handleDuplicateDesign = (design: UserDesign) => {
    const duplicatedDesign: UserDesign = {
      ...design,
      id: `design_${Date.now()}`,
      name: `${design.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    setUserDesigns(prev => [duplicatedDesign, ...prev]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Educational Materials Designer
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Create and customize educational materials for parents and patients
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search templates and designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
              />
            </div>
            
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="educational">Educational Materials</option>
                <option value="infographics">Infographics</option>
                <option value="brochures">Brochures</option>
                <option value="posters">Posters</option>
              </select>
            </div>
          </div>
        </div>

        {/* My Designs Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">My Educational Materials</h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 text-primary-600 dark:text-primary-400 animate-spin" />
              <span className="ml-2 text-neutral-600 dark:text-neutral-300">Loading your designs...</span>
            </div>
          ) : (
            <>
              {filteredDesigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDesigns.map(design => (
                    <div 
                      key={design.id} 
                      className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="h-40 overflow-hidden relative group">
                        <img 
                          src={design.thumbnail} 
                          alt={design.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditDesign(design)}
                              className="p-2 bg-white rounded-full hover:bg-primary-100 transition-colors"
                              title="Edit design"
                            >
                              <Edit className="h-5 w-5 text-primary-600" />
                            </button>
                            <button
                              onClick={() => handleExportDesign(design, 'pdf')}
                              className="p-2 bg-white rounded-full hover:bg-primary-100 transition-colors"
                              title="Export as PDF"
                            >
                              <Download className="h-5 w-5 text-primary-600" />
                            </button>
                            <button
                              onClick={() => handleDuplicateDesign(design)}
                              className="p-2 bg-white rounded-full hover:bg-primary-100 transition-colors"
                              title="Duplicate design"
                            >
                              <Copy className="h-5 w-5 text-primary-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteDesign(design.id)}
                              className="p-2 bg-white rounded-full hover:bg-error-100 transition-colors"
                              title="Delete design"
                            >
                              <Trash2 className="h-5 w-5 text-error-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            {design.name}
                          </h3>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {new Date(design.lastModified).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 capitalize">
                            {design.category.replace('-', ' ')}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditDesign(design)}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                              title="Edit design"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleExportDesign(design, 'pdf')}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                              title="Export as PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
                  <Book className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    No educational materials found
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                    {searchTerm ? "Try adjusting your search" : "You haven't created any educational materials yet"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Templates Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Educational Templates</h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 text-primary-600 dark:text-primary-400 animate-spin" />
              <span className="ml-2 text-neutral-600 dark:text-neutral-300">Loading templates...</span>
            </div>
          ) : (
            <>
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map(template => (
                    <div 
                      key={template.id} 
                      className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={template.thumbnail} 
                          alt={template.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            {template.name}
                          </h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 capitalize">
                            {template.category.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                          {template.description}
                        </p>
                        <button
                          onClick={() => handleCreateDesign(template)}
                          disabled={isCreatingDesign || !isCanvaSDKLoaded}
                          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                        >
                          {isCreatingDesign && selectedTemplate?.id === template.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Palette className="h-4 w-4 mr-2" />
                              Use Template
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
                  <Palette className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    No templates found
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                    {searchTerm ? "Try adjusting your search or filters" : "No templates available for this category"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Educational Material Types */}
        <div className="mt-12 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
            Types of Educational Materials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full mb-3">
                <Book className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Vaccine Information</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Create informational materials about different vaccines, their benefits, and potential side effects.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-secondary-100 dark:bg-secondary-900/20 p-3 rounded-full mb-3">
                <Layout className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Health Infographics</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Design visual infographics to explain complex health topics in an easy-to-understand format.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-accent-100 dark:bg-accent-900/20 p-3 rounded-full mb-3">
                <Type className="h-6 w-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Instructional Guides</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Create step-by-step guides for parents on topics like child development, nutrition, and healthcare.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-3" />
              <div>
                <h3 className="font-medium text-primary-800 dark:text-primary-300 mb-1">
                  Why Create Educational Materials?
                </h3>
                <p className="text-sm text-primary-700 dark:text-primary-400">
                  Educational materials help parents and patients better understand healthcare topics, leading to improved health outcomes. Customized materials can address specific concerns and be tailored to different literacy levels and languages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalMaterialsDesigner;