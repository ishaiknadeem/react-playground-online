
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using CodeExam, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do 
              not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use License</h2>
            <p className="text-gray-700 mb-3">
              Permission is granted to temporarily access CodeExam for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for commercial purposes or public display</li>
              <li>Attempt to reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Conduct</h2>
            <p className="text-gray-700 mb-3">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Use the platform for any unlawful purpose</li>
              <li>Attempt to cheat or compromise exam integrity</li>
              <li>Share exam content or answers with others</li>
              <li>Upload malicious code or viruses</li>
              <li>Impersonate other users or provide false information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Exam Integrity</h2>
            <p className="text-gray-700 mb-3">
              CodeExam maintains strict policies regarding exam integrity:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>All exam sessions are monitored for suspicious activity</li>
              <li>Cheating or academic dishonesty will result in immediate disqualification</li>
              <li>Exam content is proprietary and may not be shared or reproduced</li>
              <li>Users must complete exams independently without assistance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Account Termination</h2>
            <p className="text-gray-700">
              We reserve the right to terminate accounts that violate these terms, engage in 
              fraudulent activity, or compromise the platform's integrity. Users may also 
              terminate their accounts at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Disclaimer</h2>
            <p className="text-gray-700">
              The materials on CodeExam are provided on an 'as is' basis. CodeExam makes no 
              warranties, expressed or implied, and hereby disclaims all other warranties 
              including, without limitation, implied warranties of merchantability, fitness for 
              a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitations</h2>
            <p className="text-gray-700">
              In no event shall CodeExam or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use CodeExam.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Information</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@codeexam.com" className="text-blue-600 hover:underline">
                legal@codeexam.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
