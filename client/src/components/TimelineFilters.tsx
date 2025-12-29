import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";

interface TimelineFiltersProps {
  onFilterChange: (filters: TimelineFilterState) => void;
  onClearFilters: () => void;
}

export interface TimelineFilterState {
  category?: "problem" | "maintenance" | "decision" | "inspection";
  startDate?: Date;
  endDate?: Date;
}

const categories = [
  { value: "problem", label: "Problemas", color: "bg-red-100 text-red-800" },
  { value: "maintenance", label: "Manutenção", color: "bg-blue-100 text-blue-800" },
  { value: "decision", label: "Decisões", color: "bg-green-100 text-green-800" },
  { value: "inspection", label: "Inspeções", color: "bg-purple-100 text-purple-800" },
];

export default function TimelineFilters({ onFilterChange, onClearFilters }: TimelineFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleCategorySelect = (category: string) => {
    const newCategory = selectedCategory === category ? undefined : category;
    setSelectedCategory(newCategory);
    onFilterChange({
      category: newCategory as any,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    onFilterChange({
      category: selectedCategory as any,
      startDate: type === "start" && value ? new Date(value) : startDate ? new Date(startDate) : undefined,
      endDate: type === "end" && value ? new Date(value) : endDate ? new Date(endDate) : undefined,
    });
  };

  const handleClear = () => {
    setSelectedCategory(undefined);
    setStartDate("");
    setEndDate("");
    onClearFilters();
  };

  const hasActiveFilters = selectedCategory || startDate || endDate;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {[selectedCategory, startDate, endDate].filter(Boolean).length}
            </span>
          )}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Limpar
          </Button>
        )}
      </div>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filtrar Registros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Filter */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Categoria</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      selectedCategory === cat.value
                        ? cat.color
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Período</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600">De</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange("start", e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Até</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange("end", e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
