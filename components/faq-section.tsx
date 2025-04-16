"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// FAQ data with questions and answers
const faqData = [
  {
    question: "What is the Engineering Study Scholarship Test?",
    answer:
      "The Engineering Study Scholarship Test is an examination conducted by REWARD NGO to identify talented students who have passed their MPC (Mathematics, Physics, Chemistry) stream and wish to pursue engineering education. Based on your performance in this test, you may qualify for significant financial assistance for your engineering education.",
  },
  {
    question: "Who is eligible to apply for this scholarship?",
    answer:
      "Students who have successfully passed their MPC (Mathematics, Physics, Chemistry) stream and are looking to pursue a Diploma or Engineering degree are eligible to apply. You must have completed your intermediate education and have valid hall ticket numbers.",
  },
  {
    question: "How much scholarship amount can I receive?",
    answer:
      "The scholarship amount varies based on your rank in the eligibility test. Top 100 rankers receive ₹30,000 for the entire 4-year Engineering Course. Ranks 101-1000 receive ₹20,000, and ranks 1001-3100 receive ₹10,000. Additionally, top performers may receive full tuition and hostel fee coverage.",
  },
  {
    question: "What is the Learning-Doing-Earning (LDE) system?",
    answer:
      "The LDE system integrates theoretical learning with practical application and earning opportunities. Students learn through classroom instruction, apply their knowledge through assignments and practical demonstrations, and may earn compensation for their skills, fostering self-sustainability and career focus.",
  },
  {
    question: "How do I apply for the scholarship?",
    answer:
      "To apply for the scholarship, you need to register on our website, provide your personal and educational details, and then take the eligibility test. Based on your performance in the test, you will be ranked and awarded the scholarship accordingly.",
  },
  {
    question: "When and where will the eligibility test be conducted?",
    answer:
      "The eligibility test is conducted online and can be taken from the comfort of your home. After registration, you will receive details about the test date and time. You will need a computer or mobile device with a stable internet connection to take the test.",
  },
  {
    question: "What subjects will be covered in the eligibility test?",
    answer:
      "The eligibility test covers subjects from the MPC stream: Mathematics, Physics, and Chemistry. The questions are designed to test your understanding of fundamental concepts and problem-solving abilities in these subjects.",
  },
  {
    question: "Is there any registration fee for the scholarship test?",
    answer:
      "No, there is no registration fee for the scholarship test. The test is conducted by REWARD NGO as part of their initiative to support deserving students in pursuing engineering education.",
  },
  {
    question: "What documents do I need to submit during registration?",
    answer:
      "During registration, you need to provide your personal details, educational information including Intermediate and EAMCET hall ticket numbers, and contact information. You may be required to upload supporting documents later in the process.",
  },
  {
    question: "Can I apply if I've already started my engineering course?",
    answer:
      "This scholarship is primarily designed for students who are about to start their engineering education. However, first-year engineering students may also apply. Please contact our support team for specific eligibility criteria in such cases.",
  },
  {
    question: "What happens after I qualify for the scholarship?",
    answer:
      "After qualifying for the scholarship, you will be notified about the next steps. This may include verification of your documents, selection of engineering college, and disbursement of the scholarship amount directly to the institution.",
  },
  {
    question: "Will I receive any additional benefits besides financial assistance?",
    answer:
      "Yes, scholarship recipients also receive benefits like project support (₹5,000 for main projects), entrepreneurship programs, real-time industry experience, potential earning opportunities, and on-campus accommodation support.",
  },
  {
    question: "How is the scholarship amount disbursed?",
    answer:
      "The scholarship amount is typically disbursed directly to your educational institution to cover your tuition fees. Additional benefits like hostel fee coverage and project support are provided as per the scholarship tier you qualify for.",
  },
  {
    question: "Can I lose my scholarship after receiving it?",
    answer:
      "The scholarship is generally awarded for the entire duration of your engineering course. However, you may be required to maintain a certain academic performance level. Specific terms and conditions will be communicated to successful candidates.",
  },
  {
    question: "Who can I contact if I have more questions?",
    answer:
      "If you have any additional questions or need assistance, you can reach out to our support team through the Contact Us page on our website, or email us at support@rewardngo.org.",
  },
]

export default function FAQSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="text-left font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
