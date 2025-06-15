
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Play, Users, Clock, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CodeExam</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/candidate-login">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Admin Portal
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section with Coding Pattern */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Practice • Learn • Excel
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Master
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Coding Skills
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Practice coding challenges, take timed exams, and improve your programming skills with our interactive platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => window.location.href = '/exam?id=test123'}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Practice
                </Button>
                <Link to="/candidate-login">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 text-lg border-2 hover:bg-gray-50"
                  >
                    View Challenges
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Challenges</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">1K+</div>
                  <div className="text-sm text-gray-600">Developers</div>
                </div>
              </div>
            </div>

            {/* Right Content - Code Pattern */}
            <div className="relative">
              <div className="bg-gray-900 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-gray-400 text-sm">algorithm.js</div>
                </div>
                <div className="font-mono text-sm space-y-2">
                  <div className="text-purple-400">function <span className="text-blue-400">twoSum</span><span className="text-gray-300">(nums, target) {</span></div>
                  <div className="text-gray-400 ml-4">// Find two numbers that add up to target</div>
                  <div className="text-blue-400 ml-4">const <span className="text-gray-300">map = new Map();</span></div>
                  <div className="text-purple-400 ml-4">for <span className="text-gray-300">(let i = 0; i &lt; nums.length; i++) {</span></div>
                  <div className="text-blue-400 ml-8">const <span className="text-gray-300">complement = target - nums[i];</span></div>
                  <div className="text-purple-400 ml-8">if <span className="text-gray-300">(map.has(complement)) {</span></div>
                  <div className="text-green-400 ml-12">return <span className="text-gray-300">[map.get(complement), i];</span></div>
                  <div className="text-gray-300 ml-8">}</div>
                  <div className="text-gray-300 ml-8">map.set(nums[i], i);</div>
                  <div className="text-gray-300 ml-4">}</div>
                  <div className="text-gray-300">}</div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Code2 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools for coding practice and assessment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Languages</h3>
                <p className="text-gray-600 mb-4">
                  Support for JavaScript, React, Python, and more with real-time execution.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">JavaScript</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Python</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Timed Challenges</h3>
                <p className="text-gray-600 mb-4">
                  Real-time countdown timers with automatic submission and instant feedback.
                </p>
                <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>Auto-save progress</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Testing</h3>
                <p className="text-gray-600 mb-4">
                  Advanced anti-cheat measures with activity tracking for fair assessment.
                </p>
                <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>Integrity guaranteed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Coding?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers improving their skills every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/exam?id=test123'}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3"
              >
                Start Free Practice
              </Button>
              <Link to="/candidate-login">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                >
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CodeExam</span>
            </div>
            <p className="text-gray-400">
              Built for developers, by developers. Practice, learn, and excel.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
