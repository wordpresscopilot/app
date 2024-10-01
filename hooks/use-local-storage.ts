import { useEffect, useState } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(initialValue)

  useEffect(() => {
    // Retrieve from localStorage
    const item = window.localStorage.getItem(key)
    if (item) {
      try {
        const parsedItem = JSON.parse(item)
        if (parsedItem !== undefined) {
          setStoredValue(parsedItem)
        }
      } catch (error) {
        console.error('Error parsing stored value:', error)
      }
    }
  }, [key])

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value)
    // Save to localStorage
    if (value !== undefined) {
      window.localStorage.setItem(key, JSON.stringify(value))
    } else {
      window.localStorage.removeItem(key)
    }
  }
  return [storedValue, setValue]
}
