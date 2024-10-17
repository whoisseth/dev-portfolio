import { UserTableComponent } from "./user-table";
import { getAllUsers } from "@/actions/user-actions";
export async function UserTableWrapper() {
  const allUsers = await getAllUsers();

  if (allUsers.length === 0) {
    return null;
  }

  return <UserTableComponent users={allUsers} />;
}
