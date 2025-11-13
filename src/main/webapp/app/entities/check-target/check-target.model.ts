import dayjs from 'dayjs/esm';

export interface ICheckTarget {
  id: number;
  name?: string | null;
  checkGroupId?: number | null;
  groupName?: string | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
}

export type NewCheckTarget = Omit<ICheckTarget, 'id'> & { id: null };
