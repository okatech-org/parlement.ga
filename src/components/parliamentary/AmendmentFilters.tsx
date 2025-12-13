import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Filter, X, CalendarIcon, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface AmendmentFilters {
  status: string;
  type: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  search: string;
}

interface AmendmentFiltersProps {
  filters: AmendmentFilters;
  onFiltersChange: (filters: AmendmentFilters) => void;
  onReset: () => void;
  activeFiltersCount: number;
}

export const AmendmentFiltersComponent = ({
  filters,
  onFiltersChange,
  onReset,
  activeFiltersCount
}: AmendmentFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Recherche textuelle */}
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="search" className="text-xs text-muted-foreground">Recherche</Label>
          <Input
            id="search"
            placeholder="Référence, texte..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="h-9"
          />
        </div>

        {/* Filtre par statut */}
        <div className="w-[160px]">
          <Label className="text-xs text-muted-foreground">Statut</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="en_examen">En examen</SelectItem>
              <SelectItem value="adopte">Adopté</SelectItem>
              <SelectItem value="rejete">Rejeté</SelectItem>
              <SelectItem value="retire">Retiré</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtre par type */}
        <div className="w-[160px]">
          <Label className="text-xs text-muted-foreground">Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="modification">Modification</SelectItem>
              <SelectItem value="ajout">Ajout</SelectItem>
              <SelectItem value="suppression">Suppression</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date de début */}
        <div className="w-[140px]">
          <Label className="text-xs text-muted-foreground">Date début</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom ? format(filters.dateFrom, 'dd/MM/yy') : <span className="text-muted-foreground">Début</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateFrom}
                onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date })}
                locale={fr}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date de fin */}
        <div className="w-[140px]">
          <Label className="text-xs text-muted-foreground">Date fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo ? format(filters.dateTo, 'dd/MM/yy') : <span className="text-muted-foreground">Fin</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateTo}
                onSelect={(date) => onFiltersChange({ ...filters, dateTo: date })}
                locale={fr}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Bouton reset */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-9">
            <RotateCcw className="w-4 h-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Badges des filtres actifs */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Statut: {filters.status}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, status: 'all' })}
              />
            </Badge>
          )}
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.type}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, type: 'all' })}
              />
            </Badge>
          )}
          {filters.dateFrom && (
            <Badge variant="secondary" className="gap-1">
              Depuis: {format(filters.dateFrom, 'dd/MM/yyyy')}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, dateFrom: undefined })}
              />
            </Badge>
          )}
          {filters.dateTo && (
            <Badge variant="secondary" className="gap-1">
              Jusqu'au: {format(filters.dateTo, 'dd/MM/yyyy')}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, dateTo: undefined })}
              />
            </Badge>
          )}
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Recherche: "{filters.search}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, search: '' })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
