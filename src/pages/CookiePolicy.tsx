
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookiePolicy = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What Are Cookies</h2>
            <p className="text-gray-700">
              Cookies are small text files that are stored on your computer or mobile device when you 
              visit a website. They help us provide you with a better experience by remembering your 
              preferences and understanding how you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Cookies</h2>
            <p className="text-gray-700 mb-3">CodeExam uses cookies for several purposes:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Essential Cookies:</strong> Required for basic site functionality and security</li>
              <li><strong>Authentication Cookies:</strong> Keep you logged in during your session</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                <p className="text-gray-700 text-sm">
                  These cookies are necessary for the website to function properly. They include 
                  session management, authentication, and security features.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900">Functional Cookies</h3>
                <p className="text-gray-700 text-sm">
                  These cookies enable enhanced functionality like remembering your language 
                  preferences, exam settings, and dashboard layout.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                <p className="text-gray-700 text-sm">
                  These cookies help us understand how visitors use our website, which pages 
                  are most popular, and how we can improve the user experience.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">Performance Cookies</h3>
                <p className="text-gray-700 text-sm">
                  These cookies collect information about how you use our website to help us 
                  improve performance and fix any issues.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Managing Cookies</h2>
            <p className="text-gray-700 mb-3">
              You have several options for managing cookies:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Use your browser settings to block or delete cookies</li>
              <li>Set your browser to notify you when cookies are being sent</li>
              <li>Use our cookie preference center (if available)</li>
              <li>Opt out of analytics cookies through your account settings</li>
            </ul>
            <p className="text-gray-700 mt-3 text-sm bg-yellow-50 border border-yellow-200 rounded p-3">
              <strong>Note:</strong> Blocking essential cookies may affect the functionality of CodeExam 
              and prevent you from using certain features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Cookies</h2>
            <p className="text-gray-700 mb-3">
              We may use third-party services that place cookies on your device:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Analytics Services:</strong> To understand user behavior and improve our platform</li>
              <li><strong>Authentication Providers:</strong> For secure login functionality</li>
              <li><strong>Content Delivery Networks:</strong> To improve site performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookie Retention</h2>
            <p className="text-gray-700 mb-3">Different cookies have different retention periods:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain until their expiration date or manual deletion</li>
              <li><strong>Authentication Cookies:</strong> Typically expire after 30 days of inactivity</li>
              <li><strong>Preference Cookies:</strong> May persist for up to 1 year</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Updates to This Policy</h2>
            <p className="text-gray-700">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for legal compliance. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about our use of cookies, please contact us at{' '}
              <a href="mailto:privacy@codeexam.com" className="text-blue-600 hover:underline">
                privacy@codeexam.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
