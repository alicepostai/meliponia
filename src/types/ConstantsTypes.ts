export interface SelectOption<T = number | string> {
  id: T;
  name: string;
  [key: string]: any;
}
export interface BeeSpecies extends SelectOption<number> {
  scientificName: string;
  imageUrl: string;
}
export type BoxType = SelectOption<number>;
export type HiveOrigin = SelectOption<number>;
export type State = SelectOption<number>;
