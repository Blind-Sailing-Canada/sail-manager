import { Social } from './social';

export type SocialQuery = {
  [property in keyof Social]?: string;
};
