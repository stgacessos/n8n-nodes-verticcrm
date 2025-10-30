import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import {
  leadOperations,
  leadFields,
} from './descriptions/LeadDescription';

import {
  taskOperations,
  taskFields,
} from './descriptions/TaskDescription';

import {
  whatsappOperations,
  whatsappFields,
} from './descriptions/WhatsAppDescription';

import {
  automationOperations,
  automationFields,
} from './descriptions/AutomationDescription';

export class VerticCrm implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'VerticCRM',
    name: 'verticCrm',
    icon: 'file:verticcrm.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with VerticCRM API',
    defaults: {
      name: 'VerticCRM',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'verticCrmApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Lead',
            value: 'lead',
          },
          {
            name: 'Task',
            value: 'task',
          },
          {
            name: 'WhatsApp',
            value: 'whatsapp',
          },
          {
            name: 'Automation',
            value: 'automation',
          },
        ],
        default: 'lead',
      },
      ...leadOperations,
      ...leadFields,
      ...taskOperations,
      ...taskFields,
      ...whatsappOperations,
      ...whatsappFields,
      ...automationOperations,
      ...automationFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);

    const credentials = await this.getCredentials('verticCrmApi');
    const supabaseUrl = credentials.supabaseUrl as string;
    const supabaseAnonKey = credentials.supabaseAnonKey as string;
    const companyId = credentials.companyId as string || undefined;

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'lead') {
          if (operation === 'create') {
            // Create Lead
            const fullName = this.getNodeParameter('full_name', i) as string;
            const email = this.getNodeParameter('email', i, '') as string;
            const phoneNumber = this.getNodeParameter('phone_number', i, '') as string;
            const companyName = this.getNodeParameter('company_name', i, '') as string;
            const stage = this.getNodeParameter('stage', i, 'novo_lead') as string;
            const priority = this.getNodeParameter('priority', i, 'media') as string;
            const estimatedValue = this.getNodeParameter('estimated_value', i, 0) as number;
            const funnelId = this.getNodeParameter('funnel_id', i, '') as string;
            const notes = this.getNodeParameter('notes', i, '') as string;
            const customFields = this.getNodeParameter('custom_fields', i, '{}') as string;

            if (!email && !phoneNumber) {
              throw new NodeOperationError(
                this.getNode(),
                'Either email or phone number must be provided'
              );
            }

            const body: any = {
              full_name: fullName,
              email: email || undefined,
              phone_number: phoneNumber || undefined,
              company_name: companyName || undefined,
              stage,
              priority,
              estimated_value: estimatedValue || undefined,
              funnel_id: funnelId || undefined,
              notes: notes || undefined,
              company_id: companyId,
            };

            // Parse custom fields
            try {
              if (customFields && customFields !== '{}') {
                body.custom_fields = JSON.parse(customFields);
              }
            } catch (error) {
              throw new NodeOperationError(
                this.getNode(),
                'Invalid JSON in custom_fields'
              );
            }

            const response = await this.helpers.request({
              method: 'POST',
              url: `${supabaseUrl}/functions/v1/create-lead`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
              },
              body,
              json: true,
            });

            returnData.push({ json: response });

          } else if (operation === 'update') {
            // Update Lead
            const leadId = this.getNodeParameter('leadId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i, {}) as any;

            const body: any = { ...updateFields };
            if (companyId) {
              body.company_id = companyId;
            }

            const response = await this.helpers.request({
              method: 'PATCH',
              url: `${supabaseUrl}/rest/v1/leads`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
              },
              qs: {
                id: `eq.${leadId}`,
              },
              body,
              json: true,
            });

            returnData.push({ json: response });

          } else if (operation === 'get') {
            // Get Lead
            const leadId = this.getNodeParameter('leadId', i) as string;

            const response = await this.helpers.request({
              method: 'GET',
              url: `${supabaseUrl}/rest/v1/leads`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
              },
              qs: {
                id: `eq.${leadId}`,
                select: '*,profiles:responsible_id(id,full_name,avatar_url)',
              },
              json: true,
            });

            returnData.push({ json: Array.isArray(response) ? response[0] : response });

          } else if (operation === 'list') {
            // List Leads
            const limit = this.getNodeParameter('limit', i, 50) as number;
            const filters = this.getNodeParameter('filters', i, {}) as any;

            const qs: any = {
              limit,
              select: '*,profiles:responsible_id(id,full_name,avatar_url)',
              order: 'created_at.desc',
            };

            if (companyId) {
              qs.company_id = `eq.${companyId}`;
            }

            if (filters.stage) {
              qs.stage = `eq.${filters.stage}`;
            }
            if (filters.priority) {
              qs.priority = `eq.${filters.priority}`;
            }
            if (filters.funnel_id) {
              qs.funnel_id = `eq.${filters.funnel_id}`;
            }
            if (filters.responsible_id) {
              qs.responsible_id = `eq.${filters.responsible_id}`;
            }

            const response = await this.helpers.request({
              method: 'GET',
              url: `${supabaseUrl}/rest/v1/leads`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
              },
              qs,
              json: true,
            });

            const leads = Array.isArray(response) ? response : [response];
            leads.forEach(lead => returnData.push({ json: lead }));

          } else if (operation === 'lookup') {
            // Lookup Lead
            const email = this.getNodeParameter('email', i, '') as string;
            const phoneNumber = this.getNodeParameter('phone_number', i, '') as string;

            if (!email && !phoneNumber) {
              throw new NodeOperationError(
                this.getNode(),
                'Either email or phone number must be provided for lookup'
              );
            }

            const body: any = {
              lookupOnly: true,
              email: email || undefined,
              phone_number: phoneNumber || undefined,
              company_id: companyId,
            };

            const response = await this.helpers.request({
              method: 'POST',
              url: `${supabaseUrl}/functions/v1/create-lead`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
              },
              body,
              json: true,
            });

            returnData.push({ json: response });

          } else if (operation === 'changeStage') {
            // Change Lead Stage
            const leadId = this.getNodeParameter('leadId', i) as string;
            const newStage = this.getNodeParameter('newStage', i) as string;

            const body: any = {
              stage: newStage,
              stage_changed_at: new Date().toISOString(),
            };

            const response = await this.helpers.request({
              method: 'PATCH',
              url: `${supabaseUrl}/rest/v1/leads`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
              },
              qs: {
                id: `eq.${leadId}`,
              },
              body,
              json: true,
            });

            returnData.push({ json: response });

          } else if (operation === 'assign') {
            // Assign Lead
            const leadId = this.getNodeParameter('leadId', i) as string;
            const userId = this.getNodeParameter('userId', i) as string;

            const body: any = {
              responsible_id: userId,
            };

            const response = await this.helpers.request({
              method: 'PATCH',
              url: `${supabaseUrl}/rest/v1/leads`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
              },
              qs: {
                id: `eq.${leadId}`,
              },
              body,
              json: true,
            });

            returnData.push({ json: response });
          }

        } else if (resource === 'task') {
          if (operation === 'create') {
            // Create Task
            const title = this.getNodeParameter('title', i) as string;
            const description = this.getNodeParameter('description', i, '') as string;
            const leadId = this.getNodeParameter('lead_id', i, '') as string;
            const assignedTo = this.getNodeParameter('assigned_to', i, '') as string;
            const dueDate = this.getNodeParameter('due_date', i, '') as string;
            const priority = this.getNodeParameter('priority', i, 'media') as string;
            const taskType = this.getNodeParameter('task_type', i, 'follow_up') as string;

            const body: any = {
              title,
              description: description || undefined,
              lead_id: leadId || undefined,
              assigned_to: assignedTo || undefined,
              due_date: dueDate || undefined,
              priority,
              task_type: taskType,
              company_id: companyId,
            };

            const response = await this.helpers.request({
              method: 'POST',
              url: `${supabaseUrl}/rest/v1/tasks`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
              },
              body,
              json: true,
            });

            returnData.push({ json: response });

          } else if (operation === 'update') {
            // Update Task
            const taskId = this.getNodeParameter('taskId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i, {}) as any;

            const response = await this.helpers.request({
              method: 'PATCH',
              url: `${supabaseUrl}/rest/v1/tasks`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
              },
              qs: {
                id: `eq.${taskId}`,
              },
              body: updateFields,
              json: true,
            });

            returnData.push({ json: response });

          } else if (operation === 'get') {
            // Get Task
            const taskId = this.getNodeParameter('taskId', i) as string;

            const response = await this.helpers.request({
              method: 'GET',
              url: `${supabaseUrl}/rest/v1/tasks`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
              },
              qs: {
                id: `eq.${taskId}`,
              },
              json: true,
            });

            returnData.push({ json: Array.isArray(response) ? response[0] : response });

          } else if (operation === 'list') {
            // List Tasks
            const limit = this.getNodeParameter('limit', i, 50) as number;
            const leadId = this.getNodeParameter('lead_id', i, '') as string;

            const qs: any = {
              limit,
              order: 'created_at.desc',
            };

            if (companyId) {
              qs.company_id = `eq.${companyId}`;
            }

            if (leadId) {
              qs.lead_id = `eq.${leadId}`;
            }

            const response = await this.helpers.request({
              method: 'GET',
              url: `${supabaseUrl}/rest/v1/tasks`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
              },
              qs,
              json: true,
            });

            const tasks = Array.isArray(response) ? response : [response];
            tasks.forEach(task => returnData.push({ json: task }));

          } else if (operation === 'complete') {
            // Complete Task
            const taskId = this.getNodeParameter('taskId', i) as string;

            const body: any = {
              completed: true,
              completed_at: new Date().toISOString(),
            };

            const response = await this.helpers.request({
              method: 'PATCH',
              url: `${supabaseUrl}/rest/v1/tasks`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
              },
              qs: {
                id: `eq.${taskId}`,
              },
              body,
              json: true,
            });

            returnData.push({ json: response });
          }

        } else if (resource === 'whatsapp') {
          if (operation === 'sendMessage') {
            // Send WhatsApp Message
            const sessionId = this.getNodeParameter('sessionId', i) as string;
            const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
            const message = this.getNodeParameter('message', i) as string;

            const body: any = {
              session_id: sessionId,
              phone_number: phoneNumber,
              message,
            };

            const response = await this.helpers.request({
              method: 'POST',
              url: `${supabaseUrl}/functions/v1/whatsapp-messages`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
              },
              body,
              json: true,
            });

            returnData.push({ json: response });

          } else if (operation === 'getSessionStatus') {
            // Get Session Status
            const sessionId = this.getNodeParameter('sessionId', i) as string;

            const response = await this.helpers.request({
              method: 'GET',
              url: `${supabaseUrl}/rest/v1/whatsapp_sessions`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
              },
              qs: {
                id: `eq.${sessionId}`,
              },
              json: true,
            });

            returnData.push({ json: Array.isArray(response) ? response[0] : response });

          } else if (operation === 'listConversations') {
            // List Conversations
            const limit = this.getNodeParameter('limit', i, 50) as number;

            const qs: any = {
              limit,
              order: 'last_message_at.desc',
            };

            if (companyId) {
              qs.company_id = `eq.${companyId}`;
            }

            const response = await this.helpers.request({
              method: 'GET',
              url: `${supabaseUrl}/rest/v1/conversations`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
              },
              qs,
              json: true,
            });

            const conversations = Array.isArray(response) ? response : [response];
            conversations.forEach(conv => returnData.push({ json: conv }));
          }

        } else if (resource === 'automation') {
          if (operation === 'execute') {
            // Execute Automation
            const automationId = this.getNodeParameter('automationId', i) as string;
            const leadId = this.getNodeParameter('leadId', i) as string;

            const body: any = {
              automation_id: automationId,
              lead_id: leadId,
            };

            const response = await this.helpers.request({
              method: 'POST',
              url: `${supabaseUrl}/functions/v1/execute-automation`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
              },
              body,
              json: true,
            });

            returnData.push({ json: response });

          } else if (operation === 'list') {
            // List Automations
            const limit = this.getNodeParameter('limit', i, 50) as number;

            const qs: any = {
              limit,
              order: 'created_at.desc',
            };

            if (companyId) {
              qs.company_id = `eq.${companyId}`;
            }

            const response = await this.helpers.request({
              method: 'GET',
              url: `${supabaseUrl}/rest/v1/automations`,
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
              },
              qs,
              json: true,
            });

            const automations = Array.isArray(response) ? response : [response];
            automations.forEach(automation => returnData.push({ json: automation }));
          }
        }

      } catch (error: any) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
