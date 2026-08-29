/**
 * Line icons, drawn inline so there is no sprite request and every stroke
 * inherits currentColor. Stroke-based to match the hairline UI language.
 */

export type IconName =
  | 'aperture'
  | 'film'
  | 'heart'
  | 'building'
  | 'play'
  | 'arrow'
  | 'whatsapp'
  | 'instagram'
  | 'youtube'
  | 'phone'
  | 'mail'
  | 'close'
  | 'plus'

const PATHS: Record<Exclude<IconName, 'whatsapp' | 'play' | 'instagram'>, string> = {
  aperture:
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm7.5 5-9.1.3M21 13.6l-5-7.6M16.6 20.4 12 12m-7.5 4 9.1-.3M3 10.4l5 7.6M7.4 3.6 12 12',
  film: 'M3 5.5h18v13H3zM7.5 5.5v13M16.5 5.5v13M3 12h18M3 8.7h4.5M3 15.3h4.5M16.5 8.7H21M16.5 15.3H21',
  heart:
    'M12 20.5S3.5 15.2 3.5 9.4a4.4 4.4 0 0 1 8.5-1.6 4.4 4.4 0 0 1 8.5 1.6c0 5.8-8.5 11.1-8.5 11.1Z',
  building: 'M4 21V6.5L12 3l8 3.5V21M4 21h16M9 21v-4.5h6V21M8 9.5h2M14 9.5h2M8 13h2M14 13h2',
  arrow: 'M4 12h15m0 0-6-6m6 6-6 6',
  phone:
    'M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 5.1 5.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z',
  mail: 'M3 6.5h18v11H3zM3 7l9 6.5L21 7',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  youtube:
    'M21.4 7.6a2.5 2.5 0 0 0-1.7-1.8C18.1 5.4 12 5.4 12 5.4s-6.1 0-7.7.4A2.5 2.5 0 0 0 2.6 7.6 26 26 0 0 0 2.2 12c0 1.5.1 3 .4 4.4a2.5 2.5 0 0 0 1.7 1.8c1.6.4 7.7.4 7.7.4s6.1 0 7.7-.4a2.5 2.5 0 0 0 1.7-1.8c.3-1.4.4-2.9.4-4.4s-.1-3-.4-4.4ZM10.2 14.8V9.2l4.8 2.8Z',
}

type Props = {
  name: IconName
  className?: string
  strokeWidth?: number
}

export default function Icon({ name, className = 'size-5', strokeWidth = 1.25 }: Props) {
  if (name === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2a.6.6 0 0 0 0-.5l-.8-1.9c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1 2.6 11.4 11.4 0 0 0 4.4 3.9c1.6.6 2.2.7 3 .6a2.5 2.5 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3Z" />
      </svg>
    )
  }

  if (name === 'play') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M8 5.2v13.6L19 12 8 5.2Z" />
      </svg>
    )
  }

  if (name === 'instagram') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={className}
        aria-hidden="true"
      >
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
