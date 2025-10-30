import { INodeProperties } from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['task'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new task',
        action: 'Create a task',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a task',
        action: 'Update a task',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a task by ID',
        action: 'Get a task',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List tasks',
        action: 'List tasks',
      },
      {
        name: 'Complete',
        value: 'complete',
        description: 'Mark task as completed',
        action: 'Complete a task',
      },
    ],
    default: 'create',
  },
];

export const taskFields: INodeProperties[] = [
  // Create Task
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Task title',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Task description',
  },
  {
    displayName: 'Lead ID',
    name: 'lead_id',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create', 'list'],
      },
    },
    default: '',
    description: 'Associated lead ID',
  },
  {
    displayName: 'Assigned To',
    name: 'assigned_to',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'User ID to assign the task to',
  },
  {
    displayName: 'Due Date',
    name: 'due_date',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Task due date',
  },
  {
    displayName: 'Priority',
    name: 'priority',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create'],
      },
    },
    options: [
      { name: 'Low', value: 'baixa' },
      { name: 'Medium', value: 'media' },
      { name: 'High', value: 'alta' },
      { name: 'Urgent', value: 'urgente' },
    ],
    default: 'media',
    description: 'Task priority',
  },
  {
    displayName: 'Task Type',
    name: 'task_type',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create'],
      },
    },
    default: 'follow_up',
    description: 'Type of task',
  },
  // Task ID for operations
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['update', 'get', 'complete'],
      },
    },
    default: '',
    description: 'The ID of the task',
  },
  // Update Fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
      },
      {
        displayName: 'Due Date',
        name: 'due_date',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'Low', value: 'baixa' },
          { name: 'Medium', value: 'media' },
          { name: 'High', value: 'alta' },
          { name: 'Urgent', value: 'urgente' },
        ],
        default: 'media',
      },
      {
        displayName: 'Completed',
        name: 'completed',
        type: 'boolean',
        default: false,
      },
    ],
  },
  // List Options
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['list'],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 1000,
    },
    default: 50,
    description: 'Max number of results to return',
  },
];
