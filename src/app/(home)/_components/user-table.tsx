"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createAvatar, Options } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface User {
  sno: number;
  fullName: string;
  routeName: string;
  avatarOptions: AvatarOptions | null;
}

interface UserTableProps {
  users: User[];
}

interface AvatarOptions extends Partial<Options> {}

export function UserTableComponent({ users }: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  };

  const handleTooltipToggle = (index: number) => {
    setOpenTooltipIndex(openTooltipIndex === index ? null : index);
  };

  const closeTooltip = useCallback(() => {
    setOpenTooltipIndex(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".tooltip-trigger")) {
        closeTooltip();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [closeTooltip]);

  return (
    <div className="flex w-full flex-col items-center justify-center lg:max-w-3xl">
      <h1 className="mb-4 pl-1 font-semibold">
        {/* <span className="text-blue-500">{users.length}</span> People Built their
        Portfolio */}
      </h1>
      {/* <section > */}
      <section style={{ zoom: "90%" }} className="w-full max-w-md">
        <h1 className="mb-4 ml-1 text-2xl font-semibold">
          Latest portfolios were created by...
        </h1>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20px]"> </TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead> Portfolio </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().map((user, i) => (
                <TableRow key={i}>
                  <TableCell className="py-0">
                    <div className="flex items-center gap-2">
                      <p className="whitespace-nowrap">{user.sno} </p>
                    </div>
                  </TableCell>
                  <TableCell className="relative whitespace-normal text-base">
                    <div className="flex items-center gap-2 sm:max-w-full">
                      {user.avatarOptions && (
                        <AvatarComponent avatarOptions={user.avatarOptions} />
                      )}

                      <MobileTooltipTrigger
                        fullName={user.fullName}
                        routeName={user.routeName}
                        isOpen={openTooltipIndex === i}
                        onToggle={() => handleTooltipToggle(i)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/${user.routeName}`}
                      className="text-base text-blue-500 hover:underline"
                    >
                      {user.routeName}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination className="mt-4 hidden">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                variant="ghost"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </div>
  );
}

function AvatarComponent({
  avatarOptions,
}: {
  avatarOptions: Partial<Options>;
}) {
  const avatar = createAvatar(notionists, avatarOptions);
  const svg = avatar.toString();
  return (
    <div
      className="size-7 rounded-full border bg-muted"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function MobileTooltipTrigger({
  fullName,
  routeName,
  isOpen,
  onToggle,
}: {
  fullName: string;
  routeName: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <div className="tooltip-trigger relative">
      <div
        className="max-w-28 truncate sm:hidden"
        onTouchStart={handleTouch}
        onTouchEnd={(e) => e.preventDefault()}
        aria-label={`View details for ${fullName}`}
        role="button"
        tabIndex={0}
      >
        {fullName}
      </div>
      <div className="hidden sm:block">{fullName}</div>
      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-64 rounded-md bg-white p-2 text-sm text-gray-700 shadow-lg sm:hidden">
          <p className="font-semibold">Full Name: {fullName}</p>
          <p>Route Name: {routeName}</p>
        </div>
      )}
    </div>
  );
}
