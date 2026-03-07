import { Fragment } from "react";
import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {isLast || !item.href ? (
                  <span className="font-semibold text-foreground">{item.label}</span>
                ) : (
                  <Link className="transition-colors hover:text-primary" to={item.href}>
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast ? <li className="text-muted-foreground/60">/</li> : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
