import { Link } from "react-router-dom";
import { Shield, Zap, LineChart, Users, Target, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 finance-grid opacity-[0.06]" />
        <div className="container relative text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground font-display tracking-tight">
            About 1StepAhead
          </h1>
          <p className="mt-5 text-primary-foreground/70 max-w-2xl mx-auto text-lg leading-relaxed">
            We build free, professional-grade financial tools that help everyday people make smarter money decisions — without the jargon, without the sign-ups, and without selling your data.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background via-accent/20 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-6">Our Mission</h2>
            <div className="prose prose-lg text-muted-foreground space-y-5 leading-relaxed">
              <p>
                Financial literacy shouldn't be gated behind expensive advisors or confusing spreadsheets. Too many people make critical money decisions — choosing a mortgage, estimating their taxes, planning for retirement — without access to the same tools professionals use every day.
              </p>
              <p>
                1StepAhead was built to change that. Every calculator on this site uses the exact same formulas employed by CPAs, financial planners, and banking institutions. We've stripped away the complexity and wrapped them in clean, intuitive interfaces that anyone can use in seconds.
              </p>
              <p>
                Whether you're a first-time homebuyer comparing rent vs. buy scenarios, a freelancer estimating quarterly tax payments, or a college graduate mapping out student loan repayment strategies, our tools give you the clarity you need to move forward with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[hsl(228,76%,52%,0.03)] via-background to-background">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">What We Stand For</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Six principles that guide every tool we build and every decision we make.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "Privacy by Design", text: "Every calculation runs entirely in your browser. We never transmit, store, or have access to the numbers you enter. No accounts, no cookies tracking your finances, no data monetization — ever." },
              { icon: Zap, title: "Instant & Accurate", text: "Results update in real time as you type. Behind the scenes, we use industry-standard financial mathematics: time-value-of-money formulas, IRS tax bracket schedules, amortization algorithms, and compound interest equations — the same math your bank uses." },
              { icon: LineChart, title: "Deeply Educational", text: "We don't just give you a number. Every tool includes detailed explanations, contextual benchmarks, and expert-level FAQ sections so you understand the 'why' behind the results — not just the 'what.'" },
              { icon: Users, title: "Built for Everyone", text: "Whether you're 22 and just starting your career or 55 and planning retirement, our tools meet you where you are. No financial jargon, no assumptions about your expertise level, and fully responsive on any device." },
              { icon: Target, title: "Actionable Insights", text: "Numbers alone don't help. Our tools provide context: 'Is this tax rate normal?' 'How does this compare to the national average?' 'What would a financial advisor recommend here?' We turn data into decisions." },
              { icon: BookOpen, title: "Always Free, Always Updated", text: "We update tax brackets, contribution limits, and interest rate benchmarks annually to reflect current IRS guidelines and market conditions. Every tool is free with no usage limits, no premium tiers, and no paywalls." },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-7">
                <v.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-foreground mb-2 font-display">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[hsl(158,64%,42%,0.03)] via-muted/30 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-6">How Our Tools Work</h2>
            <div className="prose prose-lg text-muted-foreground space-y-5 leading-relaxed">
              <p>
                Every calculator on 1StepAhead is a standalone, client-side application built with modern web technology. When you enter numbers into any tool, the calculations happen instantly in your browser using JavaScript — nothing is sent to a server.
              </p>
              <p>
                Our financial formulas are sourced from authoritative references: IRS publications for tax brackets and deduction amounts, Federal Reserve data for interest rate benchmarks, Bureau of Labor Statistics data for cost-of-living indices, and standard actuarial tables for retirement projections.
              </p>
              <p>
                We test every formula against known outputs from professional financial software and CPA-prepared tax returns to ensure accuracy. That said, our tools provide estimates for educational purposes — they're designed to help you understand your financial picture, not replace professional advice for complex situations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="relative hero-gradient rounded-3xl p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 finance-grid opacity-[0.06]" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground font-display">
              Start Making Smarter Financial Decisions
            </h2>
            <p className="mt-4 text-primary-foreground/70 max-w-lg mx-auto">
              Explore 19 free tools covering loans, taxes, investing, budgeting, and real estate.
            </p>
            <Link
              to="/"
              className="inline-flex items-center mt-8 px-8 py-3 bg-primary-foreground text-primary rounded-full font-semibold shadow-lg hover:bg-primary-foreground/90 transition-colors"
            >
              Explore All Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
