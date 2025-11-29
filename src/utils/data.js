import { BarChart2, FileText, Mail, Sparkles, LayoutDashboard, Users, Plus, Building2, FileCheck } from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Invoice Creation",
    description:
      "Generate professional invoices instantly using AI — smart, fast, and error-free.",
  },
  {
    icon: FileText,
    title: "Custom Templates",
    description:
      "Personalize your invoices with branded templates and professional layouts.",
  },
  {
    icon: Mail,
    title: "Instant Delivery",
    description:
      "Send invoices directly to clients via email with a single click.",
  },
  {
    icon: BarChart2,
    title: "Analytics & Tracking",
    description:
      "Track payments, view insights, and manage your billing performance easily.",
  },
];
export const TESTIMONIALS = [
  {
    quote:
      "Invoice Generator has completely streamlined our billing process. It's fast, accurate, and user-friendly. We save hours every month!",
    author: "Sarah Miller",
    title: "Operations Manager, Tech Innovators Inc.",
    avatar: "https://placehold.co/100x100.png?text=SM",
  },
  {
    quote:
      "I've been using Invoice Generator for over six months, and it's made managing our invoices a breeze. Highly recommend it to any small business owner.",
    author: "John Smith",
    title: "Founder, GreenTech Solutions",
    avatar: "https://placehold.co/100x100.png?text=JS",
  },
  {
    quote:
      "The customization options are great! I can tailor each invoice to fit our brand, and the automatic reminders help keep our payments on track.",
    author: "Emily Davis",
    title: "Finance Director, Creative Works Ltd.",
    avatar: "https://placehold.co/100x100.png?text=ED",
  },
];

export const FAQS = [
  {
    question: "What is the Invoice Generator app?",
    answer:
      "The Invoice Generator app allows you to quickly create, customize, and download professional invoices for your business or freelance work.",
  },
  {
    question: "Do I need an account to create an invoice?",
    answer:
      "No, you can create and download invoices without creating an account. However, registering allows you to save and manage your invoices online.",
  },
  {
    question: "Can I customize the invoice template?",
    answer:
      "Yes, you can easily customize your invoice by adding your logo, changing colors, editing fields, and choosing your preferred currency.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use secure servers and encryption to protect your information. Your invoices are stored privately and never shared.",
  },
  {
    question: "Can I send invoices directly to clients?",
    answer:
      "Yes, once your invoice is ready, you can email it directly to your client or download it as a PDF to send manually.",
  },
  {
    question: "Is the app free to use?",
    answer:
      "Yes, the basic features are free. Premium features such as invoice tracking, recurring billing, and cloud storage are available with a subscription.",
  },
];
//Navigation links

export const NAV_LINKS = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "invoices", name: "Invoices", icon: FileText },
  { id: "quotes", name: "Estimates", icon: FileCheck },
  { id: "clients", name: "Clients", icon: Users },
  { id: "companies", name: "Companies", icon: Building2 },
  { id: "profile", name: "Profile", icon: Users },
];
