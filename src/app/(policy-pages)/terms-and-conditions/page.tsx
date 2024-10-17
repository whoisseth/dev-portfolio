import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Terms and Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>Last updated: October 7, 2024</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Portly.dev, you agree to be bound by these
            Terms and Conditions.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Portly.dev is an open-source portfolio builder for developers. We
            provide tools for creating, managing, and sharing personalized
            portfolios.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account and password. You agree to accept responsibility for all
            activities that occur under your account.
          </p>

          <h2>4. User Content</h2>
          <p>
            You retain all rights to the content you upload to Portly.dev. By
            uploading content, you grant us a non-exclusive license to use,
            display, and distribute your content.
          </p>

          <h2>5. Prohibited Uses</h2>
          <p>
            You agree not to use Portly.dev for any unlawful purpose or in any
            way that could damage, disable, overburden, or impair our service.
          </p>

          <h2>6. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account and access
            to Portly.dev at our sole discretion, without notice, for conduct
            that we believe violates these Terms and Conditions or is harmful to
            other users, us, or third parties, or for any other reason.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any
            time. We will notify users of any significant changes.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please
            contact us at portly.dev@gmail.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
