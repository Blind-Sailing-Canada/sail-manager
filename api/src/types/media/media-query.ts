import { Media } from './media';

export type MediaQuery = {
  [property in keyof Media]?: string;
};
