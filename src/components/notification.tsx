import React from "react";

type Props = {
  message: string;
};

export default function Notification({ message }: Props) {
  return (
    <p className="w-full bg-green-100 p-1.5 text-center text-xs font-semibold text-green-800 ">
      {message}
    </p>
  );
}