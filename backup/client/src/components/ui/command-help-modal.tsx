import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CommandHelp } from "@/types";

interface CommandHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandHelp[];
}

export function CommandHelpModal({ isOpen, onClose, commands }: CommandHelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Available Commands</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {commands.map((cmd, index) => (
              <div 
                key={index} 
                className={`pb-2 ${index < commands.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
              >
                <code className="font-mono text-sm text-primary-dark dark:text-primary-light">
                  {cmd.command}
                </code>
                <p className="text-sm mt-1">{cmd.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Type any command in the terminal or use the provided interface controls
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
