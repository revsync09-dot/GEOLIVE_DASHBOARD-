import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  ExternalLink,
  Mail,
  Github
} from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { Redirect } from "wouter";

export default function SupportPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  const supportOptions = [
    {
      title: "Discord Community",
      description: "Join our Discord server for real-time support and community discussions",
      icon: SiDiscord,
      action: "Join Server",
      gradient: "from-[#5865F2] to-[#7289DA]",
    },
    {
      title: "Documentation",
      description: "Browse our comprehensive docs for setup guides and feature explanations",
      icon: FileText,
      action: "View Docs",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "GitHub Issues",
      description: "Report bugs or request new features through our GitHub repository",
      icon: Github,
      action: "Open Issue",
      gradient: "from-gray-600 to-gray-800",
    },
    {
      title: "Email Support",
      description: "Contact our support team directly for complex issues",
      icon: Mail,
      action: "Send Email",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const faqs = [
    {
      question: "How do I add GeoLive to my server?",
      answer: "Click the 'Add to Discord' button on our website and select the server you want to add GeoLive to. Make sure you have the Manage Server permission.",
    },
    {
      question: "Why aren't my feeds appearing?",
      answer: "Check that you've enabled the feeds in your server settings and that the bot has permission to send messages in the configured channel.",
    },
    {
      question: "How do I change the feed update interval?",
      answer: "Go to your server settings in this dashboard and adjust the 'Update Interval' slider to your preferred frequency (5-60 minutes).",
    },
    {
      question: "Is my location data stored?",
      answer: "Location data is only used to provide localized geo feeds and is stored temporarily in your session. We don't permanently store or share your location.",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-light tracking-tight text-foreground" data-testid="text-support-title">
            <span className="font-semibold">𝙂𝙚𝙤𝙇𝙞𝙫𝙚</span> Support
          </h1>
          <p className="mt-1 text-muted-foreground" data-testid="text-support-subtitle">
            Get help and find answers to common questions
          </p>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-testid="container-support-options">
          {supportOptions.map((option, index) => (
            <Card 
              key={option.title}
              className="border-white/10 bg-white/5 backdrop-blur-lg transition-all hover:scale-[1.02] hover:border-primary/30"
              data-testid={`card-support-option-${index}`}
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${option.gradient} shadow-lg`}>
                  <option.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 font-medium text-foreground" data-testid={`text-support-title-${index}`}>{option.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{option.description}</p>
                <Button variant="outline" size="sm" className="gap-2" data-testid={`button-support-action-${index}`}>
                  {option.action}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <div className="mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-medium text-foreground" data-testid="text-faq-title">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid gap-4 lg:grid-cols-2" data-testid="container-faqs">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-lg" data-testid={`card-faq-${index}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-start gap-2 text-base font-medium" data-testid={`text-faq-question-${index}`}>
                    <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground" data-testid={`text-faq-answer-${index}`}>{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
