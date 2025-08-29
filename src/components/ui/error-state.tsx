import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function ErrorState({ title = "Ocurrió un error", description, action, className }: ErrorStateProps) {
  return (
    <div className={cn("text-center py-16", className)}>
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
}
