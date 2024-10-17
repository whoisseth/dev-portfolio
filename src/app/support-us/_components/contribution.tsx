"use client";

import { useState, useTransition } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Landmark, Smartphone } from "lucide-react";
import Upi from "@/components/svg/upi";
import Visa from "@/components/svg/visa";
import Mastercard from "@/components/svg/mastercard";
import Rupay from "@/components/svg/rupay";
import { useToast } from "@/components/ui/use-toast";
import Script from "next/script";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { cn } from "@/lib/utils";
import { addDonation } from "@/actions/donation-actions";
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  amount: z.string().refine(
    (val) => {
      if (val === "other") return true;
      const numVal = Number(val);
      return !isNaN(numVal) && numVal >= 10;
    },
    { message: "Please select an amount (minimum 10 INR)" },
  ),
  customAmount: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const numVal = Number(val);
        return !isNaN(numVal) && numVal >= 10;
      },
      { message: "Custom amount must be at least 10 INR" },
    ),
});

export default function Contribution({
  userNameAndEmail,
}: {
  userNameAndEmail:
    | {
        email: string | null;
        displayName: string | null;
      }
    | undefined;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: userNameAndEmail?.displayName ?? "",
      email: userNameAndEmail?.email ?? "",
      phoneNumber: "",
      amount: "25",
      customAmount: "",
    },
  });

  const handleAmountChange = (value: string) => {
    form.setValue("amount", value);
    if (value !== "other") {
      form.setValue("customAmount", "");
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayment = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const amount =
        values.amount === "other" ? values.customAmount : values.amount;

      try {
        const paymentResponse = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseInt(amount as string),
            currency: "INR",
          }),
        });

        if (!paymentResponse.ok) {
          throw new Error(`HTTP error! status: ${paymentResponse.status}`);
        }

        const { order } = await paymentResponse.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Portly.dev",
          description: "Contribution Payment",
          order_id: order.id,
          handler: async function (response: any) {
            // Update donation status and payment ID
            addDonation({
              userName: values.fullName,
              phoneNo: values.phoneNumber,
              email: values.email,
              amount: parseInt(amount as string),
              paymentMethod: selectedPaymentMethod,
              paymentId: response.razorpay_payment_id,
              status: "completed",
            });

            toast({
              title: "Payment Successful",
              description: `Payment ID: ${response.razorpay_payment_id}`,
            });
          },
          prefill: {
            name: values.fullName,
            email: values.email,
            contact: values.phoneNumber,
            method: selectedPaymentMethod,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (error) {
        toast({
          title: "Error initiating payment",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          variant: "destructive",
        });
        console.error("Error initiating payment", error);
      }
    });
  };

  const isAmountValid = () => {
    const amount = form.getValues("amount");
    const customAmount = form.getValues("customAmount");
    const finalAmount = amount === "other" ? customAmount : amount;
    return Number(finalAmount) >= 10;
  };

  const isProceedDisabled = () => {
    return (
      isPending ||
      !isAmountValid() ||
      form.formState.errors.amount !== undefined ||
      form.formState.errors.customAmount !== undefined
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const finalAmount =
      values.amount === "other" ? values.customAmount : values.amount;
    if (Number(finalAmount) < 10) {
      form.setError("amount", {
        message: "Please select an amount (minimum 10 INR)",
      });
      return;
    }
    handlePayment({ ...values, amount: finalAmount as string });
    setIsDialogOpen(false);
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Make a Contribution</CardTitle>
          <CardDescription>
            Choose an amount and payment method to support our project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Amount (INR)</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                      >
                        {[25, 100, 500, 1000, 1500, 3000, 5000].map(
                          (amount) => (
                            <FormItem key={amount}>
                              <FormControl>
                                <RadioGroupItem
                                  value={amount.toString()}
                                  id={`amount-${amount}`}
                                  className="peer sr-only"
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor={`amount-${amount}`}
                                className={cn(
                                  "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                                  "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                                )}
                              >
                                ₹{amount}
                              </FormLabel>
                            </FormItem>
                          ),
                        )}
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="other"
                              id="amount-other"
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor="amount-other"
                            className={cn(
                              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                              "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                            )}
                          >
                            Other
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("amount") === "other" && (
                <FormField
                  control={form.control}
                  name="customAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Amount (INR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <section className="flex w-full flex-col gap-2">
            <Tabs
              value={selectedPaymentMethod}
              onValueChange={handlePaymentMethodChange}
              className="w-full"
            >
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
              </TabsContent>
              <TabsContent value="netbanking" className="mt-4">
                <div className="flex h-10 items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Landmark className="h-5 w-5" />
                    <span>Pay using Net Banking</span>
                  </div>
                </div>
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
              </TabsContent>
            </Tabs>
            {/*  */}
            {/*  */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full" disabled={isProceedDisabled()}>
                  {isPending ? "Processing..." : "Proceed To Pay"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enter Your Details</DialogTitle>
                  <DialogDescription>
                    Please provide your information to proceed with the payment.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            {/* <Input placeholder="1234567890" {...field} /> */}
                            <PhoneInput
                              placeholder="Enter a phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </section>
          {/*  */}
          {/*  */}
        </CardFooter>
      </Card>
    </>
  );
}
