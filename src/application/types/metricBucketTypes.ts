// export type { Filter } from "@domain/value-objects";
import type { Filter } from "@domain/value-objects/widgets/visualization";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Base {
  label?: string;
  field: string;
}

/**
 * Interface pour une métrique
 */
export interface Metric extends Base {
  agg: string;
  type?: string;
}

// Nouveaux types pour les buckets multiples
export type BucketType =
  | 'terms'           // Groupement par termes (équivalent à l'actuel "champ de groupement")
  | 'histogram'       // Histogramme numérique
  | 'date_histogram'  // Histogramme de dates
  | 'range'          // Plages personnalisées
  | 'split_series'   // Division en séries (équivalent à split series dans Kibana)
  | 'split_rows'     // Division en lignes
  | 'split_chart';   // Division en graphiques séparés

export interface MultiBucketConfig extends Base {
  type: BucketType;
  order?: 'asc' | 'desc';
  size?: number;  // Nombre max d'éléments
  minDocCount?: number;  // Nombre minimum de documents

  // Pour histogram
  interval?: number;

  // Pour date_histogram
  dateInterval?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

  // Pour range
  ranges?: Array<{
    from?: number;
    to?: number;
    label?: string;
  }>;

  // Pour split
  splitType?: 'series' | 'rows' | 'chart';
}


export interface ScatterMetricConfig extends Metric {
  x: string;
  y: string;
  datasetFilters?: Filter[];
}

export interface BubbleMetricConfig extends ScatterMetricConfig {
  r: string;
}

export interface RadarMetricConfig extends Metric {
  fields: string[];
  datasetFilters?: Filter[];
}











/**
 * Types de données pour les buckets multiples
 */








