import React, { useState } from 'react';
import { Users, Building2, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { RepairStatusReport } from './reports/RepairStatusReport';
import { useApp } from '../context/AppContext';

export default function Customers() {
  const { addNotification } = useApp();
  const [expandedCustomer, setExpandedCustomer] = useState<number | null>(null);

  const customers = [
    {
      id: 1,
      name: 'Acme Corp',
      contact: 'John Smith',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@acme.com',
      activeRMAs: 2,
      totalRepairs: 15,
      repairs: [
        {
          serviceOrder: 'SO-2024-101',
          salesOrder: 'PO-2024-001',
          productStatus: 'Final Testing',
          orderStatus: 'open',
          material: {
            partNumber: 'CM-X1-001',
            description: 'Control Module X1'
          },
          serial: 'SN-123456',
          orderCreatedDate: '2024-02-25',
          customerRequiredDate: '2024-03-10',
          estimatedCompletionDate: '2024-03-05',
          rmaNumber: 'RMA-2024-001'
        },
        {
          serviceOrder: 'SO-2024-102',
          salesOrder: 'PO-2024-001',
          productStatus: 'Awaiting Parts',
          orderStatus: 'open',
          material: {
            partNumber: 'PS-Y2-002',
            description: 'Power Supply Y2'
          },
          serial: 'SN-789012',
          orderCreatedDate: '2024-02-26',
          customerRequiredDate: '2024-03-15',
          estimatedCompletionDate: '2024-03-10',
          rmaNumber: 'RMA-2024-001'
        }
      ]
    },
    {
      id: 2,
      name: 'TechCo Industries',
      contact: 'Sarah Johnson',
      phone: '+1 (555) 234-5678',
      email: 'sarah.j@techco.com',
      activeRMAs: 1,
      totalRepairs: 8,
      repairs: [
        {
          serviceOrder: 'SO-2024-103',
          salesOrder: 'PO-2024-002',
          productStatus: 'Initial Inspection',
          orderStatus: 'open',
          material: {
            partNumber: 'SA-Z3-003',
            description: 'Sensor Array Z3'
          },
          serial: 'SN-345678',
          orderCreatedDate: '2024-02-27',
          customerRequiredDate: '2024-03-12',
          estimatedCompletionDate: '2024-03-07',
          rmaNumber: 'RMA-2024-002'
        }
      ]
    }
  ];

  const handleSendReport = (customerId: string) => {
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      message: 'Report sent to customer successfully',
      timestamp: new Date()
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>

      <div className="space-y-4">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div 
              className="p-6 cursor-pointer"
              onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-6 h-6 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">{customer.name}</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                    {customer.activeRMAs} Active RMAs
                  </span>
                  {expandedCustomer === customer.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{customer.contact}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
              </div>
            </div>

            {expandedCustomer === customer.id && (
              <div className="border-t border-gray-200 p-6">
                <RepairStatusReport
                  customerId={customer.id.toString()}
                  customerName={customer.name}
                  repairs={customer.repairs}
                  onSend={handleSendReport}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}