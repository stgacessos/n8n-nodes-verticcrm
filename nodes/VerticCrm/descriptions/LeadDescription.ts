import { INodeProperties } from 'n8n-workflow';

export const leadOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['lead'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new lead',
        action: 'Create a lead',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a lead',
        action: 'Update a lead',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a lead by ID',
        action: 'Get a lead',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List all leads',
        action: 'List leads',
      },
      {
        name: 'Lookup',
        value: 'lookup',
        description: 'Lookup lead by email or phone',
        action: 'Lookup a lead',
      },
      {
        name: 'Change Stage',
        value: 'changeStage',
        description: 'Change lead stage',
        action: 'Change lead stage',
      },
      {
        name: 'Assign',
        value: 'assign',
        description: 'Assign lead to user',
        action: 'Assign a lead',
      },
    ],
    default: 'create',
  },
];

export const leadFields: INodeProperties[] = [
  // Create Lead Fields
  {
    displayName: 'Full Name',
    name: 'full_name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Full name of the lead',
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create', 'lookup'],
      },
    },
    default: '',
    description: 'Email address (required if phone number not provided)',
  },
  {
    displayName: 'Phone Number',
    name: 'phone_number',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create', 'lookup'],
      },
    },
    default: '',
    description: 'Phone number (required if email not provided)',
  },
  {
    displayName: 'Company Name',
    name: 'company_name',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Company name',
  },
  {
    displayName: 'Stage',
    name: 'stage',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create'],
      },
    },
    options: [
      { name: 'New Lead', value: 'novo_lead' },
      { name: 'Meeting Scheduled', value: 'reuniao_agendada' },
      { name: 'Contact Made', value: 'contato_realizado' },
      { name: 'Proposal Sent', value: 'proposta_enviada' },
      { name: 'Negotiation', value: 'negociacao' },
      { name: 'Won', value: 'ganho' },
      { name: 'Lost', value: 'perdido' },
      { name: 'Not Qualified', value: 'nao_qualificado' },
    ],
    default: 'novo_lead',
    description: 'Lead stage',
  },
  {
    displayName: 'Priority',
    name: 'priority',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create'],
      },
    },
    options: [
      { name: 'Low', value: 'baixa' },
      { name: 'Medium', value: 'media' },
      { name: 'High', value: 'alta' },
    ],
    default: 'media',
    description: 'Lead priority',
  },
  {
    displayName: 'Estimated Value',
    name: 'estimated_value',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create'],
      },
    },
    default: 0,
    description: 'Estimated deal value',
  },
  {
    displayName: 'Funnel ID',
    name: 'funnel_id',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Funnel ID (optional, will use default if not provided)',
  },
  {
    displayName: 'Notes',
    name: 'notes',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Additional notes about the lead',
  },
  {
    displayName: 'Custom Fields',
    name: 'custom_fields',
    type: 'json',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create'],
      },
    },
    default: '{}',
    description: 'Custom fields as JSON object',
  },
  // Update Lead Fields
  {
    displayName: 'Lead ID',
    name: 'leadId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['update', 'get', 'changeStage', 'assign'],
      },
    },
    default: '',
    description: 'The ID of the lead',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Full Name',
        name: 'full_name',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Phone Number',
        name: 'phone_number',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Company Name',
        name: 'company_name',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Stage',
        name: 'stage',
        type: 'options',
        options: [
          { name: 'New Lead', value: 'novo_lead' },
          { name: 'Meeting Scheduled', value: 'reuniao_agendada' },
          { name: 'Contact Made', value: 'contato_realizado' },
          { name: 'Proposal Sent', value: 'proposta_enviada' },
          { name: 'Negotiation', value: 'negociacao' },
          { name: 'Won', value: 'ganho' },
          { name: 'Lost', value: 'perdido' },
          { name: 'Not Qualified', value: 'nao_qualificado' },
        ],
        default: 'novo_lead',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'Low', value: 'baixa' },
          { name: 'Medium', value: 'media' },
          { name: 'High', value: 'alta' },
        ],
        default: 'media',
      },
      {
        displayName: 'Estimated Value',
        name: 'estimated_value',
        type: 'number',
        default: 0,
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
      },
    ],
  },
  // Change Stage
  {
    displayName: 'New Stage',
    name: 'newStage',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['changeStage'],
      },
    },
    options: [
      { name: 'New Lead', value: 'novo_lead' },
      { name: 'Meeting Scheduled', value: 'reuniao_agendada' },
      { name: 'Contact Made', value: 'contato_realizado' },
      { name: 'Proposal Sent', value: 'proposta_enviada' },
      { name: 'Negotiation', value: 'negociacao' },
      { name: 'Won', value: 'ganho' },
      { name: 'Lost', value: 'perdido' },
      { name: 'Not Qualified', value: 'nao_qualificado' },
    ],
    default: 'novo_lead',
    description: 'New stage for the lead',
  },
  // Assign
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['assign'],
      },
    },
    default: '',
    description: 'ID of the user to assign the lead to',
  },
  // List options
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['lead'],
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
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Stage',
        name: 'stage',
        type: 'options',
        options: [
          { name: 'New Lead', value: 'novo_lead' },
          { name: 'Meeting Scheduled', value: 'reuniao_agendada' },
          { name: 'Contact Made', value: 'contato_realizado' },
          { name: 'Proposal Sent', value: 'proposta_enviada' },
          { name: 'Negotiation', value: 'negociacao' },
          { name: 'Won', value: 'ganho' },
          { name: 'Lost', value: 'perdido' },
          { name: 'Not Qualified', value: 'nao_qualificado' },
        ],
        default: 'novo_lead',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'Low', value: 'baixa' },
          { name: 'Medium', value: 'media' },
          { name: 'High', value: 'alta' },
        ],
        default: 'media',
      },
      {
        displayName: 'Funnel ID',
        name: 'funnel_id',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Responsible ID',
        name: 'responsible_id',
        type: 'string',
        default: '',
      },
    ],
  },
];
