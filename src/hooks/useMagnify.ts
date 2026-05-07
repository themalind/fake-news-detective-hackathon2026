import { useEffect, useRef } from 'react'

const SCALE = 2.2
const LENS_SIZE = 160

export function useMagnify<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let lensEl: HTMLDivElement | null = null
    let cloneEl: HTMLElement | null = null

    const enter = () => {
      const rect = el.getBoundingClientRect()

      cloneEl = el.cloneNode(true) as HTMLElement
      // Strip animations so the lens content stays stable
      cloneEl.style.cssText += ';animation:none;transition:none;position:absolute;margin:0;'
      cloneEl.style.width = `${rect.width}px`
      cloneEl.style.height = `${rect.height}px`
      cloneEl.style.transform = `scale(${SCALE})`
      cloneEl.style.transformOrigin = '0 0'
      cloneEl.style.pointerEvents = 'none'
      cloneEl.querySelectorAll<HTMLElement>('*').forEach(child => {
        child.style.animation = 'none'
        child.style.transition = 'none'
      })

      lensEl = document.createElement('div')
      lensEl.style.cssText = `
        position: fixed;
        width: ${LENS_SIZE}px;
        height: ${LENS_SIZE}px;
        border-radius: 50%;
        overflow: hidden;
        pointer-events: none;
        z-index: 9999;
        display: none;
        background: #110e08;
        border: 2px solid rgba(201,162,39,0.7);
        box-shadow:
          0 0 0 1px rgba(201,162,39,0.2),
          0 8px 32px rgba(0,0,0,0.9),
          inset 0 1px 0 rgba(255,255,255,0.06);
      `
      lensEl.appendChild(cloneEl)
      document.body.appendChild(lensEl)
    }

    const move = (e: MouseEvent) => {
      if (!lensEl || !cloneEl) return
      const rect = el.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top

      cloneEl.style.left = `${LENS_SIZE / 2 - cx * SCALE}px`
      cloneEl.style.top  = `${LENS_SIZE / 2 - cy * SCALE}px`

      lensEl.style.left    = `${e.clientX - LENS_SIZE}px`
      lensEl.style.top     = `${e.clientY - LENS_SIZE}px`
      lensEl.style.display = 'block'
    }

    const leave = () => {
      lensEl?.remove()
      lensEl  = null
      cloneEl = null
    }

    el.addEventListener('mouseenter', enter)
    el.addEventListener('mousemove',  move)
    el.addEventListener('mouseleave', leave)

    return () => {
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mousemove',  move)
      el.removeEventListener('mouseleave', leave)
      lensEl?.remove()
    }
  }, [])

  return ref
}
