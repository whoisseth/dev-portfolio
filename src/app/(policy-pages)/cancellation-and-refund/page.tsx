import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CancellationAndRefund() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Cancellation and Refund Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Last updated: October 7, 2024</p>
          
          <h2>1. Free Service</h2>
          <p>Portly.dev is primarily a free service. For free accounts, there are no charges and thus no refunds applicable.</p>
          
          <h2>2. Premium Features</h2>
          <p>If we introduce any premium features in the future:</p>
          <ul>
            <li>Cancellations for premium features will be handled on a case-by-case basis.</li>
            <li>Refunds, if applicable, will be processed within 14 business days of approval.</li>
          </ul>
          
          <h2>3. Donations</h2>
          <p>Donations made to support Portly.dev are generally non-refundable. However, in exceptional circumstances, we may consider refund requests for donations.</p>
          
          <h2>4. Account Deletion</h2>
          <p>You can delete your account at any time. Upon deletion, all your data will be permanently removed from our systems.</p>
          
          <h2>5. Contact Us</h2>
          <p>If you have any questions about our Cancellation and Refund Policy, please contact us at portly.dev@gmail.com.</p>
        </CardContent>
      </Card>
    </div>
  )
}