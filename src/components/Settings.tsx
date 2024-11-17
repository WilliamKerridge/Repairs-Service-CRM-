import React, { useState, useRef } from 'react';
import { Database, Upload, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { processRMAExcel, processServiceOrderExcel } from '../services/excelService';
import { testDatabaseConnection, connectToDatabase, saveRMAData, saveServiceOrderData } from '../services/databaseService';

interface DatabaseConfig {
  host: string;
  database: string;
  username: string;
  password: string;
}

export default function Settings() {
  const { addNotification } = useApp();
  const [showDbModal, setShowDbModal] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'success' | 'error'>('none');
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    host: '',
    database: '',
    username: '',
    password: '',
  });
  
  const [isProcessingRMA, setIsProcessingRMA] = useState(false);
  const [isProcessingServiceOrder, setIsProcessingServiceOrder] = useState(false);
  const rmaFileInputRef = useRef<HTMLInputElement>(null);
  const serviceOrderFileInputRef = useRef<HTMLInputElement>(null);

  const handleRMAExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingRMA(true);
    try {
      const rmaData = await processRMAExcel(file);
      await saveRMAData(rmaData);
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: `Successfully processed ${rmaData.length} RMA records`,
        timestamp: new Date(),
      });

      if (rmaFileInputRef.current) {
        rmaFileInputRef.current.value = '';
      }
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Error processing RMA file',
        timestamp: new Date(),
      });
    } finally {
      setIsProcessingRMA(false);
    }
  };

  const handleServiceOrderExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingServiceOrder(true);
    try {
      const serviceOrderData = await processServiceOrderExcel(file);
      await saveServiceOrderData(serviceOrderData);
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: `Successfully processed ${serviceOrderData.length} Service Order records`,
        timestamp: new Date(),
      });

      if (serviceOrderFileInputRef.current) {
        serviceOrderFileInputRef.current.value = '';
      }
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Error processing Service Order file',
        timestamp: new Date(),
      });
    } finally {
      setIsProcessingServiceOrder(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('none');

    try {
      const isConnected = await testDatabaseConnection(dbConfig);
      setConnectionStatus(isConnected ? 'success' : 'error');
      
      addNotification({
        id: Date.now().toString(),
        type: isConnected ? 'success' : 'error',
        message: isConnected ? 'Database connection successful' : 'Database connection failed',
        timestamp: new Date(),
      });
    } catch (error) {
      setConnectionStatus('error');
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Database connection failed',
        timestamp: new Date(),
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleDatabaseConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await connectToDatabase(dbConfig);
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: 'Database connection saved successfully',
        timestamp: new Date(),
      });
      setShowDbModal(false);
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Failed to save database connection',
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Data Import</h2>
            <p className="mt-1 text-sm text-gray-500">
              Import data from Excel files or connect to your existing database.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">RMA Data Import</label>
              <div className="mt-1 flex items-center space-x-4">
                <button
                  onClick={() => rmaFileInputRef.current?.click()}
                  disabled={isProcessingRMA}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                    isProcessingRMA
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isProcessingRMA ? 'Processing RMA...' : 'Upload RMA Excel'}
                </button>
                <input
                  type="file"
                  ref={rmaFileInputRef}
                  onChange={handleRMAExcelUpload}
                  accept=".xlsx,.xls"
                  className="hidden"
                  disabled={isProcessingRMA}
                />
                <span className="text-sm text-gray-500">
                  Upload RMA data from Excel
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Service Order Import</label>
              <div className="mt-1 flex items-center space-x-4">
                <button
                  onClick={() => serviceOrderFileInputRef.current?.click()}
                  disabled={isProcessingServiceOrder}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                    isProcessingServiceOrder
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isProcessingServiceOrder ? 'Processing Orders...' : 'Upload Service Orders'}
                </button>
                <input
                  type="file"
                  ref={serviceOrderFileInputRef}
                  onChange={handleServiceOrderExcelUpload}
                  accept=".xlsx,.xls"
                  className="hidden"
                  disabled={isProcessingServiceOrder}
                />
                <span className="text-sm text-gray-500">
                  Upload Power BI export data
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Database Connection</label>
              <div className="mt-1">
                <button
                  onClick={() => setShowDbModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Configure Database
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Configuration Modal */}
      {showDbModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="relative bg-white rounded-lg max-w-md w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowDbModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleDatabaseConnect} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Database Configuration
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Host
                    </label>
                    <input
                      type="text"
                      value={dbConfig.host}
                      onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Database Name
                    </label>
                    <input
                      type="text"
                      value={dbConfig.database}
                      onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      value={dbConfig.username}
                      onChange={(e) => setDbConfig({ ...dbConfig, username: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={dbConfig.password}
                      onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {connectionStatus === 'success' && <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
                    {connectionStatus === 'error' && <AlertCircle className="w-4 h-4 mr-2 text-red-500" />}
                    {isTestingConnection ? 'Testing...' : 'Test Connection'}
                  </button>

                  <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}