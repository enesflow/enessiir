import { Repository } from "@napi-rs/simple-git"
import chalk from "chalk"
import fs from "fs"
import path from "path"
import { CLONE_PATH } from "../../build"
import { QuartzTransformerPlugin } from "../types"

export interface Options {
  priority: ("frontmatter" | "git" | "filesystem")[]
}

const defaultOptions: Options = {
  priority: ["frontmatter", "git", "filesystem"],
}

function coerceDate(fp: string, d: any): Date {
  d ??= 0
  const dt = new Date(d)
  const invalidDate = isNaN(dt.getTime()) /*  || dt.getTime() === 0 */
  if (invalidDate && d !== undefined) {
    console.log(
      chalk.yellow(
        `\nWarning: found invalid date "${d}" in \`${fp}\`. Supported formats: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format`,
      ),
    )
  }

  return invalidDate ? new Date() : dt
}

type MaybeDate = undefined | string | number
export const CreatedModifiedDate: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "CreatedModifiedDate",
    markdownPlugins() {
      return [
        () => {
          let repo: Repository | undefined = undefined
          return async (_tree, file) => {
            let created: MaybeDate = undefined
            let modified: MaybeDate = undefined
            let published: MaybeDate = undefined

            const fp = file.data.filePath!
            const fullFp = path.isAbsolute(fp) ? fp : path.posix.join(CLONE_PATH, fp)
            for (const source of opts.priority) {
              console.log("now at", source)
              if (source === "filesystem") {
                const st = await fs.promises.stat(fullFp)
                created ||= st.birthtimeMs
                console.log(fp, "fs-created", created)
                modified ||= st.mtimeMs
                console.log(fp, "fs-modified", modified)
              } else if (source === "frontmatter" && file.data.frontmatter) {
                created ||= file.data.frontmatter.date as MaybeDate
                console.log(fp, "fm-created", created)
                modified ||= file.data.frontmatter.lastmod as MaybeDate
                console.log(fp, "fm-modified", modified)
                modified ||= file.data.frontmatter.updated as MaybeDate
                console.log(fp, "fm-updated", modified)
                modified ||= file.data.frontmatter["last-modified"] as MaybeDate
                console.log(fp, "fm-last-modified", modified)
                published ||= file.data.frontmatter.publishDate as MaybeDate
                console.log(fp, "fm-published", published)
              } else if (source === "git") {
                if (!repo) {
                  // Get a reference to the main git repo.
                  // It's either the same as the workdir,
                  // or 1+ level higher in case of a submodule/subtree setup
                  // repo = Repository.discover(file.cwd)
                  repo = new Repository(CLONE_PATH)
                }
                try {
                  const m = await repo.getFileLatestModifiedDateAsync(file.data.filePath!)
                  modified ||= m
                  console.log(
                    fp,
                    m,
                    modified,
                    new Date(m).toLocaleString(),
                    new Date(modified as number).toLocaleString(),
                  )
                } catch {
                  console.log(
                    chalk.yellow(
                      `\nWarning: ${file.data
                        .filePath!} isn't yet tracked by git, last modification date is not available for this file`,
                    ),
                  )
                }
              }
              file.data.dates = {
                created: coerceDate(fp, created),
                modified: coerceDate(fp, modified),
                published: coerceDate(fp, published),
              }
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    dates: {
      created: Date
      modified: Date
      published: Date
    }
  }
}
