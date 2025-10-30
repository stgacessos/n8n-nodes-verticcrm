import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class VerticCrmApi implements ICredentialType {
  name = 'verticCrmApi';
  displayName = 'VerticCRM API';
  documentationUrl = 'https://docs.verticcrm.com/api';
  properties: INodeProperties[] = [
    {
      displayName: 'Supabase URL',
      name: 'supabaseUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-project.supabase.co',
      description: 'The URL of your VerticCRM Supabase project',
      required: true,
    },
    {
      displayName: 'Supabase Anon Key',
      name: 'supabaseAnonKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'The anonymous/public API key from your Supabase project',
      required: true,
    },
    {
      displayName: 'Company ID',
      name: 'companyId',
      type: 'string',
      default: '',
      placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      description: 'Your VerticCRM Company ID (optional, for multi-tenant setups)',
      required: false,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'apikey': '={{$credentials.supabaseAnonKey}}',
        'Authorization': 'Bearer {{$credentials.supabaseAnonKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.supabaseUrl}}/rest/v1',
      url: '/profiles?limit=1',
      method: 'GET',
    },
  };
}
