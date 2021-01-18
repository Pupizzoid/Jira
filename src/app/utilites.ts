export const uid = (): string => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const userData = {
  name: "",
  email: '',
  id: ''
}

export const projectData = {
  title: ' ',
  description: ' ',
  participants: [],
  ownerId: ' ',
  id: ' ',
  tasks: []
}

export const taskData = {
  title: '',
  description: '',
  status: '',
  priority: '',
  id: '',
  type: '',
  assignTo: {name: ''},
  projectId: '',
  deadline: new Date(),
  createdDate: new Date()
}

export const filterData = [
  { value: 'assignMe', viewValue: 'Assigned to me' },
  { value: 'creator', viewValue: 'Created by me' },
]

export const issueType = ['Bug', 'Feature', 'Task'];

export const issuePriority = ['High', 'Medium', 'Low'];

export const issueStatus = ['todo', "progress", "review", "done"];
