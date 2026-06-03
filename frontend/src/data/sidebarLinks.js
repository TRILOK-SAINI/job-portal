import {
  FaHome,
  FaBriefcase,
  FaUsers,
  FaUserTie,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";

export const sidebarLinks = {
  admin: [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FaHome,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: FaUsers,
    },
    {
      name: "Jobs",
      path: "/admin/jobs",
      icon: FaBriefcase,
    },
  ],

  employer: [
    {
      name: "Dashboard",
      path: "/employer",
      icon: FaHome,
    },
    {
      name: "My Profile",
      path: "/employer/profile",
      icon: FaCog,
    },
    {
      name: "My Jobs",
      path: "/employer/jobs",
      icon: FaBriefcase,
    },
    {
      name: "Applications",
      path: "/employer/applications",
      icon: FaUserTie,
    },
  ],

  candidate: [
    {
      name: "Dashboard",
      path: "/candidate",
      icon: FaHome,
    },
    {
      name: "Jobs",
      path: "/candidate/jobs",
      icon: FaBriefcase,
    },
    {
      name: "Applications",
      path: "/candidate/applications",
      icon: FaFileAlt,
    },
    {
      name: "Profile",
      path: "/candidate/profile",
      icon: FaCog,
    },
  ],
};