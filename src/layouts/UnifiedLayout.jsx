import React, { useState, useEffect } from 'react';
import {
    Bell,
    Search,
    Moon,
    Sun,
    User,
    Menu,
    X,
    ChevronDown,
    Settings,
    LogOut,
    Hexagon,
    Sparkles,
    Brain,
    BookOpen,
    Users,
    Heart,
    MessageCircle,
    Home,
    GraduationCap,
    UserCheck,
    BarChart3,
    Calendar,
    Award,
    BookMarked,
    PlusCircle,
    Star,
    Upload,
    Search as SearchIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UnifiedLayout = ({ children }) => {
    const { user, logout } = useAuth();
    
    // Gestion du thème local
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
    };

    // Applique le thème au document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);
    
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: "Nouveau document ajouté",
            time: "Il y a 2 minutes",
            read: false,
            type: "document"
        },
        {
            id: 2,
            message: "Votre demande a été approuvée",
            time: "Il y a 1 heure",
            read: false,
            type: "approval"
        },
        {
            id: 3,
            message: "Rappel: Retour de livre prévu",
            time: "Il y a 3 heures",
            read: true,
            type: "reminder"
        }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [animateHexagon, setAnimateHexagon] = useState(false);

    // Animation périodique pour l'hexagone du logo
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimateHexagon(true);
            setTimeout(() => setAnimateHexagon(false), 1000);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Recherche:', searchQuery);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadNotificationsCount = notifications.filter(n => !n.read).length;

    // Configuration des menus selon le rôle
    const getMenuItems = () => {
        const baseItems = [
            { icon: Home, label: 'Accueil', path: '/' },
        ];

        switch (user?.role) {
            case 'ADMIN':
                return [
                    ...baseItems,
                    //categories spécifiques à l'admin
                    { icon: BookMarked, label: 'Catégories', path: '/admin/categories' },
                    { icon: BookOpen, label: 'Documents', path: '/admin/documents' },
                    { icon: PlusCircle, label: 'Ajouter Document', path: '/admin/documents/add' },
                    { icon: Users, label: 'Étudiants', path: '/admin/etudiants' },
                    { icon: BarChart3, label: 'Statistiques', path: '/admin/stats' },
                    { icon: Calendar, label: 'Emprunts', path: '/admin/emprunts' },
                    { icon: Calendar, label: 'livre', path: '/admin/livres' },
                ];
            case 'ETUDIANT':
                return [
                    ...baseItems,
                    { icon: Search, label: 'Rechercher', path: '/etudiant/search' },
                    { icon: Heart, label: 'Mes Favoris', path: '/etudiant/favorites' },
                    { icon: MessageCircle, label: 'Mes Commentaires', path: '/etudiant/comments' },
                    { icon: BookMarked, label: 'Mes Emprunts', path: '/etudiant/emprunts' },
                    { icon: Star, label: 'Mes Évaluations', path: '/etudiant/evaluations' },
                ];
            case 'ENSIGNANT':
                return [
                    ...baseItems,
                    { icon: GraduationCap, label: 'Mes Cours', path: '/enseignant/cours' },
                    { icon: Users, label: 'Mes Étudiants', path: '/enseignant/etudiants' },
                    { icon: BookOpen, label: 'Ressources', path: '/enseignant/ressources' },
                    { icon: Upload, label: 'Publier', path: '/enseignant/publier' },
                    { icon: Award, label: 'Évaluations', path: '/enseignant/evaluations' },
                    { icon: Calendar, label: 'Planning', path: '/enseignant/planning' },
                ];
            default:
                return baseItems;
        }
    };

    const menuItems = getMenuItems();

    return (
        <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-0
                ${isSidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
                w-64
            `}>
                <div className={`
                    flex flex-col h-full
                    ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                    border-r shadow-xl
                `}>
                    {/* Logo */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Hexagon 
                                    className={`w-8 h-8 text-teal-500 transition-transform duration-1000 ${
                                        animateHexagon ? 'rotate-180 scale-110' : ''
                                    }`} 
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-teal-300" />
                                </div>
                            </div>
                            {!isSidebarCollapsed && (
                                <div className="flex flex-col">
                                    <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        BiblioConnect
                                    </span>
                                    <span className="text-xs text-teal-500 flex items-center gap-1">
                                        <Brain className="w-3 h-3" />
                                        IA
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className={`hidden lg:block p-2 rounded-lg transition-colors ${
                                isDarkMode 
                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            {menuItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.path}
                                    className={`
                                        flex items-center px-3 py-2 rounded-lg transition-colors
                                        ${isDarkMode 
                                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                        ${isSidebarCollapsed ? 'justify-center' : ''}
                                    `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {!isSidebarCollapsed && (
                                        <span className="ml-3">{item.label}</span>
                                    )}
                                </a>
                            ))}
                        </div>
                    </nav>

                    {/* User Info */}
                    {!isSidebarCollapsed && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                        {user?.nom?.[0] || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {user?.nom || 'Utilisateur'}
                                    </p>
                                    <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {user?.role || 'Rôle'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <nav className={`
                    ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                    border-b px-4 py-3 flex items-center justify-between shadow-sm
                `}>
                    <div className="flex items-center space-x-4">
                        {/* Mobile sidebar toggle */}
                        <button
                            onClick={toggleMobileSidebar}
                            className={`lg:hidden p-2 rounded-lg transition-colors ${
                                isDarkMode 
                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {/* Logo pour mobile uniquement */}
                        <div className="lg:hidden flex items-center space-x-2">
                            <div className="relative">
                                <Hexagon className="w-6 h-6 text-teal-500" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="w-3 h-3 text-teal-300" />
                                </div>
                            </div>
                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                BiblioConnect
                            </span>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="flex-1 max-w-md mx-4">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`block w-full pl-10 pr-3 py-2 border rounded-xl text-sm transition-all focus:ring-2 focus:ring-opacity-50 ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500'
                                }`}
                            />
                        </form>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center space-x-4">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-colors ${
                                isDarkMode 
                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={toggleNotifications}
                                className={`p-2 rounded-lg transition-colors relative ${
                                    isDarkMode 
                                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadNotificationsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unreadNotificationsCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications dropdown */}
                            {showNotifications && (
                                <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 ${
                                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                } border`}>
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                Notifications
                                            </h3>
                                            {unreadNotificationsCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-teal-500 hover:text-teal-600 text-sm"
                                                >
                                                    Tout marquer comme lu
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map(notification => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                                        !notification.read ? 'bg-teal-50 dark:bg-teal-900/20' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                                                        <div className="flex-1">
                                                            <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                {notification.message}
                                                            </p>
                                                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <Bell className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Aucune notification
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={toggleProfileMenu}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user?.nom?.[0] || 'U'}
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>

                            {/* Profile dropdown */}
                            {showProfileMenu && (
                                <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50 ${
                                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                } border`}>
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold">
                                                    {user?.nom?.[0] || 'U'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {user?.nom || 'Utilisateur'}
                                                </p>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {user?.email || 'utilisateur@biblioconnect.sn'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-2">
                                        <a
                                            href="/profile"
                                            className={`flex items-center px-4 py-2 text-sm transition-colors ${
                                                isDarkMode 
                                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            <User className="w-4 h-4 mr-3" />
                                            Mon profil
                                        </a>
                                        <a
                                            href="/settings"
                                            className={`flex items-center px-4 py-2 text-sm transition-colors ${
                                                isDarkMode 
                                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            <Settings className="w-4 h-4 mr-3" />
                                            Paramètres
                                        </a>
                                        <button
                                            onClick={logout}
                                            className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                                                isDarkMode 
                                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Déconnexion
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}
        </div>
    );
};

export default UnifiedLayout;