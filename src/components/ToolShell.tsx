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
  <div className={`ad-slot rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground text-sm ${className}`}>
    <span className="font-medium mb-1">Ad Space</span>
    <span className="text-xs">{label}</span>
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
      {/* Leaderboard Ad above title */}
      <AdSlot label="728×90 Leaderboard" className="h-[90px] mb-8" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>
          </div>

          {/* Interactive Tool Card */}
          <div className="surface-elevated rounded-xl p-6 md:p-8 mb-10">
            {children}
          </div>

          {/* SEO Content Sections */}
          {howToUse && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-3">How to Use This Calculator</h2>
              <p className="text-muted-foreground leading-relaxed">{howToUse}</p>
            </section>
          )}

          {understandingTitle && understandingContent && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-3">{understandingTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{understandingContent}</p>
            </section>
          )}

          {/* In-Content Ad between Understanding and FAQ */}
          {faqs && faqs.length > 0 && (
            <AdSlot label="In-Content Ad — 728×90" className="h-[90px] mb-8" />
          )}

          {/* FAQ Accordion */}
          {faqs && faqs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}
        </div>

        {/* Sticky Sidebar */}
        <aside className="w-full lg:w-[300px] shrink-0">
          <div className="lg:sticky lg:top-20 space-y-6">
            <AdSlot label="300×600 Half Page" className="min-h-[600px]" />

            {relatedTools && relatedTools.length > 0 && (
              <div className="surface-elevated rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-3">Related Tools</h3>
                <ul className="space-y-2">
                  {relatedTools.map((tool) => (
                    <li key={tool.href}>
                      <Link
                        to={tool.href}
                        className="text-sm text-primary hover:underline"
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
