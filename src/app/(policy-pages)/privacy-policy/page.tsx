import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Last updated: October 7, 2024</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to Portly.dev. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our portfolio builder service.</p>
          
          <h2>2. Information We Collect</h2>
          <p>We collect information you provide directly to us when you:</p>
          <ul>
            <li>Create an account</li>
            <li>Build your portfolio</li>
            <li>Contact our support team</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our service</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about our service</li>
            <li>Monitor and analyze usage patterns</li>
          </ul>
          
          <h2>4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>
          
          <h2>5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. You can do this through your account settings or by contacting us directly.</p>
          
          <h2>6. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          
          <h2>7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at portly.dev@gmail.com.</p>
        </CardContent>
      </Card>
    </div>
  )
}