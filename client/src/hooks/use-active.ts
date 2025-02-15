import { useEffect, useRef, useState } from "react"

// The useActive hook is used to check if the user is active or not. It takes a time parameter which is the time in milliseconds after which the user is considered inactive. It returns a boolean value isActive which is true if the user is active and false if the user is inactive.
export function useActive(time: number) {
  const [isActive, setIsActive] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const events = [
    "mousedown",
    "mousemove",
    "keydown",
    "touchover",
    "scroll",
    "keypress",
    "click",
    "scroll",
  ]

  useEffect(() => {
    //@ts-ignore
    const handleEvent = (event: any) => {
      setIsActive(true)
      if (timer.current) {
        window.clearTimeout(timer.current)
      }
      timer.current = window.setTimeout(() => {
        setIsActive(false)
      }, time)
    }

    events.forEach(event => document.addEventListener(event, handleEvent))
    return () => {
      events.forEach(event => document.removeEventListener(event, handleEvent))
      if (timer.current) {
        window.clearTimeout(timer.current)
      }
    }
  }, [time])
  return isActive
}
