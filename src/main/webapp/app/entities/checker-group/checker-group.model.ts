import dayjs from 'dayjs/esm';

export interface ICheckerGroup {
  id: number;
  code?: string | null;
  name?: string | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
}

export type NewCheckerGroup = Omit<ICheckerGroup, 'id'> & { id: null };
