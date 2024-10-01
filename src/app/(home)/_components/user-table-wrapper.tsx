import { getAllUsers } from "@/actions/create-portfolio-actions";
import { UserTableComponent } from "./user-table";

export async function UserTableWrapper() {
  const allUsers = await getAllUsers();

  if (allUsers.length === 0) {
    return null;
  }

  return <UserTableComponent users={allUsers} />;
}
