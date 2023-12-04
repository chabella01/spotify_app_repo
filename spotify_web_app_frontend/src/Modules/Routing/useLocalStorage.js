import {useState} from "react";


export const useLocalStorage = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = sessionStorage.getItem(keyName)
            if (value) {
                return JSON.parse(value)
            } else {
                sessionStorage.setItem(keyName, JSON.stringify(defaultValue))
                return defaultValue
            }

        } catch(e) {
            console.error(e)
            return defaultValue
        }
    })
    const setValue = (newValue) => {
        try {
            sessionStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (err) {}
        setStoredValue(newValue);
    };
    return [storedValue, setValue];
}