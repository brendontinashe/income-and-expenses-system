import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, BarChart3, PieChart, DollarSign, TrendingUp, Shield, Clock } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <DollarSign className="h-5 w-5" />
            <span>FinanceTrack</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register" className="hidden md:block">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col gap-4 md:gap-6 md:w-1/2">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Manage Your Finances with Confidence</h1>
              <p className="text-muted-foreground text-base md:text-xl">
                Track income, manage expenses, and gain insights into your financial health with our comprehensive
                financial management system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-full aspect-video overflow-hidden rounded-lg border shadow-xl">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  alt="Dashboard Preview"
                  width={1280}
                  height={720}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
              <p className="text-muted-foreground md:text-lg max-w-[800px]">
                Our comprehensive financial management system provides everything you need to take control of your
                finances.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Income Tracking</h3>
                  <p className="text-muted-foreground">
                    Easily record and categorize all sources of income with detailed tracking and reporting.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Expense Management</h3>
                  <p className="text-muted-foreground">
                    Track and categorize expenses, set budgets, and identify areas where you can save money.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Detailed Reports</h3>
                  <p className="text-muted-foreground">
                    Generate comprehensive reports with visual charts to understand your financial patterns.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Secure Access</h3>
                  <p className="text-muted-foreground">
                    Role-based access control ensures your financial data is only accessible to authorized users.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Historical Data</h3>
                  <p className="text-muted-foreground">
                    Access your complete financial history with powerful search and filtering capabilities.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Commission Tracking</h3>
                  <p className="text-muted-foreground">
                    Track commissions on income and expenses with detailed breakdowns and reports.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
              <p className="text-muted-foreground md:text-lg max-w-[800px]">
                Discover how FinanceTrack has helped businesses and individuals take control of their finances.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-yellow-500"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">
                      "This system has transformed how we track our company finances. The reporting features are
                      exceptional and have saved us countless hours of work."
                    </p>
                    <div className="mt-4">
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">CFO, Tech Innovations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-yellow-500"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">
                      "As a small business owner, keeping track of finances was always a challenge. This system makes it
                      simple and intuitive. Highly recommended!"
                    </p>
                    <div className="mt-4">
                      <p className="font-semibold">Michael Chen</p>
                      <p className="text-sm text-muted-foreground">Owner, Chen's Bakery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-yellow-500"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">
                      "The role-based access control is perfect for our team. I can give different permissions to staff
                      members while maintaining control over sensitive financial data."
                    </p>
                    <div className="mt-4">
                      <p className="font-semibold">Jessica Williams</p>
                      <p className="text-sm text-muted-foreground">Director, Global Enterprises</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center gap-6">
            <h2 className="text-3xl font-bold tracking-tight">Ready to Take Control of Your Finances?</h2>
            <p className="text-primary-foreground/80 md:text-lg max-w-[800px]">
              Join thousands of businesses and individuals who have transformed their financial management with our
              system.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="mt-4">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 md:py-12 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-xl">
                <DollarSign className="h-5 w-5" />
                <span>FinanceTrack</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive income and expenditure management system for businesses and individuals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FinanceTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
