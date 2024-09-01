import { GlobalConfiguration } from "../cfg"
import { ValidLocale } from "../i18n"
import { QuartzPluginData } from "../plugins/vfile"

interface Props {
  date: Date
  locale?: ValidLocale
  showTime?: boolean
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
): string {
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: showTime ? "numeric" : undefined,
    minute: showTime ? "numeric" : undefined,
  })
}

export function Date({ date, locale, showTime }: Props) {
  return <>{formatDate(date, locale, showTime)}</>
}
