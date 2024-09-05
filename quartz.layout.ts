import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FullSlug, simplifySlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    /*  */
    Component.Comments({
      provider: "giscus",
      options: {
        category: "Announcements",
        categoryId: "DIC_kwDOMnOE-M4CiIKn",
        repo: "enesflow/enessiir",
        repoId: "R_kgDOMnOE-A",
        inputPosition: "top",
        mapping: "og:title",
        reactionsEnabled: true,
        strict: true,
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      "Enes Sözlük 📕": "https://sozluk.enesin.xyz",
      "Github 🐙": "https://github.com/enesflow/enessiir",
    },
  }),
}

const filter = (f: any) => !f.slug?.startsWith("kelime/")

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    //Component.DesktopOnly(Component.Explorer()),
    Component.DesktopOnly(
      Component.RecentNotes({
        filter,
      }),
    ),
  ],
  right: [
    // Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    Component.MobileOnly(Component.Spacer()),
    Component.MobileOnly(
      Component.RecentNotes({
        filter,
      }),
    ),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    // Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
