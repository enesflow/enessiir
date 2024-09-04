import { JSX } from "preact"
import readingTime from "reading-time"
import { REPO_URL } from "../build"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import { formatDate, getDate } from "./Date"
import style from "./styles/contentMeta.scss"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        segments.push(
          <>
            {i18n(cfg.locale).lastModified}:{" "}
            <a
              href={
                REPO_URL.replace(/\.git(\/)*$/, "") +
                "/commits/main/content/" +
                fileData.slug +
                ".md"
              }
            >
              {formatDate(getDate(cfg, fileData)!, cfg.locale, true, "none")}
            </a>
          </>,
        )
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(displayedTime)
      }

      const segmentsElements = segments.map((segment) => <span>{segment}</span>)

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segmentsElements}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
