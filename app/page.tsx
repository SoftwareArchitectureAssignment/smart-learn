import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BarChart, CheckCircle, Award, BookMarked } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Smart Learn" className="size-9" />
              <span className="text-2xl font-bold text-gray-900">Smart Learn</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
            Transform Your Learning
            <span className="block text-indigo-600">Experience Today</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
            Smart Learn is your intelligent learning management system that adapts to your needs. Track progress, manage
            courses, and achieve your educational goals with ease.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Learning Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Everything You Need to Succeed</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Powerful features designed to make learning and teaching more effective
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <BookMarked className="mb-4 h-12 w-12 text-indigo-600" />
              <CardTitle>Course Management</CardTitle>
              <CardDescription>Create, organize, and manage your courses with an intuitive interface</CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <Users className="mb-4 h-12 w-12 text-indigo-600" />
              <CardTitle>Student Tracking</CardTitle>
              <CardDescription>Monitor student progress and engagement in real-time</CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <BarChart className="mb-4 h-12 w-12 text-indigo-600" />
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>Get detailed insights with comprehensive analytics and reporting</CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <GraduationCap className="mb-4 h-12 w-12 text-indigo-600" />
              <CardTitle>Interactive Learning</CardTitle>
              <CardDescription>Engage students with interactive content and assessments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <Award className="mb-4 h-12 w-12 text-indigo-600" />
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Issue certificates and track student achievements</CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CheckCircle className="mb-4 h-12 w-12 text-indigo-600" />
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>Intuitive design that anyone can use without training</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="bg-indigo-600 text-white">
          <CardContent className="py-12">
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
              <div>
                <div className="mb-2 text-4xl font-bold">10,000+</div>
                <div className="text-indigo-100">Active Students</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold">500+</div>
                <div className="text-indigo-100">Courses Available</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold">95%</div>
                <div className="text-indigo-100">Satisfaction Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="mx-auto mb-16 max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="py-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-indigo-100">
              Join thousands of learners and educators using Smart Learn to achieve their goals
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                Create Free Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <img src="/logo.png" alt="Smart Learn" className="size-9" />
                <span className="text-xl font-bold text-white">Smart Learn</span>
              </div>
              <p className="text-sm">Empowering education through intelligent learning management.</p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-white">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/students" className="hover:text-white">
                    Students
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Smart Learn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
