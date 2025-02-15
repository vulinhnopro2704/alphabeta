import { useEffect, useState } from "react"

// Define the return type as a tuple explicitly
type UseLocalStorageReturn<T> = readonly [
  value: T,
  setValue: (value: T | ((prevValue: T) => T)) => void,
  removeValue: () => void,
]

function useLocalStorage<T>(
  key: string,
  initialValue: T,
): UseLocalStorageReturn<T> {
  // State to store the value
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.error("Error reading Local Storage:", error)
      return initialValue
    }
  })

  // Update local storage when value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error saving to Local Storage:", error)
    }
  }, [key, value])

  // Function to update the value
  const setLocalStorage: UseLocalStorageReturn<T>[1] = newValue => {
    setValue(prevValue =>
      typeof newValue === "function"
        ? (newValue as (prev: T) => T)(prevValue)
        : newValue,
    )
  }

  // Function to remove the value from local storage
  const removeLocalStorage: UseLocalStorageReturn<T>[2] = () => {
    try {
      localStorage.removeItem(key)
      setValue(initialValue)
    } catch (error) {
      console.error("Error removing from Local Storage:", error)
    }
  }

  // Return as a typed tuple (ensures correct IntelliSense)
  return [value, setLocalStorage, removeLocalStorage] as const
}

export default useLocalStorage
