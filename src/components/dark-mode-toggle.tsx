"use client"

import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Moon, Sun, Laptop } from "lucide-react"
import { useEffect, useState } from "react"

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const modeOptions = [
    { value: "dark", icon: Moon },
    { value: "system", icon: Laptop },
    { value: "light", icon: Sun },
  ]

  const getActiveModeIndex = () => modeOptions.findIndex(option => option.value === theme)

  const handleThemeChange = (newTheme: string) => {
    setIsChanging(true)
    setTheme(newTheme)
    setTimeout(() => setIsChanging(false), 300) // Adjust timing as needed
  }

  const getAnimation = (value: string) => {
    if (!isChanging || theme !== value) return {}
    switch (value) {
      case "dark":
        return { scale: [1, 0.9, 1.1, 1] }
      case "system":
        return { rotate: [0, -45, 45, 0] }
      case "light":
        return { rotate: 360 }
      default:
        return {}
    }
  }

  if (!mounted) {
    return <div className="w-[72px] h-[28px]" /> // Placeholder with correct dimensions
  }

  return (
    <div className="bg-background rounded-full p-0.5 flex items-center shadow-md relative border">
    <motion.div
      className="absolute bg-primary rounded-full w-6 h-6"
      initial={false}
      animate={{
        x: getActiveModeIndex() * 24,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    />
    {modeOptions.map((option) => (
      <motion.button
        key={option.value}
        className={`relative rounded-full p-1.5 z-10 ${
          theme === option.value ? 'text-primary-foreground' : 'text-muted-foreground'
        }`}
        onClick={() => handleThemeChange(option.value)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={isChanging}
      >
        <motion.div
          animate={getAnimation(option.value)}
          transition={{ duration: 0.3 }}
        >
          <option.icon className="w-3 h-3" />
        </motion.div>
      </motion.button>
    ))}
  </div>
  )
}