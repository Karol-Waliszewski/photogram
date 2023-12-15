import { cn } from "@/utils/cn";
import { Button } from "@/components/atoms/Button";
import { ScrollArea } from "@/components/atoms/ScrollArea";
import { Large } from "@/components/atoms/Typography";
import { type LucideIcon } from "lucide-react";
import { type Href, Link } from "@/components/atoms/Link";
import { Logo } from "@/components/molecules/Logo";

export type SidebarItem =
  | {
      type: "link";
      label: string;
      href: Href;
      icon: LucideIcon;
    }
  | {
      type: "button";
      label: string;
      action: (() => void) | (() => Promise<unknown>);
      icon: LucideIcon;
    };
export type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};
type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  sections: SidebarSection[];
  activeHref?: string | null;
};

const Sidebar = ({ className, sections, activeHref = null }: SidebarProps) => {
  return (
    <div className={cn("border-r pb-12", className)}>
      <div className="space-y-4 py-4">
        <Logo className="px-7 py-4" />
        {sections.map((section, index) => (
          <div className="px-3 py-2" key={(section?.title ?? "") + index}>
            {section?.title && (
              <Large className="mb-2 px-4">{section.title}</Large>
            )}
            <ScrollArea>
              <div className="space-y-1">
                {section.items.map((item) =>
                  item.type === "link" ? (
                    <Link href={item.href}>
                      <Button
                        variant={
                          item.href === activeHref ? "secondary" : "ghost"
                        }
                        className="w-full justify-start"
                        key={item.label}
                      >
                        {<item.icon className="mr-2 h-4 w-4" />}
                        {item.label}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant={"ghost"}
                      className="w-full justify-start"
                      key={item.label}
                      onClick={item.action}
                    >
                      {<item.icon className="mr-2 h-4 w-4" />}
                      {item.label}
                    </Button>
                  ),
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Sidebar };
