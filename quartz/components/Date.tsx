import { GlobalConfiguration } from "../cfg"
import { ValidLocale } from "../i18n"
import { LAST_MODIFIED_TR, LAST_MODIFIED_TR_SHORT } from "../i18n/locales/tr-TR"
import { QuartzPluginData } from "../plugins/vfile"

interface Props {
  date: Date
  locale?: ValidLocale
  showTime?: boolean
  text?: string
  // TODO, yeah this "relative" thing will never work because the pages are static...
  relative?: boolean
  short?: boolean
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
  relative = false,
  short?: boolean,
): string {
  if (relative) {
    let data = Math.ceil((d.getTime() - Date.now()) / 1000)
    let unit: Intl.RelativeTimeFormatUnit = "second"
    if (Math.abs(data) >= 60) {
      data = Math.ceil(data / 60)
      unit = "minute"
    }
    if (Math.abs(data) >= 60) {
      data = Math.ceil(data / 60)
      unit = "hour"
    }
    if (Math.abs(data) >= 24) {
      data = Math.ceil(data / 24)
      unit = "day"
    }
    return new Intl.RelativeTimeFormat(locale, {
      style: "short",
    })
      .format(data, unit)
      .replace(/\s+önce$/, "")
  }
  {
    const date = d.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: showTime ? "numeric" : undefined,
      minute: showTime ? "numeric" : undefined,
      timeZone: "Europe/Istanbul",
    })
    return `${short ? LAST_MODIFIED_TR_SHORT : LAST_MODIFIED_TR}: ${date}`
  }
}

function DateComponent({ date, locale, showTime, relative, short }: Props) {
  return <>{formatDate(date, locale, showTime, relative, short)}</>
}

export { DateComponent as Date }
