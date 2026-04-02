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

const AdSlot = ({ label, className = "" }: { label: string; className?: string }) => (
  <div className={`ad-slot rounded-xl p-4 flex flex-col items-center justify-center text-muted-foreground text-xs ${className}`}>
    <span className="font-medium mb-0.5">Ad Space</span>
    <span>{label}</span>
  </div>
);

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
    <div className="container py-8 md:py-12">
      <AdSlot label="728×90 Leaderboard" className="h-[90px] mb-8" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-display">{title}</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>
          </div>

          {/* Interactive Tool Card */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-10 shadow-sm">
            {children}
          </div>

          {/* SEO Content */}
          {howToUse && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-3 font-display">How to Use This Calculator</h2>
              <p className="text-muted-foreground leading-relaxed">{howToUse}</p>
            </section>
          )}

          {understandingTitle && understandingContent && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-3 font-display">{understandingTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{understandingContent}</p>
            </section>
          )}

          {faqs && faqs.length > 0 && (
            <AdSlot label="In-Content Ad — 728×90" className="h-[90px] mb-8" />
          )}

          {faqs && faqs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 font-display">Frequently Asked Questions</h2>
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
            </section>
          )}

          {/* Disclaimer */}
          <section className="mt-10 rounded-xl border border-border bg-muted/40 p-5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Disclaimer:</span> The results provided by this calculator are estimates for informational and educational purposes only and do not constitute financial, tax, or legal advice. Please consult a qualified professional before making any financial decisions.
            </p>
          </section>
        </div>

        {/* Sticky Sidebar */}
        <aside className="w-full lg:w-[300px] shrink-0">
          <div className="lg:sticky lg:top-20 space-y-6">
            <AdSlot label="300×600 Half Page" className="min-h-[600px]" />

            {relatedTools && relatedTools.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-3 font-display text-sm">Related Tools</h3>
                <ul className="space-y-2.5">
                  {relatedTools.map((tool) => (
                    <li key={tool.href}>
                      <Link
                        to={tool.href}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        {tool.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <AdSlot label="300×250 Medium Rectangle" className="min-h-[250px]" />
          </div>
        </aside>
      </div>
    </div>
  );
}
