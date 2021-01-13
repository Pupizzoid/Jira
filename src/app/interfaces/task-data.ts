export interface ITaskData {
  title: string
  description: string
  status: string
  type: string,
  priority: string
  assignTo: {name:string}
  projectId: string
  deadline: string
  createdDate: string,
  id?: string
}
