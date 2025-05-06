export const calculateDuration = (start: string, end: string): string => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffInMs = endDate.getTime() - startDate.getTime()
  const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
  const nights = days - 1
  return `${days} days ${nights} nights`
}
