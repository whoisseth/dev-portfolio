import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {};

const faqData = [
  {
    question: "How do I create a portfolio?",
    answer:
      "Click 'Create your Portfolio' and follow our easy step-by-step guide. You'll have a professional, developer-focused portfolio ready in just a minute!",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes, our platform is completely free to use. There are no hidden fees or premium plans.",
  },
  {
    question: "How long does it take to set up?",
    answer:
      "It takes approximately 1 minute to set up and have your portfolio ready for use. Our platform is designed for quick and easy setup.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Not yet, but this feature is coming soon. Stay tuned for future updates!",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption and security practices to keep your data safe. You can trust us to protect your information.",
  },
  {
    question: "Can I create multiple portfolios?",
    answer: "No, each user can only create one portfolio.",
  },
];

export default function FAQSection({}: Props) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 px-2">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((faq, index) => (
          <AccordionItem value={`item-${index + 1}`} key={index}>
            <AccordionTrigger className="text-lg">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
