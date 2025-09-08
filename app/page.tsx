import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { DollarSign, BarChart3, CreditCard, PieChart, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <DollarSign className="h-5 w-5" />
          <span>FinanceTrack</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
          </nav>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 md:py-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Take Control of Your <span className="text-primary">Finances</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Track your income, expenses, and savings all in one place. Make smarter financial decisions with
              FinanceTrack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-full p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Income Tracking</h3>
                <p className="text-muted-foreground">
                  Record and categorize all your income sources to understand where your money comes from.
                </p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expense Management</h3>
                <p className="text-muted-foreground">
                  Track your spending habits and identify areas where you can cut back and save more.
                </p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Financial Reports</h3>
                <p className="text-muted-foreground">
                  Generate detailed reports and visualizations to gain insights into your financial health.
                </p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <PieChart className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Budget Planning</h3>
                <p className="text-muted-foreground">
                  Create and manage budgets to help you reach your financial goals and avoid overspending.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to take control of your finances?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who have improved their financial well-being with FinanceTrack.
            </p>
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/register">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/roadmap" className="text-sm text-muted-foreground hover:text-foreground">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-sm text-muted-foreground hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FinanceTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
