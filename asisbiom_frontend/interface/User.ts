import Roles from "./Roles";

export default interface User
{
    id: number;
    role: Roles;
    email: string;
}