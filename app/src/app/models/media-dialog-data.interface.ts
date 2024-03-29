import { Media } from '../../../../api/src/types/media/media';

export interface MediaDialogData {
  media: Media;
  type: string;
  tag_me?: VoidFunction;
  untag_me?: VoidFunction;
}
