import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Heart, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function SupportProject() {
  return (
    <section className="w-full bg-background py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Support Our Mission
            </h2>
            <p className="max-w-[900px] text-lg text-muted-foreground sm:text-xl">
              Your contribution fuels the continuous improvement and innovation
              of our open-source project. Together, we can create more value for
              our growing community of developers and creators.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <Card className="flex flex-col items-center space-y-4 p-6 text-center">
            <Heart className="h-12 w-12 text-primary" />
            <CardHeader className="p-0">
              <CardTitle>Empower Growth</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground">
                Support the development of new features and improvements.
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center space-y-4 p-6 text-center">
            <Users className="h-12 w-12 text-primary" />
            <CardHeader className="p-0">
              <CardTitle>Strengthen Community</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground">
                Help us foster a vibrant and supportive developer ecosystem.
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center space-y-4 p-6 text-center">
            <Zap className="h-12 w-12 text-primary" />
            <CardHeader className="p-0">
              <CardTitle>Accelerate Innovation</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground">
                Enable us to push the boundaries of what's possible in web
                development.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col justify-center gap-2 md:flex-row">
          <Link
            href="/support-us"
            className={cn(
              buttonVariants({ variant: "default" }),
              "px-8 py-3 text-lg",
            )}
          >
            Contribute Now
          </Link>
        </div>
      </div>
    </section>
  );
}
