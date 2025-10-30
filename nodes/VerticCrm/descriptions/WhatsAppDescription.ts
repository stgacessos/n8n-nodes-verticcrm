import { INodeProperties } from 'n8n-workflow';

export const whatsappOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['whatsapp'],
      },
    },
    options: [
      {
        name: 'Send Message',
        value: 'sendMessage',
        description: 'Send a WhatsApp message',
        action: 'Send a message',
      },
      {
        name: 'Get Session Status',
        value: 'getSessionStatus',
        description: 'Get WhatsApp session status',
        action: 'Get session status',
      },
      {
        name: 'List Conversations',
        value: 'listConversations',
        description: 'List WhatsApp conversations',
        action: 'List conversations',
      },
    ],
    default: 'sendMessage',
  },
];

export const whatsappFields: INodeProperties[] = [
  // Send Message
  {
    displayName: 'Session ID',
    name: 'sessionId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['whatsapp'],
        operation: ['sendMessage', 'getSessionStatus'],
      },
    },
    default: '',
    description: 'WhatsApp session ID',
  },
  {
    displayName: 'Phone Number',
    name: 'phoneNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['whatsapp'],
        operation: ['sendMessage'],
      },
    },
    default: '',
    placeholder: '5511999999999',
    description: 'Phone number with country code (no +)',
  },
  {
    displayName: 'Message',
    name: 'message',
    type: 'string',
    required: true,
    typeOptions: {
      rows: 4,
    },
    displayOptions: {
      show: {
        resource: ['whatsapp'],
        operation: ['sendMessage'],
      },
    },
    default: '',
    description: 'Message to send',
  },
  // List Conversations
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['whatsapp'],
        operation: ['listConversations'],
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
