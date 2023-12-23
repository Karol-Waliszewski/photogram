import { useMemo, type PropsWithChildren } from "react";
import {
  LogIn,
  LogOut,
  UserRound,
  UserRoundPlus,
  Image,
  PlusSquare,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useAtomValue, useSetAtom } from "jotai";

import { useDialogWithAtom } from "@/components/atoms/Dialog";
import { Container } from "@/components/atoms/Container";
import { ScrollArea } from "@/components/atoms/ScrollArea";
import { Sidebar, type SidebarSection } from "@/components/molecules/Sidebar";
import { NewPostDialog } from "@/components/organisms/NewPostDialog";

import {
  isPostCreateDialogOpenAtom,
  isPostDeleteDialogOpenAtom,
  postToBeDeletedIdAtom,
} from "@/store";

import { cn } from "@/utils/cn";
import { DeletePostDialog } from "@/components/organisms/DeletePostDialog";

export type LayoutProps = React.HTMLAttributes<HTMLDivElement>;
export const Layout = ({
  children,
  className,
  ...props
}: PropsWithChildren<LayoutProps>) => {
  const { status } = useSession();
  const {
    isOpen: isPostCreateDialogOpen,
    open,
    close,
  } = useDialogWithAtom(isPostCreateDialogOpenAtom);
  const isPostDeleteDialogOpen = useAtomValue(isPostDeleteDialogOpenAtom);
  const setPostToBeDeletedId = useSetAtom(postToBeDeletedIdAtom);

  const sidebarLinks = useMemo<SidebarSection[]>(
    () =>
      status === "authenticated"
        ? [
            {
              title: "Posts",
              items: [
                { type: "link", label: "All posts", href: "/", icon: Image },
                {
                  type: "link",
                  label: "Following posts",
                  href: "/following",
                  icon: UserRoundPlus,
                },
                {
                  type: "button",
                  label: "Add post",
                  action: () => {
                    open();
                  },
                  icon: PlusSquare,
                },
              ],
            },
            {
              title: "User",
              items: [
                {
                  type: "link",
                  label: "Profile",
                  href: "/profile",
                  icon: UserRound,
                },
                {
                  type: "button",
                  label: "Logout",
                  action: () => signOut(),
                  icon: LogOut,
                },
              ],
            },
          ]
        : [
            {
              title: "Posts",
              items: [
                { type: "link", label: "All posts", href: "/", icon: Image },
              ],
            },
            {
              title: "User",
              items: [
                {
                  type: "button",
                  label: "Login",
                  action: () => signIn(),
                  icon: LogIn,
                },
              ],
            },
          ],
    [status],
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <NewPostDialog isOpen={isPostCreateDialogOpen} onClose={close} />
      <DeletePostDialog
        isOpen={isPostDeleteDialogOpen}
        onClose={() => setPostToBeDeletedId(null)}
      />
      <Sidebar sections={sidebarLinks} className="w-1/3 max-w-[250px]" />
      <ScrollArea className="max-h-screen w-full overflow-auto">
        <Container
          className={cn("py-4", className)}
          variant={"slim"}
          {...props}
        >
          {children}
        </Container>
      </ScrollArea>
    </div>
  );
};
