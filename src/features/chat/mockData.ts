import type { Conversation, Message } from './types';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    _id: 'conv1',
    tenantId:   { _id: 't1', firstName: 'Ashik',  lastName: 'K',    avatar: '' },
    landlordId: { _id: 'l1', firstName: 'Rahul',  lastName: 'Nair', avatar: '' },
    propertyId: { _id: 'p1', title: 'Luxury 3BHK Apartment', city: 'Kochi' },
    lastMessage:   'Is the apartment still available?',
    lastMessageAt: new Date().toISOString(),
    unreadCount:   2,
    status:        'active',
  },
  {
    _id: 'conv2',
    tenantId:   { _id: 't2', firstName: 'Faseeh', lastName: 'Ali',  avatar: '' },
    landlordId: { _id: 'l1', firstName: 'Rahul',  lastName: 'Nair', avatar: '' },
    propertyId: { _id: 'p2', title: 'Cozy 2BHK Villa', city: 'Calicut' },
    lastMessage:   'When can I visit?',
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount:   0,
    status:        'active',
  },
  {
    _id: 'conv3',
    tenantId:   { _id: 't3', firstName: 'Hari',   lastName: 'Prasad', avatar: '' },
    landlordId: { _id: 'l1', firstName: 'Rahul',  lastName: 'Nair',   avatar: '' },
    propertyId: { _id: 'p1', title: 'Luxury 3BHK Apartment', city: 'Kochi' },
    lastMessage:   'Thank you for the info!',
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
    unreadCount:   1,
    status:        'active',
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    _id: 'm1', conversationId: 'conv1',
    senderId: 't1', senderRole: 'tenant',
    content:  'Hi, I am interested in your property.',
    isRead: true, createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'm2', conversationId: 'conv1',
    senderId: 't1', senderRole: 'tenant',
    content:  'Is the apartment still available?',
    isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'm3', conversationId: 'conv1',
    senderId: 'l1', senderRole: 'landlord',
    content:  'Yes it is! When would you like to visit?',
    isRead: true, createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    _id: 'm4', conversationId: 'conv2',
    senderId: 't2', senderRole: 'tenant',
    content:  'Hello, when can I schedule a visit?',
    isRead: true, createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    _id: 'm5', conversationId: 'conv2',
    senderId: 't2', senderRole: 'tenant',
    content:  'When can I visit?',
    isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'm6', conversationId: 'conv3',
    senderId: 't3', senderRole: 'tenant',
    content:  'Is parking available?',
    isRead: true, createdAt: new Date(Date.now() - 90000000).toISOString(),
  },
  {
    _id: 'm7', conversationId: 'conv3',
    senderId: 'l1', senderRole: 'landlord',
    content:  'Yes, we have covered parking.',
    isRead: true, createdAt: new Date(Date.now() - 86500000).toISOString(),
  },
  {
    _id: 'm8', conversationId: 'conv3',
    senderId: 't3', senderRole: 'tenant',
    content:  'Thank you for the info!',
    isRead: false, createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];