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
  const itemsPerPage = 10;
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
      if (!(event.target as Element).closest('.tooltip-trigger')) {
        closeTooltip();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [closeTooltip]);

  return (
    <div className="w-full lg:max-w-3xl">
      <h1 className="mb-4 pl-1 text-2xl font-bold">
        <span className="text-blue-500">{users.length}</span> People Built
        their Portfolio
      </h1>
      <section style={{ zoom: "80%" }}>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sno.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Route Name
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().map((user, i) => (
                <TableRow key={i}>
                  <TableCell className="py-0">
                    <div className="flex items-center gap-2">
                      <p className="whitespace-nowrap">{user.sno} -</p>
                      {user.avatarOptions && (
                        <AvatarComponent avatarOptions={user.avatarOptions} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="relative whitespace-normal text-base">
                    <div className="sm:max-w-full">
                      <MobileTooltipTrigger
                        fullName={user.fullName}
                        routeName={user.routeName}
                        isOpen={openTooltipIndex === i}
                        onToggle={() => handleTooltipToggle(i)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-28 truncate sm:max-w-full">
                      <Link
                        href={`/${user.routeName}`}
                        className="text-base text-blue-500 hover:underline"
                      >
                        portly.dev/{user.routeName}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-base sm:table-cell">
                    {user.routeName}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination className="mt-4">
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
  onToggle 
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
    <div className="relative tooltip-trigger">
      <div
        className="sm:hidden max-w-28 truncate"
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