
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Timer, Users, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Code className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CodeExam</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#exams" className="text-gray-600 hover:text-blue-600 transition-colors">Exams</a>
            <Button variant="outline" size="sm">Sign In</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Master Coding
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              With Confidence
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Practice coding challenges, take timed exams, and improve your programming skills with our comprehensive platform designed for developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => window.location.href = '/exam?id=test123'}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Start Practice Exam
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 rounded-full border-2 hover:bg-gray-50 transition-all"
            >
              View Sample Questions
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform provides comprehensive tools for coding practice and assessment
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
      </section>

      {/* Sample Exams Section */}
      <section id="exams" className="container mx-auto px-4 py-20">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Try Sample Exams
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Test your skills with our carefully crafted sample exams designed to challenge and improve your coding abilities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
            <p className="text-sm text-gray-500">
              These are sample exams for demonstration purposes • No registration required
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Code className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">CodeExam</span>
        </div>
        <p className="text-gray-600">
          Built for developers, by developers. Practice, learn, and excel in your coding journey.
        </p>
      </footer>
    </div>
  );
};

export default Index;
