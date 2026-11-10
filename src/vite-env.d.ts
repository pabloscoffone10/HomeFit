/// <reference types="vite/client" />

interface Window {
  homefit?: {
    platform: string
    openExternalVideo: (url: string) => Promise<boolean>
  }
}
