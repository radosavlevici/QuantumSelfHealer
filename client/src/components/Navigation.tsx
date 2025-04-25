import { Link } from "wouter";

interface NavigationProps {
  currentPath: string;
}

export default function Navigation({ currentPath }: NavigationProps) {
  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-around h-16">
        <Link href="/">
          <a className={`flex flex-col items-center justify-center flex-1 h-full ${isActive("/") ? "text-primary dark:text-primary-light" : "text-gray-500 dark:text-gray-400"}`}>
            <span className="material-icons">home</span>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/terminal">
          <a className={`flex flex-col items-center justify-center flex-1 h-full ${isActive("/terminal") ? "text-primary dark:text-primary-light" : "text-gray-500 dark:text-gray-400"}`}>
            <span className="material-icons">code</span>
            <span className="text-xs mt-1">Terminal</span>
          </a>
        </Link>
        
        <Link href="/assistant">
          <a className={`flex flex-col items-center justify-center flex-1 h-full ${isActive("/assistant") ? "text-primary dark:text-primary-light" : "text-gray-500 dark:text-gray-400"}`}>
            <span className="material-icons">psychology</span>
            <span className="text-xs mt-1">Assistant</span>
          </a>
        </Link>
        
        <Link href="/settings">
          <a className={`flex flex-col items-center justify-center flex-1 h-full ${isActive("/settings") ? "text-primary dark:text-primary-light" : "text-gray-500 dark:text-gray-400"}`}>
            <span className="material-icons">settings</span>
            <span className="text-xs mt-1">Settings</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
