
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'ocean' | 'gold' | 'emerald' | 'rose';
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  color = 'ocean' 
}: StatsCardProps) => {
  const colorVariants = {
    ocean: {
      accent: 'text-blue-400',
      bg: 'bg-blue-950/20'
    },
    gold: {
      accent: 'text-amber-400',
      bg: 'bg-amber-950/20'
    },
    emerald: {
      accent: 'text-emerald-400',
      bg: 'bg-emerald-950/20'
    },
    rose: {
      accent: 'text-rose-400',
      bg: 'bg-rose-950/20'
    }
  };

  const variant = colorVariants[color];

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:scale-105 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-400">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-white">
                {value}
              </p>
              {trend && (
                <span className={`text-xs font-medium ${
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-400">
                {description}
              </p>
            )}
          </div>
          <div className={`${variant.bg} p-3 rounded-xl`}>
            <Icon className={`w-6 h-6 ${variant.accent}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
