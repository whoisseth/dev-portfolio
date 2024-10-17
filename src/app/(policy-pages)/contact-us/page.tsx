import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">We're here to help! If you have any questions, concerns, or feedback about Portly.dev, please don't hesitate to reach out to us.</p>
          
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message here..." />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Other Ways to Reach Us</h3>
            <p>Email: portly.dev@gmail.com</p>
            <p>Twitter: <a href="https://x.com/reactdevutkarsh" className="text-blue-500 hover:underline">@reactdevutkarsh</a></p>
            <p>GitHub: <a href="https://github.com/whoisseth/dev-portfolio" className="text-blue-500 hover:underline">github.com/whoisseth/dev-portfolio</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}