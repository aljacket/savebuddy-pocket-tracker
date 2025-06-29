import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, PieChart, Wallet, Trophy } from 'lucide-react';

const NavBar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/add', icon: Plus, label: 'Aggiungi' },
    { path: '/goals', icon: Wallet, label: 'Obiettivi' },
    { path: '/achievements', icon: Trophy, label: 'Achievement' },
    { path: '/stats', icon: PieChart, label: 'Statistiche' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-progress bg-progress-light' 
                  : 'text-gray-500 hover:text-progress'
              }`}
            >
              <IconComponent size={18} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;
