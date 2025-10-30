import { INodeProperties } from 'n8n-workflow';

export const automationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['automation'],
      },
    },
    options: [
      {
        name: 'Execute',
        value: 'execute',
        description: 'Execute an automation',
        action: 'Execute an automation',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List automations',
        action: 'List automations',
      },
    ],
    default: 'execute',
  },
];

export const automationFields: INodeProperties[] = [
  {
    displayName: 'Automation ID',
    name: 'automationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['execute'],
      },
    },
    default: '',
    description: 'The ID of the automation to execute',
  },
  {
    displayName: 'Lead ID',
    name: 'leadId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['execute'],
      },
    },
    default: '',
    description: 'The ID of the lead to run the automation against',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['automation'],
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
