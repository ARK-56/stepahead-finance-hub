import { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface RelatedTool {
  title: string;
  href: string;
}

interface SEOSection {
  title: string;
  content: string;
}

interface ToolShellProps {
  title: string;
  description: string;
  children: ReactNode;
  howToUse?: string;
  understandingTitle?: string;
  understandingContent?: string;
  faqs?: FAQ[];
  relatedTools?: RelatedTool[];
  seoSections?: SEOSection[];
}


export default function ToolShell({
  title,
  description,
  children,
  howToUse,
  understandingTitle,
  understandingContent,
  faqs,
  relatedTools,
}: ToolShellProps) {
  return (
    <div>
      {/* Tool header with gradient background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(228,76%,52%,0.06)] via-background to-[hsl(158,64%,42%,0.04)]">
        <div className="absolute inset-0 finance-grid opacity-[0.03]" />
        <div className="container relative py-8 md:py-12">

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-display">{title}</h1>
                <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>
              </div>

              {/* Interactive Tool Card */}
              <div className="relative rounded-2xl border border-border bg-card p-6 md:p-8 mb-10 shadow-md overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--chart-1))] via-[hsl(var(--chart-3))] to-[hsl(var(--chart-4))]" />
                {children}
              </div>
            </div>

            {/* Sticky Sidebar */}
            <aside className="w-full lg:w-[300px] shrink-0">
              <div className="lg:sticky lg:top-20 space-y-6">
                {relatedTools && relatedTools.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <h3 className="font-semibold text-foreground mb-3 font-display text-sm">Related Tools</h3>
                    <ul className="space-y-2.5">
                      {relatedTools.map((tool) => (
                        <li key={tool.href}>
                          <Link
                            to={tool.href}
                            className="flex items-center gap-2 text-sm text-primary hover:underline font-medium group"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                            {tool.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* SEO Content with alternating section backgrounds */}
      {howToUse && (
        <section className="bg-gradient-to-b from-accent/20 via-background to-background">
          <div className="container py-12">
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-foreground mb-3 font-display flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[hsl(var(--chart-1))] to-[hsl(var(--chart-3))]" />
                How to Use This Calculator
              </h2>
              <p className="text-muted-foreground leading-relaxed">{howToUse}</p>
            </div>
          </div>
        </section>
      )}

      {understandingTitle && understandingContent && (
        <section className="bg-gradient-to-b from-[hsl(228,76%,52%,0.03)] via-background to-background">
          <div className="container py-12">
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-foreground mb-3 font-display flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[hsl(var(--chart-4))] to-[hsl(var(--chart-1))]" />
                {understandingTitle}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{understandingContent}</p>
            </div>
          </div>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section className="bg-gradient-to-b from-[hsl(158,64%,42%,0.03)] via-muted/30 to-background">
          <div className="container py-12">
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[hsl(var(--chart-3))] to-[hsl(var(--chart-5))]" />
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                    <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <div className="container pb-12">
        <section className="rounded-xl border border-border bg-muted/40 p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Disclaimer:</span> The results provided by this calculator are estimates for informational and educational purposes only and do not constitute financial, tax, or legal advice. Please consult a qualified professional before making any financial decisions.
          </p>
        </section>
      </div>
    </div>
  );
}
