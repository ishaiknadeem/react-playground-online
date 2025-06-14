
import React from 'react';
import { ArrowLeft, Code, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Exams = () => {
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

      {/* Exams Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Practice Exams
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test your skills with our carefully crafted sample exams designed to challenge and improve your coding abilities
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-2xl max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">JavaScript Challenge</h3>
                    <p className="text-gray-600">Algorithm: Two Sum Problem</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Solve the classic two sum algorithm challenge with optimal time complexity.
                </p>
                <Button 
                  onClick={() => window.location.href = '/exam?id=test123'}
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-full"
                >
                  Start JavaScript Exam
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">React Challenge</h3>
                    <p className="text-gray-600">Component: Counter App</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Build a functional counter component with state management and event handling.
                </p>
                <Button 
                  onClick={() => window.location.href = '/exam?id=id234'}
                  className="w-full bg-green-600 hover:bg-green-700 rounded-full"
                >
                  Start React Exam
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mb-4">
              These are sample exams for demonstration purposes • No registration required
            </p>
            <Link to="/features">
              <Button variant="outline" className="rounded-full">
                Learn More About Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exams;
