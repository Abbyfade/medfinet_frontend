import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  DollarSign, 
  Zap, 
  CheckCircle, 
  Star,
  ArrowRight,
  Building,
  Play,
  Menu,
  X,
  User,
  Stethoscope,
  Code,
  Mail,
  Phone,
  Globe,
  FileText,
  MapPin
} from 'lucide-react';
import WalletConnector from '../../components/wallet/WalletConnector';
import CookieConsent from '../../components/common/CookieConsent';
import ThemeToggle from '../../components/common/ThemeToggle';

const LandingPage = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger animations on mount
    setIsVisible(true);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWalletConnected = (walletInfo: { type: string; address: string }) => {
    console.log('Wallet connected:', walletInfo);
    setIsWalletModalOpen(false);
    // Handle wallet connection logic here
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ease-out ${
        scrollY > 50 
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg transform translate-y-0' 
          : 'bg-transparent transform translate-y-0'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className={`flex items-center transition-all duration-700 ease-out ${
              isVisible ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-10 opacity-0'
            }`}>
              <Shield className={`h-8 w-8 text-primary-600 dark:text-primary-400 mr-2 transition-all duration-500 ${
                isVisible ? 'transform rotate-0 scale-100' : 'transform rotate-180 scale-0'
              }`} />
              <span className="text-xl font-bold text-neutral-900 dark:text-white">MedFiNet</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center space-x-8 transition-all duration-700 ease-out ${
              isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-10 opacity-0'
            }`}>
              {['Features', 'How It Works', 'Testimonials', 'API'].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`} 
                  className={`text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:scale-105 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {item}
                </a>
              ))}
              <Link
                    to="/healthfinance"
                    onClick={() => setIsSignInModalOpen(false)}
                    className={`text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:scale-105 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${1 * 100}ms` }}
                  >
                    Health Finance
              </Link>
              <div className={`transition-all duration-500 ${
                isVisible ? 'transform scale-100 opacity-100' : 'transform scale-0 opacity-0'
              }`} style={{ transitionDelay: '300ms' }}>
                <ThemeToggle />
              </div>
              <button
                onClick={() => setIsSignInModalOpen(true)}
                className={`text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:scale-105 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                Sign In
              </button>
              {/* <button
                onClick={() => setIsWalletModalOpen(true)}
                className={`bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                Connect Wallet
              </button> */}
              <button
                  onClick={() => setIsSignInModalOpen(true)}
                  className={`bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
                >
                  Get Started
                </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-300 ${
                  isMobileMenuOpen ? 'transform rotate-180' : 'transform rotate-0'
                }`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden transition-all duration-500 ease-out overflow-hidden ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100 transform translate-y-0' 
              : 'max-h-0 opacity-0 transform -translate-y-4'
          }`}>
            <div className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 rounded-b-lg shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* {['Features', 'How It Works', 'Testimonials', 'API'].map((item, index) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className={`block px-3 py-2 text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 transform ${
                      isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {item}
                  </a>
                ))} */}
                {['Features', 'How It Works', 'Testimonials', 'API', 'Health Finance'].map((item, index) => {
                  // Handle the special case for Health Finance
                  if (item === 'Health Finance') {
                    return (
                      <Link
                        key={item}
                        to="/healthfinance"
                        onClick={() => {
                          setIsMobileMenuOpen(false); // Close mobile menu when navigating
                        }}
                        className={`block px-3 py-2 text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 transform ${
                          isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                        }`}
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        {item}
                      </Link>
                    );
                  }
                })}

                <button
                  onClick={() => setIsSignInModalOpen(true)}
                  className={`block w-full text-left px-3 py-2 text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 transform ${
                    isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: '150ms' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className={`w-full text-left px-3 py-2 bg-primary-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-800 dark:to-neutral-900"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-20 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 rotate-0' : 'transform translate-y-10 rotate-45'
          }`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute top-40 right-20 w-16 h-16 bg-secondary-200 dark:bg-secondary-800 rounded-full opacity-20 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 rotate-0' : 'transform -translate-y-10 -rotate-45'
          }`} style={{ animationDelay: '0.7s' }}></div>
          <div className={`absolute bottom-20 left-1/4 w-12 h-12 bg-accent-200 dark:bg-accent-800 rounded-full opacity-20 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 rotate-0' : 'transform translate-y-10 rotate-90'
          }`} style={{ animationDelay: '0.9s' }}></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ease-out ${
              isVisible ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-20 opacity-0'
            }`}>
              <div className={`inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium mb-6 transition-all duration-700 hover:scale-105 ${
                isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'
              }`} style={{ transitionDelay: '0.2s' }}>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                Blockchain-Powered Healthcare
              </div>
              
              <h1 className={`text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight transition-all duration-1000 ${
                isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
              }`} style={{ transitionDelay: '0.3s' }}>
                Protecting Your Child's
                <span className={`text-primary-600 dark:text-primary-400 block transition-all duration-1000 ${
                  isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-8 opacity-0'
                }`} style={{ transitionDelay: '0.5s' }}>Health Journey</span>
              </h1>
              
              <p className={`text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed transition-all duration-1000 ${
                isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
              }`} style={{ transitionDelay: '0.6s' }}>
                Secure, transparent, and accessible healthcare finance and immunization management. 
                Join thousands of families already protecting their children with blockchain-verified vaccination records.
              </p>
              
              <div className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-1000 ${
                isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
              }`} style={{ transitionDelay: '0.7s' }}>
                <button
                  onClick={() => setIsSignInModalOpen(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button className="border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-primary-600 dark:hover:border-primary-400 px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                </button>
              </div>
              
              <div className={`flex items-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400 transition-all duration-1000 ${
                isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
              }`} style={{ transitionDelay: '0.8s' }}>
                {['HIPAA Compliant', 'Blockchain Secured', 'FDA Approved'].map((item, index) => (
                  <div key={item} className={`flex items-center transition-all duration-500 hover:scale-105 ${
                    isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-4 opacity-0'
                  }`} style={{ transitionDelay: `${0.9 + index * 0.1}s` }}>
                    <CheckCircle className="h-4 w-4 text-success-500 mr-2 animate-pulse" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`relative transition-all duration-1000 ease-out ${
              isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-20 opacity-0'
            }`} style={{ transitionDelay: '0.4s' }}>
              <div className="relative group">
                <img
                  src="/vaccine.jpg"
                  alt="Healthcare professional administering vaccine to child"
                  className={`rounded-2xl shadow-2xl w-full transition-all duration-700 group-hover:scale-105 group-hover:shadow-3xl ${
                    isVisible ? 'transform scale-100 rotate-0' : 'transform scale-95 rotate-2'
                  }`}
                />
                
                {/* Floating notification card */}
                <div className={`absolute -bottom-6 -left-6 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 transition-all duration-1000 hover:scale-110 ${
                  isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
                }`} style={{ transitionDelay: '1s' }}>
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-success-500 rounded-full mr-3 animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">Vaccination Verified</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Verified on blockchain</p>
                    </div>
                  </div>
                </div>
                
                {/* Success rate badge */}
                <div className={`absolute -top-6 -right-6 bg-primary-600 text-white p-4 rounded-xl shadow-lg transition-all duration-1000 hover:scale-110 hover:rotate-3 ${
                  isVisible ? 'transform translate-y-0 opacity-100 rotate-0' : 'transform -translate-y-8 opacity-0 rotate-12'
                }`} style={{ transitionDelay: '1.2s' }}>
                  <div className="text-center">
                    <p className="text-2xl font-bold animate-bounce">98.5%</p>
                    <p className="text-xs opacity-90">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-neutral-50 dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Comprehensive Healthcare Management
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Everything you need to manage your family's healthcare journey in one secure, blockchain-powered platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Child Profile Management',
                description: 'Securely store and manage your children\'s health profiles with blockchain verification.',
                image: 'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=300',
                color: 'primary'
              },
              {
                icon: Users,
                title: 'Nurse-Verified Records',
                description: 'All vaccination records are verified by certified healthcare professionals.',
                image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
                color: 'secondary'
              },
              {
                icon: DollarSign,
                title: 'Healthcare Finance',
                description: 'Tokenize medical invoices and access innovative financing solutions.',
                image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=300',
                color: 'accent'
              },
              {
                icon: Zap,
                title: 'Pediatric Center Locator',
                description: 'Find nearby pediatric healthcare centers and vaccination clinics.',
                image: 'https://images.pexels.com/photos/7089626/pexels-photo-7089626.jpeg?auto=compress&cs=tinysrgb&w=300',
                color: 'success'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className={`bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 group cursor-pointer ${
                    isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 0.2}s` }}
                >
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-32 object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-${feature.color}-600 bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-500`}></div>
                  </div>
                  <div className={`bg-${feature.color}-100 dark:bg-${feature.color}-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                    <Icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              How MedFiNet Works
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Simple steps to secure your child's healthcare journey with blockchain technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Create Child Profile',
                  description: 'Register your child and create a secure digital health profile with blockchain verification.',
                },
                {
                  step: '02',
                  title: 'Nurse Documentation',
                  description: 'Healthcare professionals document vaccination records directly into the secure system.',
                },
                {
                  step: '03',
                  title: 'Blockchain Verification',
                  description: 'All records are verified and stored on the blockchain for permanent, tamper-proof documentation.',
                }
              ].map((step, index) => (
                <div key={index} className={`flex items-start space-x-4 transition-all duration-1000 hover:scale-105 ${
                  isVisible ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-8 opacity-0'
                }`} style={{ transitionDelay: `${index * 0.3}s` }}>
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold transition-all duration-500 hover:scale-125 hover:rotate-12 ${
                      isVisible ? 'transform scale-100 rotate-0' : 'transform scale-0 rotate-45'
                    }`} style={{ transitionDelay: `${index * 0.3 + 0.2}s` }}>
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300">{step.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`relative transition-all duration-1000 ${
              isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-8 opacity-0'
            }`} style={{ transitionDelay: '0.5s' }}>
              <video
                src="/polio.mp4"
                className="rounded-2xl shadow-2xl w-full animate-float hover:scale-105 transition-transform duration-700"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className={`absolute top-4 right-4 bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-lg transition-all duration-1000 hover:scale-110 ${
                isVisible ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-4 opacity-0'
              }`} style={{ transitionDelay: '1s' }}>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-success-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-neutral-50 dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Trusted by Families Worldwide
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              See what parents and healthcare professionals are saying about MedFiNet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Mother of two',
                content: 'MedFiNet has made tracking my children\'s vaccinations so much easier. The blockchain verification gives me complete confidence in the records.',
                rating: 5,
                avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
              },
              {
                name: 'Emily Rodriguez, RN',
                role: 'Pediatric Nurse',
                content: 'As a healthcare professional, I love how MedFiNet streamlines the vaccination process while maintaining the highest security standards.',
                rating: 5,
                avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150'
              },
              {
                name: 'Dr. Michael Chen',
                role: 'Pediatric Clinic Director',
                content: 'The integration with our clinic systems is seamless. Parents love having instant access to verified vaccination records.',
                rating: 5,
                avatar: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=150'
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1 group ${
                  isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 text-yellow-400 fill-current transition-all duration-300 hover:scale-125 ${
                      isVisible ? 'transform scale-100 rotate-0' : 'transform scale-0 rotate-180'
                    }`} style={{ transitionDelay: `${index * 0.2 + i * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6 italic group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-300">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className={`w-12 h-12 rounded-full object-cover mr-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                      isVisible ? 'transform scale-100 rotate-0' : 'transform scale-0 rotate-45'
                    }`}
                    style={{ transitionDelay: `${index * 0.2 + 0.3}s` }}
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="py-20">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Developer API Access
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Integrate MedFiNet's powerful healthcare and blockchain features directly into your applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
              isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '0.2s' }}>
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-125 transition-all duration-500">
                <Code className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Healthcare Data API</h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                Access standardized healthcare data using our FHIR-compliant API. Securely retrieve and manage patient records, immunization data, and more.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-200">HIPAA-compliant data access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-200">Comprehensive documentation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-200">Sandbox testing environment</span>
                </li>
              </ul>
              <a href="#" className="text-primary-600 dark:text-primary-400 font-medium flex items-center hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                View Documentation
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
            
            <div className={`bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
              isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '0.4s' }}>
              <div className="bg-secondary-100 dark:bg-secondary-900/30 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-125 transition-all duration-500">
                <Shield className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Blockchain Verification API</h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                Leverage our blockchain infrastructure to verify and tokenize healthcare records, ensuring data integrity and immutability.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-200">Tamper-proof verification</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-200">Record tokenization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-200">Smart contract integration</span>
                </li>
              </ul>
              <a href="#" className="text-secondary-600 dark:text-secondary-400 font-medium flex items-center hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors">
                Explore Blockchain API
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
            
            <div className={`bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
              isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '0.6s' }}>
              <div className="bg-accent-100 dark:bg-accent-900/30 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-125 transition-all duration-500">
                <FileText className="h-8 w-8 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Get API Access</h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                Ready to integrate with MedFiNet? Contact our developer team to get API credentials and start building powerful healthcare applications.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-neutral-500 mr-3" />
                  <a href="mailto:api@medfinet.com" className="text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    api@medfinet.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-neutral-500 mr-3" />
                  <span className="text-neutral-700 dark:text-neutral-200">
                    (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-neutral-500 mr-3" />
                  <a href="#" className="text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    developers.medfinet.com
                  </a>
                </div>
              </div>
              <button className="w-full bg-accent-600 hover:bg-accent-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                Request API Access
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 scale-100' : 'transform translate-y-10 scale-0'
          }`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute bottom-10 right-10 w-24 h-24 bg-white opacity-10 rounded-full transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 scale-100' : 'transform -translate-y-10 scale-0'
          }`} style={{ animationDelay: '0.7s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
          }`}>
            Ready to Secure Your Child's Health Journey?
          </h2>
          <p className={`text-xl text-primary-100 mb-8 max-w-2xl mx-auto transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
          }`} style={{ transitionDelay: '0.2s' }}>
            Join thousands of families already using MedFiNet to protect and manage their children's healthcare records.
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
          }`} style={{ transitionDelay: '0.4s' }}>
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
            >
              <span className="group-hover:animate-pulse">Get Started Free</span>
            </button>
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
            >
              <span className="group-hover:animate-pulse">Connect Wallet</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 dark:bg-neutral-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className={`transition-all duration-1000 ${
              isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-primary-400 mr-2 animate-pulse" />
                <span className="text-xl font-bold">MedFiNet</span>
              </div>
              <p className="text-neutral-400 mb-4">
                Secure, transparent healthcare finance and immunization management powered by blockchain technology.
              </p>
            </div>
            
            {[
              {
                title: 'Platform',
                links: ['Child Profiles', 'Vaccination Records', 'Healthcare Finance', 'Health Centers']
              },
              {
                title: 'Resources',
                links: ['Documentation', 'API Reference', 'Support', 'Community']
              },
              {
                title: 'Company',
                links: ['About Us', 'Privacy Policy', 'Terms of Service', 'Contact']
              }
            ].map((section, index) => (
              <div key={section.title} className={`transition-all duration-1000 ${
                isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
              }`} style={{ transitionDelay: `${(index + 1) * 0.2}s` }}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-neutral-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={link}>
                      <a href="#" className={`hover:text-white transition-all duration-300 hover:translate-x-1 ${
                        isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-4 opacity-0'
                      }`} style={{ transitionDelay: `${(index + 1) * 0.2 + linkIndex * 0.1}s` }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Contact Information */}
          <div className={`border-t border-neutral-800 mt-8 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-neutral-400 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
          }`} style={{ transitionDelay: '1s' }}>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-primary-400" />
              <a href="mailto:contact@medfinet.com" className="hover:text-white transition-colors">
                contact@medfinet.com
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-3 text-primary-400" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-primary-400" />
              <span>123 Health Avenue, New York, NY 10001</span>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2025 MedFiNet. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" onClick={() => setIsSignInModalOpen(false)}></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-auto z-10 animate-slide-up">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2 animate-pulse" />
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Choose Your Portal</h3>
                </div>
                <button
                  onClick={() => setIsSignInModalOpen(false)}
                  className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-300 hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-neutral-600 dark:text-neutral-300 mb-6 text-center">
                  Select the appropriate portal for your role
                </p>
                
                <div className="space-y-4">
                  {/* Parent Portal */}
                  <Link
                    to="/login"
                    onClick={() => setIsSignInModalOpen(false)}
                    className="w-full p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 text-left group hover:scale-105"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">Parent Portal</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Manage your children's health profiles and vaccination records
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                  </Link>

                  {/* Health Worker Portal */}
                  <Link
                    to="/health-worker/login"
                    onClick={() => setIsSignInModalOpen(false)}
                    className="w-full p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-600 hover:border-secondary-300 dark:hover:border-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-all duration-300 text-left group hover:scale-105"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center text-secondary-600 dark:text-secondary-400 mr-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                        <Stethoscope className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors duration-300">Health Worker Portal</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Issue vaccination records and manage patient data
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                  </Link>

                  {/* Hospital Portal */}
                  <Link
                    to="/admin/login"
                    onClick={() => setIsSignInModalOpen(false)}
                    className="w-full p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-600 hover:border-accent-300 dark:hover:border-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all duration-300 text-left group hover:scale-105"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-accent-600 dark:text-accent-400 mr-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                        <Building className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">Hospital Portal</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Login to your hospital or healthcare facility
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-accent-600 dark:group-hover:text-accent-400 group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                  </Link>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    Don't have an account?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      to="/register"
                      onClick={() => setIsSignInModalOpen(false)}
                      className="flex-1 text-center px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium text-sm border border-primary-200 dark:border-primary-800 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 hover:scale-105"
                    >
                      Register as Parent
                    </Link>
                    <Link
                      to="/hospital/register"
                      onClick={() => setIsSignInModalOpen(false)}
                      className="flex-1 text-center px-4 py-2 text-accent-600 dark:text-accent-400 hover:text-accent-800 dark:hover:text-accent-300 font-medium text-sm border border-accent-200 dark:border-accent-800 rounded-md hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all duration-300 hover:scale-105"
                    >
                      Register Hospital
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Connector Modal */}
      <WalletConnector
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onWalletConnected={handleWalletConnected}
      />

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

export default LandingPage;