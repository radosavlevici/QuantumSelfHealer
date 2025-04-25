import { ActivityLog as ActivityLogType } from "@/types";
import { Button } from "@/components/ui/button";

interface ActivityLogProps {
  logs: ActivityLogType[];
  onClear: () => void;
}

const getTypeColor = (type: ActivityLogType["type"]): string => {
  switch (type) {
    case "primary": return "border-primary-light";
    case "info": return "border-info";
    case "success": return "border-success";
    case "warning": return "border-warning";
    case "error": return "border-error";
    default: return "border-gray-400";
  }
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // If less than a day, show time
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return "Yesterday";
  }
};

export function ActivityLog({ logs, onClear }: ActivityLogProps) {
  return (
    <section className="mt-6 px-4 pb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Activity Log</h2>
        <Button 
          variant="ghost" 
          className="text-primary dark:text-primary-light text-sm px-1 h-8"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No activity logs to display
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className={`${getTypeColor(log.type)} border-l-2 pl-3 ${logs.indexOf(log) !== logs.length - 1 ? 'pb-4' : ''}`}>
                <div className="flex items-center mb-1">
                  <span className="font-medium">{log.title}</span>
                  <span className="ml-auto text-xs text-gray-500">{formatTime(log.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {log.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
