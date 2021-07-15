export const toLocalDate = date => new Intl
  .DateTimeFormat(
    'en-CA',
    {
      timeZone: 'America/Toronto',
      dateStyle: 'long',
      timeStyle: 'short',
    } as Intl.DateTimeFormatOptions
  )
  .format(new Date(date));
