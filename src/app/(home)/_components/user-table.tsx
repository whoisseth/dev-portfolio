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
  const itemsPerPage = 6;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  };

  return (
    <div className="w-full max-w-full sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-center text-xl font-semibold sm:text-left md:text-2xl">
          Latest portfolios were created by...
        </h1>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Portfolio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().map((user, i) => (
                <TableRow key={i}>
                  <TableCell className="py-2 text-center">{user.sno}</TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      {user.avatarOptions && (
                        <AvatarComponent avatarOptions={user.avatarOptions} />
                      )}
                      <span className="text-sm font-medium md:text-base">
                        {user.fullName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Link
                      href={`/${user.routeName}`}
                      className="text-sm text-primary hover:underline md:text-base"
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
              <PaginationItem key={i} className="hidden sm:inline-block">
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
      </div>
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
      className="size-6 min-h-6 min-w-6 rounded-full border bg-muted md:size-8 md:min-h-8 md:min-w-8"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
