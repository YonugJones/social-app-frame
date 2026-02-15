export function mustString(v: FormDataEntryValue | null) {
  return typeof v === 'string' ? v : ''
}
