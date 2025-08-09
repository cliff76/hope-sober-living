import {Book, House, MessageCircleHeart} from "lucide-react";

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
            title: "Testimonials",
            icon: (<MessageCircleHeart/>),
            href: "/testimonials",
        },
        {
            key: 3,
            title: "About",
            icon: (<Book/>),
            href: "/about",
        }
    ]
};