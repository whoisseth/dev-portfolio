import { cn } from "@/lib/utils";
import React from "react";

type Props = React.SVGProps<SVGSVGElement>;

export default function Visa({ ...props }: Props) {
  return (
    <svg
      {...props}
      className={cn("cc-logo-visa", props.className)}
      width="42"
      height="26"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="cc-logo-visa-title"
      viewBox="0 0 200 120"
    >
      <title id="cc-logo-visa-title">Visa</title>
      <path
        fill="#FFFFFF"
        d="M7.7 0h184.6c4.2 0 7.7 3.3 7.7 7.5v105c0 4.1-3.4 7.5-7.7 7.5H7.7c-4.2 0-7.7-3.3-7.7-7.5V7.5C0 3.3 3.4 0 7.7 0z"
      ></path>
      <path
        fill="#F7B600"
        d="M0 98v14.3c0 4.2 3.4 7.7 7.7 7.7h184.6c4.2 0 7.7-3.4 7.7-7.7V98H0z"
      ></path>
      <path
        fill="#1A1F71"
        d="M200 22V7.7c0-4.2-3.4-7.7-7.7-7.7H7.7C3.4 0 0 3.4 0 7.7V22h200zM81.9 36.9L62.3 83.4H49.4l-9.6-37.2c-.6-2.3-1.1-3.1-2.8-4.1-3.8-1.8-7.8-3.1-12-3.9l.2-1.4h20.6c2.8 0 5.1 2 5.6 4.8l5.1 26.9 12.6-31.7h12.8zm50.3 31.3c0-12.3-17-13-16.9-18.4 0-1.7 1.6-3.4 5.2-3.9 4.1-.4 8.2.3 12 2.1l2.1-9.8c-3.6-1.4-7.5-2.1-11.4-2.1-12 0-20.4 6.4-20.5 15.3-.1 6.8 6 10.4 10.6 12.6s6.3 3.8 6.3 5.8c0 3.1-3.8 4.5-7.3 4.5-4.3.1-8.6-.9-12.5-2.9l-2.2 10.2c4.3 1.7 8.9 2.5 13.5 2.5 12.7 0 20.9-6.2 21.1-15.9m31.6 15.2H175l-9.8-46.5h-10.4c-2.3 0-4.3 1.3-5.2 3.4l-18.3 43.1H144l2.5-7h15.6l1.7 7zm-13.6-16.5l6.4-17.4 3.7 17.4h-10.1zm-51-30l-10 46.5H77.1l10-46.5h12.1z"
      ></path>
    </svg>
  );
}
