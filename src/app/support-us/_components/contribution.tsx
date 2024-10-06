"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Landmark, Smartphone } from "lucide-react";
import Upi from "@/components/svg/upi";
import Visa from "@/components/svg/visa";
import Mastercard from "@/components/svg/mastercard";
import Rupay from "@/components/svg/rupay";

export default function Contribution() {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("25");

  const handleAmountChange = (value: string) => {
    setSelectedAmount(value);
    if (value === "other") {
      setCustomAmount("");
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Make a Contribution</CardTitle>
        <CardDescription>
          Choose an amount and payment method to support our project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Donation Amount (INR)</Label>
            <RadioGroup
              id="amount"
              className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4"
              value={selectedAmount}
              onValueChange={handleAmountChange}
            >
              {[25, 100, 500, 1000, 1500, 3000, 5000].map((amount) => (
                <div key={amount}>
                  <RadioGroupItem
                    value={amount.toString()}
                    id={`amount-${amount}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`amount-${amount}`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    ₹{amount}
                  </Label>
                </div>
              ))}
              <div>
                <RadioGroupItem
                  value="other"
                  id="amount-other"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="amount-other"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>
          {selectedAmount === "other" && (
            <div>
              <Label htmlFor="custom-amount">Custom Amount (INR)</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="mt-2"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Tabs defaultValue="upi" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upi">UPI</TabsTrigger>
            <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
            <TabsTrigger value="card">Card</TabsTrigger>
          </TabsList>
          <TabsContent value="upi" className="mt-4">
            <div className="flex h-10 items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Pay using UPI</span>
              </div>

              <Upi className="h-[30px]" />
            </div>
            <Button className="mt-4 w-full">Proceed with UPI</Button>
          </TabsContent>
          <TabsContent value="netbanking" className="mt-4">
            <div className="flex h-10 items-center justify-between">
              <div className="flex items-center space-x-2">
                <Landmark className="h-5 w-5" />
                <span>Pay using Net Banking</span>
              </div>
            </div>
            <Button className="mt-4 w-full">Proceed with Net Banking</Button>
          </TabsContent>
          <TabsContent value="card" className="mt-4">
            <div className="flex h-10 items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Pay using Credit/Debit Card</span>
              </div>
              <div className="flex space-x-2">
                <Visa className="h-[25px]" />
                <Mastercard className="h-[25px]" />
                <Rupay className="h-[25px]" />
              </div>
            </div>
            <Button className="mt-4 w-full">Proceed with Card Payment</Button>
          </TabsContent>
        </Tabs>
      </CardFooter>
    </Card>
  );
}
