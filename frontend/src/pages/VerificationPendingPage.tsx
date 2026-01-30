import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';

const VerificationPendingPage: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleResend = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendStatus('idle');
    try {
      await api.post(`/auth/resend-verification?email=${email}`);
      setResendStatus('success');
    } catch (error) {
      console.error('Failed to resend', error);
      setResendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
            <Mail className="h-8 w-8 text-indigo-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to:<br/>
            <span className="font-semibold text-gray-900">{email || 'your email address'}</span>
          </p>

          <div className="bg-gray-50 rounded-md p-4 mb-6 text-sm text-gray-500 text-left">
            <p className="mb-2"><strong>Next steps:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open the email from <strong>University Reviews</strong></li>
              <li>Click the verification link inside</li>
              <li>Log in to your account</li>
            </ol>
          </div>

          <div className="space-y-4">
            {email && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-3">Didn't receive the email?</p>
                <button
                  onClick={handleResend}
                  disabled={isResending || resendStatus === 'success'}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : resendStatus === 'success' ? (
                    <span className="text-green-600">Email sent! Check your inbox.</span>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Click to resend verification email
                    </>
                  )}
                </button>
                {resendStatus === 'error' && (
                  <p className="text-xs text-red-600 mt-2">Failed to send. Please try again later.</p>
                )}
              </div>
            )}

            <Link
              to="/login"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Login <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPendingPage;
