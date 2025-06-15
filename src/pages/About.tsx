
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code2, Users, Target, Shield, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const features = [
    {
      icon: Code2,
      title: "Multi-Language Support",
      description: "Support for JavaScript, React, TypeScript and more programming languages"
    },
    {
      icon: Shield,
      title: "Secure Testing",
      description: "Advanced anti-cheat measures and secure exam environment"
    },
    {
      icon: Zap,
      title: "Real-Time Execution",
      description: "Instant code execution and immediate feedback"
    },
    {
      icon: Award,
      title: "Comprehensive Analytics",
      description: "Detailed performance tracking and progress monitoring"
    }
  ];

  const team = [
    {
      name: "Development Team",
      role: "Full-Stack Development",
      description: "Building robust and scalable coding assessment platform"
    },
    {
      name: "Education Experts",
      role: "Curriculum Design",
      description: "Creating effective learning paths and assessment methods"
    },
    {
      name: "Security Specialists",
      role: "Platform Security",
      description: "Ensuring exam integrity and data protection"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About CodeExam</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering developers and organizations with comprehensive coding assessment and practice platform
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                CodeExam is dedicated to revolutionizing how coding skills are assessed and developed. 
                We believe that fair, comprehensive, and secure evaluation is crucial for both 
                individual growth and organizational success.
              </p>
              <p className="text-gray-700">
                Our platform bridges the gap between learning and professional application, providing 
                tools that benefit educators, employers, and developers alike.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-24 h-24 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">What Makes Us Different</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600">
                Maintaining the highest standards of exam security and fairness in all assessments.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600">
                Making coding assessment accessible to everyone, regardless of background or experience level.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Continuously improving our platform with cutting-edge technology and user feedback.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-8">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-100">Coding Challenges</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5</div>
              <div className="text-blue-100">Programming Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1K+</div>
              <div className="text-blue-100">Active Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
