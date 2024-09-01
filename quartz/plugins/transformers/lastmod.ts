import fs from "fs"
import path from "path"
import { Repository } from "@napi-rs/simple-git"
import { QuartzTransformerPlugin } from "../types"
import chalk from "chalk"
import { execa } from "execa"

export interface Options {
  priority: ("frontmatter" | "git" | "filesystem")[]
}

const defaultOptions: Options = {
  priority: ["frontmatter", "git", "filesystem"],
}

function coerceDate(fp: string, d: any): Date {
  const dt = new Date(d)
  const invalidDate = isNaN(dt.getTime()) || dt.getTime() === 0
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
            const repositoryName = "https://github.com/enesflow/enessiir.git"
            const clonePath = "/opt/buildhome/repo/very-temporary/enessiir"
            // first create the path
            await fs.promises.mkdir(clonePath.split("/").slice(0, -1).join("/"), {
              recursive: true,
            })
            const cloneResult = await execa("sh", [
              "-c",
              `git clone ${repositoryName} ${clonePath}`,
            ])
            console.log("CLONE RESULT", cloneResult.stdout, cloneResult.stderr)
            let created: MaybeDate = undefined
            let modified: MaybeDate = undefined
            let published: MaybeDate = undefined

            const fp = file.data.filePath!
            const fullFp = path.isAbsolute(fp) ? fp : path.posix.join(file.cwd, fp)
            const isCile = fp.endsWith("safahat.md")
            for (const source of opts.priority) {
              if (source === "filesystem") {
                const st = await fs.promises.stat(fullFp)
                created ||= st.birthtimeMs
                if (isCile)
                  console.log(
                    "==--==",
                    "filesystem created",
                    new Date(st.birthtimeMs).toLocaleString(),
                  )
                modified ||= st.mtimeMs
                if (isCile)
                  console.log(
                    "==--==",
                    "filesystem modified",
                    new Date(st.mtimeMs).toLocaleString(),
                  )
              } else if (source === "frontmatter" && file.data.frontmatter) {
                created ||= file.data.frontmatter.date as MaybeDate
                if (isCile)
                  console.log(
                    "==--==",
                    "frontmatter created",
                    new Date((file.data.frontmatter.date as MaybeDate) ?? 0).toLocaleString(),
                  )
                modified ||= file.data.frontmatter.lastmod as MaybeDate
                if (isCile)
                  console.log(
                    "==--==",
                    "frontmatter lastmod",
                    new Date((file.data.frontmatter.lastmod as MaybeDate) ?? 0).toLocaleString(),
                  )
                modified ||= file.data.frontmatter.updated as MaybeDate
                if (isCile)
                  console.log(
                    "==--==",
                    "frontmatter updated",
                    new Date((file.data.frontmatter.updated as MaybeDate) ?? 0).toLocaleString(),
                  )
                modified ||= file.data.frontmatter["last-modified"] as MaybeDate
                if (isCile)
                  console.log(
                    "==--==",
                    "frontmatter last-modified",
                    new Date(
                      (file.data.frontmatter["last-modified"] as MaybeDate) ?? 0,
                    ).toLocaleString(),
                  )
                published ||= file.data.frontmatter.publishDate as MaybeDate
                if (isCile)
                  console.log(
                    "==--==",
                    "frontmatter publishDate",
                    new Date(
                      (file.data.frontmatter.publishDate as MaybeDate) ?? 0,
                    ).toLocaleString(),
                  )
              } else if (source === "git") {
                if (!repo) {
                  // Get a reference to the main git repo.
                  // It's either the same as the workdir,
                  // or 1+ level higher in case of a submodule/subtree setup
                  // repo = Repository.discover(file.cwd)
                  repo = new Repository(clonePath)
                  if (isCile)
                    console.log("==--== Rediscovered repo", repo, repo.workdir(), file.cwd)
                } else if (isCile) console.log("==--==", "git repo", repo, repo.workdir())

                if (isCile) {
                  /* console.log("EXECUTING EXEC COMMAND")
                  const command = `git log -4 --pretty="format:%ci" ${repo.workdir()}/${fp}`
                  console.log("COMMAND", command)
                  exec(command, (err, stdout, stderr) => {
                    console.log("STDERR", stderr)
                    console.log("STDOUT", stdout)
                  }) */
                  // I don't think this is possible, the only date I am getting is the current date!
                  // On my pc I get the correct result but not on the server (cloudflare pages)
                  // I think I will clone the repo again
                  /* const repositoryName = "https://github.com/enesflow/enessiir.git"
                  const clonePath = "/opt/buildhome/repo/enessiir"
                  const command = `git clone ${repositoryName} ${clonePath}`
                  const command2 = `git log -4 --pretty="format:%ci" ${clonePath}/${fp}`
                  console.log("COMMAND", command)
                  console.log("COMMAND2", command2)
                  const result1 = await execa("sh", ["-c", command])
                  console.log("RESULT1", result1)
                  const result2 = await execa("sh", ["-c", command2])
                  console.log("RESULT2", result2)
                  console.log("RESULT2", result2.stdout)
                  console.log("RESULT2", result2.stderr) */
                }
                try {
                  modified ||= await repo.getFileLatestModifiedDateAsync(file.data.filePath!)
                  if (isCile)
                    console.log(
                      "==--==",
                      "git file latest modified",
                      new Date(
                        await repo.getFileLatestModifiedDateAsync(file.data.filePath!),
                      ).toLocaleString(),
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
            }
            if (isCile)
              console.log("==--==", "dates", {
                created: new Date(created as number).toLocaleString(),
                modified: new Date(modified as number).toLocaleString(),
                published: new Date(published as number).toLocaleString(),
              })
            file.data.dates = {
              created: coerceDate(fp, created),
              modified: coerceDate(fp, modified),
              published: coerceDate(fp, published),
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
