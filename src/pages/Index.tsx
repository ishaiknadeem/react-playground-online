
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Timer, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Online Coding Exam Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Practice and take coding exams with real-time monitoring, automatic evaluation, and comprehensive feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Code className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Multiple Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Support for JavaScript, React, and more programming challenges with automatic testing.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Timer className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle>Timed Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Real-time countdown timers with automatic submission when time expires.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>Anti-Cheat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tab switching detection and monitoring to ensure exam integrity.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Try Sample Exams</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/exam?id=test123'}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              JavaScript Exam (Two Sum)
            </Button>
            <Button 
              onClick={() => window.location.href = '/exam?id=id234'}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              React Exam (Counter Component)
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            These are sample exams for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
