import { GlobalConfiguration } from "../cfg"
import { ValidLocale } from "../i18n"
import { LAST_MODIFIED_TR } from "../i18n/locales/tr-TR"
import { QuartzPluginData } from "../plugins/vfile"

interface Props {
  date: Date
  locale?: ValidLocale
  showTime?: boolean
  text?: string
  relative?: boolean
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
  locale: ValidLocale = "en-US",
  showTime: boolean = true,
  relative = false,
): string {
  if (relative) {
    // format as hours
    let data = Math.ceil((d.getTime() - Date.now()) / 1000 / 60 / 60)
    const isHours = Math.abs(data) < 24
    if (!isHours) data = Math.ceil(data / 24)
    return new Intl.RelativeTimeFormat(locale, {
      style: "short",
    })
      .format(data, isHours ? "hour" : "day")
      .replace(/\s+önce$/, "")
  }
  {
    const date = d.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: showTime ? "numeric" : undefined,
      minute: showTime ? "numeric" : undefined,
    })
    return `${LAST_MODIFIED_TR}: ${date}`
  }
}

function DateComponent({ date, locale, showTime, relative }: Props) {
  return <>{formatDate(date, locale, showTime, relative)}</>
}

export { DateComponent as Date }
