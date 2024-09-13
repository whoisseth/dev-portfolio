"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Calendar,
  Building2,
  Download,
} from "lucide-react";

import { useReactToPrint } from "react-to-print";

const PrintStyles = () => (
  <style>
    {`
      @media print {
        body {
          background: white;
          color: black;
          font-size: 12pt;
          line-height: 1.3;
        }
        .container {
          width: 100%;
          max-width: none;
          padding: 0;
          margin: 0;
        }
        .card {
          border: none;
          box-shadow: none;
          margin-bottom: 20px;
        }
        h1, h2, h3, .card-title {
          color: black;
          font-weight: bold;
        }
        .badge {
          border: 1px solid black;
          color: black !important;
          background: white !important;
        }
        .progress {
          border: 1px solid black;
        }
        .progress-value {
          background-color: black;
        }
        a {
          color: black;
          text-decoration: underline;
        }
        .separator {
          border-color: black;
        }
        .avatar {
          border: 1px solid black;
        }
        .print-button {
          display: none;
        }
      }
    `}
  </style>
);

export function ResumeDisplay() {
  // const resumeRef = useRef(null);
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: "John_Doe_Resume",
  });

  return (
    <div className="container mx-auto min-h-screen p-4">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="mb-4 flex justify-end">
          <Button
            // onClick={handleDownload}
            onClick={handlePrint}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
        {/* <div ref={resumeRef} className="space-y-6"> */}
        <div ref={contentToPrint} className="space-y-6">
          <Card className="w-full">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:flex-row">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src="/placeholder.svg?height=128&width=128"
                    alt="John Doe"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="mb-2 text-3xl font-bold">John Doe</h1>
                  <p className="mb-4 text-gray-500">Software Engineer</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span>john.doe@example.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>New York, NY</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-5 w-5 text-gray-400" />
                      <span>linkedin.com/in/johndoe</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <span>johndoe.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">
                  Bachelor of Science in Computer Science
                </h3>
                <p className="text-sm text-gray-500">
                  University of Technology
                </p>
                <div className="mt-1 flex justify-between text-sm text-gray-500">
                  <span>New York, NY</span>
                  <span>Sep 2016 - Jun 2020</span>
                </div>
                <p className="mt-1 text-sm">GPA: 3.8/4.0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">Senior Software Engineer</h3>
                    <p className="text-sm text-gray-500">TechCorp Inc.</p>
                  </div>
                  <Badge className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                    Present
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="h-4 w-4" />
                  <span>New York, NY</span>
                  <Calendar className="ml-2 h-4 w-4" />
                  <span>Jan 2022 - Present</span>
                </div>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  <li>
                    Led the development of a high-performance web application
                  </li>
                  <li>Mentored junior developers and conducted code reviews</li>
                  <li>
                    Implemented CI/CD pipelines, reducing deployment time by 50%
                  </li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold">Software Engineer</h3>
                <p className="text-sm text-gray-500">InnoSoft Solutions</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                  <Calendar className="ml-2 h-4 w-4" />
                  <span>Jul 2020 - Dec 2021</span>
                </div>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  <li>
                    Developed and maintained RESTful APIs for mobile
                    applications
                  </li>
                  <li>
                    Optimized database queries, improving application
                    performance by 30%
                  </li>
                  <li>
                    Collaborated with cross-functional teams to deliver projects
                    on time
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">JavaScript</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <Progress value={90} className="w-full" />
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">React</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="w-full" />
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">Node.js</span>
                  <span className="text-sm font-medium">80%</span>
                </div>
                <Progress value={80} className="w-full" />
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">Python</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">E-commerce Platform</h3>
                <p className="mt-1 text-sm">
                  Developed a full-stack e-commerce platform with React,
                  Node.js, and MongoDB.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">MongoDB</Badge>
                  <Badge variant="secondary">Express</Badge>
                </div>
                <div className="mt-2 text-sm">
                  <a
                    href="https://github.com/johndoe/ecommerce"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub
                  </a>
                  <span className="mx-2">|</span>
                  <a
                    href="https://ecommerce-demo.com"
                    className="text-blue-500 hover:underline"
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">
                  AWS Certified Solutions Architect
                </h3>
                <p className="text-sm text-gray-500">Amazon Web Services</p>
                <div className="mt-1 flex justify-between text-sm text-gray-500">
                  <span>Issued: Jan 2022</span>
                  <span>Expires: Jan 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">English</span>
                <Badge className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                  Native
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Spanish</span>
                <Badge className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                  Intermediate
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Achievements</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  <li>
                    Winner of the 2021 Hackathon for Sustainable Tech Solutions
                  </li>
                  <li>
                    Published article on "Modern Web Development Practices" in
                    Tech Monthly
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Interests</h3>
                <p className="mt-1 text-sm">
                  Open-source contribution, hiking, photography, and playing
                  guitar
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// const handleDownload = async () => {
//   const html2canvas = (await import("html2canvas")).default;
//   const jsPDF = (await import("jspdf")).default;

//   const input = resumeRef.current;
//   const canvas = await html2canvas(input, {
//     scale: 2,
//     useCORS: true,
//     logging: false,
//   });

//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF({
//     format: "a4",
//     unit: "px",
//   });

//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = pdf.internal.pageSize.getHeight();
//   const imgWidth = canvas.width;
//   const imgHeight = canvas.height;
//   const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
//   const imgX = (pdfWidth - imgWidth * ratio) / 2;
//   const imgY = 30;

//   pdf.addImage(
//     imgData,
//     "PNG",
//     imgX,
//     imgY,
//     imgWidth * ratio,
//     imgHeight * ratio,
//   );
//   pdf.save("resume.pdf");
// };
