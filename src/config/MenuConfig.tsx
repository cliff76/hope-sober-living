import {Book, House, MessageCircleHeart, UserCog, UsersIcon} from "lucide-react";
import {ROLES_ADMIN, ROLES_EMPLOYEE} from "@/utils/constants";

export const menuConfig = {
    main: [
        {
            key: 1,
            title: "Home",
            icon: (<House/>),
            href: "/",
        },
        {
            key: 2,
            roles: [ROLES_ADMIN],
            title: "Admin",
            icon: (<UserCog/>),
            href: "/admin",
        },
        {
            key: 3,
            roles: [ROLES_ADMIN, ROLES_EMPLOYEE],
            title: "Residents",
            icon: (<UsersIcon/>),
            href: "/residents",
        },
        {
            key: 4,
            title: "Testimonials",
            icon: (<MessageCircleHeart/>),
            href: "/testimonials",
        },
        {
            key: 5,
            title: "About",
            icon: (<Book/>),
            href: "/about",
        }
    ]
};