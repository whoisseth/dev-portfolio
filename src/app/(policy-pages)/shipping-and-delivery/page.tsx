import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShippingAndDelivery() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Shipping and Delivery Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Last updated: October 7, 2024</p>
          
          <h2>1. Digital Service</h2>
          <p>Portly.dev is a digital service that provides portfolio building tools for developers. As such, we do not ship physical products or have a traditional delivery process.</p>
          
          <h2>2. Account Access</h2>
          <p>Upon creating an account, you will have immediate access to our portfolio building tools.</p>
          
          <h2>3. Portfolio Availability</h2>
          <p>Once you create and publish your portfolio, it will be immediately available at your custom URL (portly.dev/username).</p>
          
          <h2>4. Service Interruptions</h2>
          <p>While we strive for 100% uptime, there may be occasional service interruptions due to maintenance or unforeseen technical issues. We will work to resolve any such issues as quickly as possible.</p>
          
          <h2>5. Updates and New Features</h2>
          <p>Any updates or new features will be automatically available to all users as soon as they are released.</p>
          
          <h2>6. Contact Us</h2>
          <p>If you have any questions about accessing our service or your portfolio, please contact us at portly.dev@gmail.com.</p>
        </CardContent>
      </Card>
    </div>
  )
}