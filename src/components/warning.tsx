import React from "react";

type Props = {};

export default function Warning({}: Props) {
  return (
    <p className="w-full bg-yellow-100 p-1.5 text-center text-xs font-semibold text-yellow-800">
      ⚠️ In development. Data may be deleted. Full access soon.
    </p>
  );
}
