import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format, addDays } from "date-fns";
import { Save, ChevronRight } from "lucide-react";

interface ForecastManagerProps {
  campgroundId: string;
}

interface ForecastDay {
  date: Date;
  motorhomeAvailability: number;
  caravanAvailability: number;
  vwBusAvailability: number;
  largeTentAvailability: number;
  smallTentAvailability: number;
}

export function ForecastManager({ campgroundId }: ForecastManagerProps) {
  const { toast } = useToast();
  const [forecasts, setForecasts] = useState<ForecastDay[]>(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      date: addDays(new Date(), i),
      motorhomeAvailability: 50,
      caravanAvailability: 50,
      vwBusAvailability: 50,
      largeTentAvailability: 50,
      smallTentAvailability: 50,
    }));
  });

  const { data: existingForecasts } = useQuery({
    queryKey: ["/api/forecasts", campgroundId, { days: 7 }],
  });

  const saveMutation = useMutation({
    mutationFn: async (forecast: ForecastDay) => {
      return apiRequest("POST", "/api/forecasts", {
        campgroundId,
        date: forecast.date.toISOString(),
        motorhomeAvailability: forecast.motorhomeAvailability,
        caravanAvailability: forecast.caravanAvailability,
        vwBusAvailability: forecast.vwBusAvailability,
        largeTentAvailability: forecast.largeTentAvailability,
        smallTentAvailability: forecast.smallTentAvailability,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forecasts", campgroundId] });
      toast({
        title: "Success",
        description: "Forecast saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save forecast",
        variant: "destructive",
      });
    },
  });

  const handleSaveAll = async () => {
    for (const forecast of forecasts) {
      await saveMutation.mutateAsync(forecast);
    }
  };

  const updateForecast = (index: number, field: keyof Omit<ForecastDay, "date">, value: number) => {
    setForecasts((prev) => {
      const newForecasts = [...prev];
      newForecasts[index] = {
        ...newForecasts[index],
        [field]: Math.max(0, Math.min(100, value)),
      };
      return newForecasts;
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {forecasts.map((forecast, index) => (
          <Card key={index} className="p-4" data-testid={`card-forecast-day-${index}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground" data-testid={`text-forecast-date-${index}`}>
                    {format(forecast.date, "EEEE, MMM d")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 ? "Today" : `In ${index} day${index === 1 ? "" : "s"}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`motorhome-${index}`} className="text-xs" data-testid={`label-motorhome-${index}`}>
                    Motorhome %
                  </Label>
                  <Input
                    id={`motorhome-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    value={forecast.motorhomeAvailability}
                    onChange={(e) => updateForecast(index, "motorhomeAvailability", parseInt(e.target.value) || 0)}
                    data-testid={`input-motorhome-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`caravan-${index}`} className="text-xs" data-testid={`label-caravan-${index}`}>
                    Caravan %
                  </Label>
                  <Input
                    id={`caravan-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    value={forecast.caravanAvailability}
                    onChange={(e) => updateForecast(index, "caravanAvailability", parseInt(e.target.value) || 0)}
                    data-testid={`input-caravan-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`vwbus-${index}`} className="text-xs" data-testid={`label-vwbus-${index}`}>
                    VW Bus %
                  </Label>
                  <Input
                    id={`vwbus-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    value={forecast.vwBusAvailability}
                    onChange={(e) => updateForecast(index, "vwBusAvailability", parseInt(e.target.value) || 0)}
                    data-testid={`input-vwbus-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`large-tent-${index}`} className="text-xs" data-testid={`label-large-tent-${index}`}>
                    Large Tent %
                  </Label>
                  <Input
                    id={`large-tent-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    value={forecast.largeTentAvailability}
                    onChange={(e) => updateForecast(index, "largeTentAvailability", parseInt(e.target.value) || 0)}
                    data-testid={`input-large-tent-${index}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`small-tent-${index}`} className="text-xs" data-testid={`label-small-tent-${index}`}>
                    Small Tent %
                  </Label>
                  <Input
                    id={`small-tent-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    value={forecast.smallTentAvailability}
                    onChange={(e) => updateForecast(index, "smallTentAvailability", parseInt(e.target.value) || 0)}
                    data-testid={`input-small-tent-${index}`}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveAll} 
          disabled={saveMutation.isPending} 
          className="gap-2"
          data-testid="button-save-forecasts"
        >
          {saveMutation.isPending ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save All Forecasts
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
