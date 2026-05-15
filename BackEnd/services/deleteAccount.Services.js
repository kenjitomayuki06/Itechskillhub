import deleteAccountQuery from "../database/AccountQueries/deleteAccountQuery.js";
export default async function deleteAccountService(user_Id) {
   const deleteAccount = await deleteAccountQuery(user_Id);
   if (!user_Id|| deleteAccount.affectedRows === 0) {
    throw new Error("User not found or already deleted");
   }
   return deleteAccount;

}