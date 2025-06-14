
import React from 'react';
import { ArrowLeft, Code, Timer, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header with Back Button */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Code className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CodeExam</span>
          </div>
        </div>
      </header>

      {/* Features Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Platform Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the powerful features that make CodeExam the perfect platform for coding assessments and practice
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Multiple Languages</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Support for JavaScript, React, Python, and more programming languages with real-time code execution.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">JavaScript</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">React</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Python</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Timer className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Timed Challenges</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Real-time countdown timers with automatic submission and instant feedback on your performance.
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4" />
                <span>Auto-save progress</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Secure Testing</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Advanced anti-cheat measures including tab monitoring and activity tracking for fair assessment.
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4" />
                <span>Integrity guaranteed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/exams">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 rounded-full">
              Try Sample Exams
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Features;
