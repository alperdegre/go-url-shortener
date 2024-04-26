import { LangContext } from "@/context/langContext"
import { Language } from "@/lib/types"
import { useContext, useState } from "react"
import { motion } from "framer-motion"

function LanguageSwitch() {
  const { language, changeLanguage } = useContext(LangContext)
  const [isOn, setIsOn] = useState(language !== Language.GO)

  const toggleSwitch = () => {
    setIsOn(prev => !prev)
    handleLanguageChange()
  }

  const handleLanguageChange = () => {
    if (language === Language.GO) {
      changeLanguage(Language.PYTHON)
    } else {
      changeLanguage(Language.GO)
    }
  }

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30
  };

  return <div className="switch bg-slate-200" data-isOn={isOn} onClick={toggleSwitch}>
    <motion.div className="handle" layout data-isOn={isOn} transition={spring} />
  </div>

}

export default LanguageSwitch
