import { Tent, Bus, Home, CircleDot } from "lucide-react";

interface AvailabilityDisplayProps {
  motorhomeAvailability?: number | null;
  caravanAvailability?: number | null;
  vwBusAvailability?: number | null;
  largeTentAvailability?: number | null;
  smallTentAvailability?: number | null;
  compact?: boolean;
}

const categoryIcons = {
  motorhome: { icon: Home, label: "Motorhome" },
  caravan: { icon: Home, label: "Caravan" },
  vwBus: { icon: Bus, label: "VW Bus" },
  largeTent: { icon: Tent, label: "Large Tent" },
  smallTent: { icon: CircleDot, label: "Small Tent" },
};

export function AvailabilityDisplay({
  motorhomeAvailability,
  caravanAvailability,
  vwBusAvailability,
  largeTentAvailability,
  smallTentAvailability,
  compact = false,
}: AvailabilityDisplayProps) {
  const categories = [
    { key: "motorhome", value: motorhomeAvailability, ...categoryIcons.motorhome },
    { key: "caravan", value: caravanAvailability, ...categoryIcons.caravan },
    { key: "vwBus", value: vwBusAvailability, ...categoryIcons.vwBus },
    { key: "largeTent", value: largeTentAvailability, ...categoryIcons.largeTent },
    { key: "smallTent", value: smallTentAvailability, ...categoryIcons.smallTent },
  ].filter(cat => cat.value != null);

  if (categories.length === 0) {
    return (
      <div className="text-sm text-muted-foreground" data-testid="availability-unknown">
        No availability data
      </div>
    );
  }

  const getColorClass = (val: number) => {
    if (val >= 70) return "bg-green-600";
    if (val >= 30) return "bg-yellow-600";
    return "bg-red-600";
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2" data-testid="availability-display-compact">
        {categories.map(({ key, value, icon: Icon }) => (
          <div key={key} className="flex items-center gap-1" data-testid={`availability-${key}`}>
            <Icon className="h-3 w-3 text-muted-foreground" />
            <div className="relative h-1.5 w-12 rounded-full bg-muted">
              <div 
                className={`absolute h-full rounded-full ${getColorClass(value!)}`}
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-xs font-medium">{value}%</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="availability-display-full">
      {categories.map(({ key, value, icon: Icon, label }) => (
        <div key={key} className="space-y-1" data-testid={`availability-${key}`}>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
            </span>
            <span className="font-semibold">{value}%</span>
          </div>
          <div className="relative h-2 w-full rounded-full bg-muted">
            <div 
              className={`absolute h-full rounded-full transition-all ${getColorClass(value!)}`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
