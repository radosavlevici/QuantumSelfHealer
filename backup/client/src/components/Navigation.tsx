import { Link } from "wouter";

interface NavigationProps {
  currentPath: string;
}

export default function Navigation({ currentPath }: NavigationProps) {
  const isActive = (path: string) => currentPath === path;

  // Helper function to create navigation item style
  const getNavItemClass = (path: string) => 
    `flex flex-col items-center justify-center flex-1 h-full ${
      isActive(path) ? "text-primary dark:text-primary-light" : "text-gray-500 dark:text-gray-400"
    }`;

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-around h-16">
        {/* Use Link directly without nested <a> tags */}
        <Link href="/" className={getNavItemClass("/")}>
          <span className="material-icons">home</span>
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link href="/terminal" className={getNavItemClass("/terminal")}>
          <span className="material-icons">code</span>
          <span className="text-xs mt-1">Terminal</span>
        </Link>
        
        <Link href="/assistant" className={getNavItemClass("/assistant")}>
          <span className="material-icons">psychology</span>
          <span className="text-xs mt-1">Assistant</span>
        </Link>
        
        <Link href="/settings" className={getNavItemClass("/settings")}>
          <span className="material-icons">settings</span>
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
}
