import type { Languages } from 'src/constants/app.constant';

export interface IRequestHeader {
  acceptLanguage?: Languages | null;
  timezone?: string | null;
}
