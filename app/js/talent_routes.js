export const TALENT_ROUTES = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/app/pages/talent/index.html"
  },
  {
    key: "profile",
    label: "Profile",
    href: "/app/pages/talent/profile.html"
  },
  {
    key: "projects",
    label: "Projects",
    href: "/app/pages/talent/projects.html"
  },
  {
    key: "project_apply",
    label: "Apply Project",
    href: "/app/pages/talent/project-apply.html"
  },
  {
    key: "applications",
    label: "Applications",
    href: "/app/pages/talent/applications.html"
  },
  {
    key: "invites",
    label: "Invites",
    href: "/app/pages/talent/invites.html"
  },
  {
    key: "invite_detail",
    label: "Invite Detail",
    href: "/app/pages/talent/invite-detail.html"
  },
  {
    key: "invite_respond",
    label: "Respond Invite",
    href: "/app/pages/talent/invite-respond.html"
  },
  {
    key: "bookings",
    label: "Bookings",
    href: "/app/pages/talent/bookings.html"
  }
];

export function findTalentRouteByPath(pathname){
  const path = String(pathname || "").trim();
  return TALENT_ROUTES.find(item => item.href === path) || null;
}
