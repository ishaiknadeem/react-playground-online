import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Users, Shield, Clock, CheckCircle, Star, ChevronDown, ChevronUp, Play, Target, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const IndexContent = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "How does the online proctoring work?",
      answer: "Our advanced proctoring system uses webcam monitoring, screen recording, and AI-powered behavior analysis to ensure exam integrity while maintaining candidate privacy."
    },
    {
      question: "Is the platform secure?",
      answer: "Yes, we use industry-standard encryption and security protocols to protect your data and ensure a safe testing environment."
    },
    {
      question: "Can I customize the exams?",
      answer: "Absolutely! Our platform allows you to fully customize exams with your own questions, time limits, and difficulty levels."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide 24/7 support via email, phone, and live chat to assist you with any questions or issues you may have."
    },
    {
      question: "How do I get started?",
      answer: "Simply sign up for an account, create your first exam, and invite candidates to begin testing. It's that easy!"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold">CodeExam</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <ThemeToggle />
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle className="md:hidden" />
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Elevate Your Coding Skills with CodeExam
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            The ultimate platform for online coding exams, practice problems, and skill development.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg">Start Testing Today <ArrowRight className="ml-2" /></Button>
            </Link>
            <Link to="/practice">
              <Button variant="outline" size="lg">Practice Coding <Code className="ml-2" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-blue-50 dark:bg-blue-950 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-50 flex items-center justify-center">
                <Users className="mr-2 w-6 h-6" /> 500+
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Happy Examiners
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-900 dark:text-green-50 flex items-center justify-center">
                <Shield className="mr-2 w-6 h-6" /> Secure
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Exams Conducted
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-yellow-50 dark:bg-yellow-950 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-yellow-900 dark:text-yellow-50 flex items-center justify-center">
                <Clock className="mr-2 w-6 h-6" /> 99.9%
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Uptime Guarantee
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-slate-900 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <CheckCircle className="mr-2 w-5 h-5 text-green-500" /> Online Proctoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Advanced proctoring with webcam monitoring and screen recording.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Code className="mr-2 w-5 h-5 text-blue-500" /> Code Execution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Real-time code execution and testing in a secure environment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Clock className="mr-2 w-5 h-5 text-yellow-500" /> Time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Detailed time tracking and performance analysis for each candidate.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-50 dark:bg-slate-800 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Target className="mr-2 w-5 h-5 text-red-500" /> Adaptive Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Automatically adjusts the difficulty of questions based on candidate performance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-slate-800 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Zap className="mr-2 w-5 h-5 text-purple-500" /> Instant Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Provides immediate feedback and scoring after each question.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-slate-800 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Award className="mr-2 w-5 h-5 text-blue-500" /> Certification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Generates professional certifications upon successful completion of exams.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mx-auto flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Exam</h3>
              <p className="text-gray-700 dark:text-gray-300">Design your coding exam with custom questions and settings.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mx-auto flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Invite Candidates</h3>
              <p className="text-gray-700 dark:text-gray-300">Invite candidates to take the exam through a secure link.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mx-auto flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Get Results</h3>
              <p className="text-gray-700 dark:text-gray-300">Receive detailed results and insights on candidate performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-50 dark:bg-slate-800 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                  "CodeExam has revolutionized our hiring process. The online proctoring and code execution features ensure we get the best talent."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800 mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">John Doe</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">CTO, Tech Solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-slate-800 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                  "The platform is incredibly user-friendly and the support team is always available to help. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-200 dark:bg-green-800 mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Jane Smith</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">HR Manager, Innovate Corp</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section - Hidden */}
      <section className="hidden py-20 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
            Pricing Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-slate-900 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Basic</CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">$99/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                  <li>5 Exams</li>
                  <li>Basic Proctoring</li>
                  <li>Email Support</li>
                </ul>
                <Button className="w-full mt-4">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Standard</CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">$199/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                  <li>20 Exams</li>
                  <li>Advanced Proctoring</li>
                  <li>Phone Support</li>
                </ul>
                <Button className="w-full mt-4">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Premium</CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">$399/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                  <li>Unlimited Exams</li>
                  <li>AI Proctoring</li>
                  <li>24/7 Support</li>
                </ul>
                <Button className="w-full mt-4">Get Started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <CardTitle className="text-lg font-semibold">
                    {faq.question}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    {openFaq === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CardHeader>
                {openFaq === index && (
                  <CardContent className="p-4">
                    <CardDescription>{faq.answer}</CardDescription>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-blue-600 dark:bg-blue-700">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-white mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-12">
            Join CodeExam today and revolutionize your coding assessment process.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">Sign Up Now <ArrowRight className="ml-2" /></Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 dark:bg-slate-950 text-white">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">CodeExam</h4>
            <p className="text-gray-400">
              The ultimate platform for online coding exams and skill development.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="text-gray-400">
              <li><Link to="/" className="hover:text-blue-300">Home</Link></li>
              <li><Link to="/features" className="hover:text-blue-300">Features</Link></li>
              <li><Link to="/about" className="hover:text-blue-300">About</Link></li>
              <li><Link to="/contact" className="hover:text-blue-300">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Contact Us</h4>
            <p className="text-gray-400">Email: support@codeexam.com</p>
            <p className="text-gray-400">Phone: (123) 456-7890</p>
            <p className="text-gray-400">Address: 123 Main St, Anytown USA</p>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500">
          &copy; {new Date().getFullYear()} CodeExam. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
