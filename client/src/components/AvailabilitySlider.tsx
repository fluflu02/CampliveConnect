import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tent, Bus, Home, CircleDot } from "lucide-react";

interface AvailabilitySliderProps {
  category: "motorhome" | "caravan" | "vwBus" | "largeTent" | "smallTent";
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const categoryConfig = {
  motorhome: {
    label: "Motorhome",
    icon: Home,
  },
  caravan: {
    label: "Caravan",
    icon: Home,
  },
  vwBus: {
    label: "VW Bus",
    icon: Bus,
  },
  largeTent: {
    label: "Large Tent",
    icon: Tent,
  },
  smallTent: {
    label: "Small Tent",
    icon: CircleDot,
  },
};

export function AvailabilitySlider({ category, value, onChange, readOnly = false }: AvailabilitySliderProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  
  const getColorClass = (val: number) => {
    if (val >= 70) return "text-green-600";
    if (val >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusText = (val: number) => {
    if (val >= 70) return "Available";
    if (val >= 30) return "Limited";
    return "Full";
  };

  return (
    <div className="space-y-2" data-testid={`availability-slider-${category}`}>
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4" />
          {config.label}
        </Label>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${getColorClass(value)}`}>
            {value}%
          </span>
          <span className="text-xs text-muted-foreground">
            {getStatusText(value)}
          </span>
        </div>
      </div>
      {readOnly ? (
        <div className="relative h-2 w-full rounded-full bg-muted">
          <div 
            className={`absolute h-full rounded-full transition-all ${
              value >= 70 ? "bg-green-600" : value >= 30 ? "bg-yellow-600" : "bg-red-600"
            }`}
            style={{ width: `${value}%` }}
          />
        </div>
      ) : (
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange?.(vals[0])}
          max={100}
          step={5}
          className="w-full"
          data-testid={`slider-${category}`}
        />
      )}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0% (Full)</span>
        <span>100% (Empty)</span>
      </div>
    </div>
  );
}
