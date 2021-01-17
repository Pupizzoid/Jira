import { IUserData } from './index';
export interface IProjectData {
  title: string
  description: string
  members?: string[]
  ownerId: string,
  id?: string,
  membersInfoList?: IUserData[]
}
