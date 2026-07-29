export function useApiHeaders(contentType = 'application/json') {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('donyaweb_auth_token')

  return computed(() => ({
    ...(contentType ? { 'Content-Type': contentType } : {}),
    'g-api-key': config.public.apiKey,
    'Authorization': tokenCookie.value
      ? `Bearer ${tokenCookie.value}`
      : '',
  }))
}
