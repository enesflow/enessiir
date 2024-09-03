import { GlobalConfiguration } from "../cfg"
import { ValidLocale } from "../i18n"
import { LAST_MODIFIED_TR, LAST_MODIFIED_TR_SHORT } from "../i18n/locales/tr-TR"
import { QuartzPluginData } from "../plugins/vfile"

interface Props {
  date: Date
  locale?: ValidLocale
  showTime?: boolean
  text?: "normal" | "short" | "none"
}

export type ValidDateType = keyof Required<QuartzPluginData>["dates"]

export function getDate(cfg: GlobalConfiguration, data: QuartzPluginData): Date | undefined {
  if (!cfg.defaultDateType) {
    throw new Error(
      `Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.`,
    )
  }
  return data.dates?.[cfg.defaultDateType]
}

export function formatDate(
  d: Date,
  locale: ValidLocale = "tr-TR",
  showTime: boolean = true,
  text: "normal" | "short" | "none" = "normal",
): string {
  const date = d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: showTime ? "numeric" : undefined,
    minute: showTime ? "numeric" : undefined,
    timeZone: "Europe/Istanbul",
  })
  if (text === "none") return date
  if (text === "short") return `${LAST_MODIFIED_TR_SHORT}: ${date}`
  return `${LAST_MODIFIED_TR}: ${date}`
}

function DateComponent({ date, locale, showTime, text }: Props) {
  return <>{formatDate(date, locale, showTime, text)}</>
}

export { DateComponent as Date }
