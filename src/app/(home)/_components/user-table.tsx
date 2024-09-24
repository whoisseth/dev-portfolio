"use client";

import { useState } from "react";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Ghost } from "lucide-react";

interface User {
  sno: number;
  fullName: string;
  routeName: string;
}

interface UserTableProps {
  users: User[];
}

// const avatar = "https://api.dicebear.com/9.x/lorelei/svg?seed=1&flip=true";
// const avatar = "https://api.dicebear.com/9.x/lorelei/svg?seed=Aiden1";

export function UserTableComponent({ users }: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  };

  return (
    <div className="w-full lg:max-w-3xl">
      <h1 className="mb-4 text-2xl font-bold pl-1">
        <span className="text-blue-500"> {users.length}</span> People Built
        their Portfolio
      </h1>
      <section style={{ zoom: "80%" }}>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sno.</TableHead>
                <TableHead>
                  <div>Full Name</div>
                </TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Route Name
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().map((user, i) => (
                <TableRow key={i} className=" ">
                  <TableCell className="py-0">
                    <div className="flex items-center gap-2">
                      <p className="whitespace-nowrap"> {user.sno} -</p>
                      {/* notionists */}
                      {/* lorelei */}
                      <img
                        src={`https://api.dicebear.com/9.x/notionists/svg?seed=${user.routeName}&flip=true&mouth=happy01,happy02,happy03,happy04,happy05,happy06,happy07,happy08,happy09,happy10,happy11,happy12,happy13,happy14,happy16`}
                        alt="avatar-img"
                        className="size-7 rounded-full border"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-base">
                    {user.fullName}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/${user.routeName}`}
                      className="text-base text-blue-500 hover:underline"
                    >
                      portly.dev/{user.routeName}
                    </Link>
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
                variant={"ghost"}
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
                variant={"ghost"}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>

              {/* <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
            /> */}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </div>
  );
}
