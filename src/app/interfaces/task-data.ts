export interface ITaskData {
  title: string
  description: string
  status: string
  type: string,
  priority: string
  assignTo: {name:string}
  projectId: string
  deadline: Date
  createdDate: Date,
  id?: string
}
