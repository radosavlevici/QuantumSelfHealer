import { StatusCard as StatusCardType } from "@/types";

interface StatusCardProps {
  card: StatusCardType;
}

export function StatusCard({ card }: StatusCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
      <div className="flex items-center mb-1">
        <span className="material-icons text-sm text-primary-light mr-1">{card.icon}</span>
        <span className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">{card.title}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">{card.value}</span>
        <span className={`px-2 py-0.5 text-xs rounded-full ${card.status === "optimal" || card.status === "secure" ? "bg-success bg-opacity-10 text-success" : "bg-warning bg-opacity-10 text-warning"}`}>
          {card.status}
        </span>
      </div>
    </div>
  );
}
