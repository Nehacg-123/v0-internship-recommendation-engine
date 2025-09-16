"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { useLanguage } from "./language-provider"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatbotProps {
  userProfile?: any
}

export function AIChatbot({ userProfile }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t, language } = useLanguage()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message when chatbot opens
      const welcomeMessage = getWelcomeMessage()
      setMessages([
        {
          id: Date.now().toString(),
          type: "bot",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, language])

  const getWelcomeMessage = () => {
    const greetings = {
      en: `Hello! I'm your PM Internship assistant. I can help you with:
• How to upload and optimize your resume
• Understanding match percentages
• Improving your skills for better matches
• General questions about the PM Internship Scheme
• Skill improvement recommendations

What would you like to know?`,
      hi: `नमस्ते! मैं आपका PM इंटर्नशिप सहायक हूं। मैं आपकी मदद कर सकता हूं:
• रिज्यूमे अपलोड और ऑप्टिमाइज़ करने में
• मैच प्रतिशत समझने में
• बेहतर मैच के लिए कौशल सुधारने में
• PM इंटर्नशिप योजना के बारे में सामान्य प्रश्न
• कौशल सुधार की सिफारिशें

आप क्या जानना चाहेंगे?`,
      kn: `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ PM ಇಂಟರ್ನ್‌ಶಿಪ್ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು:
• ರೆಸ್ಯೂಮ್ ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಆಪ್ಟಿಮೈಸ್ ಮಾಡುವುದು
• ಮ್ಯಾಚ್ ಶೇಕಡಾವಾರು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು
• ಉತ್ತಮ ಮ್ಯಾಚ್‌ಗಳಿಗಾಗಿ ಕೌಶಲ್ಯಗಳನ್ನು ಸುಧಾರಿಸುವುದು
• PM ಇಂಟರ್ನ್‌ಶಿಪ್ ಯೋಜನೆಯ ಬಗ್ಗೆ ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು
• ಕೌಶಲ್ಯ ಸುಧಾರಣೆ ಶಿಫಾರಸುಗಳು

ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?`,
      ta: `வணக்கம்! நான் உங்கள் PM இன்டர்ன்ஷிப் உதவியாளர். நான் உங்களுக்கு உதவ முடியும்:
• ரெஸ்யூம் பதிவேற்றம் மற்றும் மேம்படுத்துதல்
• பொருத்த சதவீதத்தை புரிந்துகொள்ளுதல்
• சிறந்த பொருத்தங்களுக்கு திறன்களை மேம்படுத்துதல்
• PM இன்டர்ன்ஷிப் திட்டம் பற்றிய பொதுவான கேள்விகள்
• திறன் மேம்பாட்டு பரிந்துரைகள்

நீங்கள் என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?`,
    }
    return greetings[language] || greetings.en
  }

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Resume-related questions
    if (lowerMessage.includes("resume") || lowerMessage.includes("cv") || lowerMessage.includes("upload")) {
      const responses = {
        en: `To upload your resume effectively:
1. Go to your Profile Setup page
2. Click "Choose File" in the Resume section
3. Select a PDF or DOC file (max 5MB)
4. Our system will automatically extract your skills
5. Review and add any missing skills manually

Tips for a better resume:
• Use clear section headers (Education, Experience, Skills)
• List specific technical skills
• Include relevant project experience
• Keep it concise (1-2 pages)`,
        hi: `अपना रिज्यूमे प्रभावी रूप से अपलोड करने के लिए:
1. अपने प्रोफाइल सेटअप पेज पर जाएं
2. रिज्यूमे सेक्शन में "फाइल चुनें" पर क्लिक करें
3. PDF या DOC फाइल चुनें (अधिकतम 5MB)
4. हमारा सिस्टम आपके कौशल को स्वचालित रूप से निकालेगा
5. समीक्षा करें और कोई भी गुम कौशल मैन्युअल रूप से जोड़ें

बेहतर रिज्यूमे के लिए टिप्स:
• स्पष्ट सेक्शन हेडर का उपयोग करें
• विशिष्ट तकनीकी कौशल सूचीबद्ध करें
• प्रासंगिक प्रोजेक्ट अनुभव शामिल करें`,
        kn: `ನಿಮ್ಮ ರೆಸ್ಯೂಮ್ ಅನ್ನು ಪರಿಣಾಮಕಾರಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು:
1. ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸೆಟಪ್ ಪುಟಕ್ಕೆ ಹೋಗಿ
2. ರೆಸ್ಯೂಮ್ ವಿಭಾಗದಲ್ಲಿ "ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ" ಕ್ಲಿಕ್ ಮಾಡಿ
3. PDF ಅಥವಾ DOC ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ (ಗರಿಷ್ಠ 5MB)
4. ನಮ್ಮ ಸಿಸ್ಟಂ ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಹೊರತೆಗೆಯುತ್ತದೆ
5. ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಕಾಣೆಯಾದ ಕೌಶಲ್ಯಗಳನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ಸೇರಿಸಿ`,
        ta: `உங்கள் ரெஸ்யூமை திறம்பட பதிவேற்ற:
1. உங்கள் சுயவிவர அமைப்பு பக்கத்திற்கு செல்லவும்
2. ரெஸ்யூம் பிரிவில் "கோப்பு தேர்வு" கிளிக் செய்யவும்
3. PDF அல்லது DOC கோப்பு தேர்வு செய்யவும் (அதிகபட்சம் 5MB)
4. எங்கள் அமைப்பு உங்கள் திறன்களை தானாகவே பிரித்தெடுக்கும்
5. மதிப்பாய்வு செய்து விடுபட்ட திறன்களை கைமுறையாக சேர்க்கவும்`,
      }
      return responses[language] || responses.en
    }

    // Match percentage questions
    if (lowerMessage.includes("match") || lowerMessage.includes("percentage") || lowerMessage.includes("%")) {
      const responses = {
        en: `Match percentage is calculated based on:

🎯 Skills Match (40%): How many of your skills match the internship requirements
📚 Education Fit (20%): Your education level vs. internship requirements  
🏢 Sector Match (20%): Your sector interests vs. internship sector
📍 Location (20%): Your location preference vs. internship location

Higher percentages mean better fit! Aim for 70%+ matches for the best opportunities.`,
        hi: `मैच प्रतिशत की गणना इस आधार पर की जाती है:

🎯 कौशल मैच (40%): आपके कितने कौशल इंटर्नशिप आवश्यकताओं से मेल खाते हैं
📚 शिक्षा फिट (20%): आपका शिक्षा स्तर बनाम इंटर्नशिप आवश्यकताएं
🏢 सेक्टर मैच (20%): आपके सेक्टर हित बनाम इंटर्नशिप सेक्टर
📍 स्थान (20%): आपकी स्थान प्राथमिकता बनाम इंटर्नशिप स्थान

उच्च प्रतिशत का मतलब बेहतर फिट है! सर्वोत्तम अवसरों के लिए 70%+ मैच का लक्ष्य रखें।`,
        kn: `ಮ್ಯಾಚ್ ಶೇಕಡಾವಾರು ಇದರ ಆಧಾರದ ಮೇಲೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ:

🎯 ಕೌಶಲ್ಯ ಮ್ಯಾಚ್ (40%): ನಿಮ್ಮ ಎಷ್ಟು ಕೌಶಲ್ಯಗಳು ಇಂಟರ್ನ್‌ಶಿಪ್ ಅವಶ್ಯಕತೆಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತವೆ
📚 ಶಿಕ್ಷಣ ಫಿಟ್ (20%): ನಿಮ್ಮ ಶಿಕ್ಷಣ ಮಟ್ಟ ವಿರುದ್ಧ ಇಂಟರ್ನ್‌ಶಿಪ್ ಅವಶ್ಯಕತೆಗಳು
🏢 ಸೆಕ್ಟರ್ ಮ್ಯಾಚ್ (20%): ನಿಮ್ಮ ಸೆಕ್ಟರ್ ಆಸಕ್ತಿಗಳು ವಿರುದ್ಧ ಇಂಟರ್ನ್‌ಶಿಪ್ ಸೆಕ್ಟರ್
📍 ಸ್ಥಳ (20%): ನಿಮ್ಮ ಸ್ಥಳ ಆದ್ಯತೆ ವಿರುದ್ಧ ಇಂಟರ್ನ್‌ಶಿಪ್ ಸ್ಥಳ

ಹೆಚ್ಚಿನ ಶೇಕಡಾವಾರು ಎಂದರೆ ಉತ್ತಮ ಫಿಟ್! ಅತ್ಯುತ್ತಮ ಅವಕಾಶಗಳಿಗಾಗಿ 70%+ ಮ್ಯಾಚ್‌ಗಳನ್ನು ಗುರಿಯಾಗಿಸಿ।`,
        ta: `பொருத்த சதவீதம் இதன் அடிப்படையில் கணக்கிடப்படுகிறது:

🎯 திறன் பொருத்தம் (40%): உங்கள் எத்தனை திறன்கள் இன்டர்ன்ஷிப் தேவைகளுடன் பொருந்துகின்றன
📚 கல்வி பொருத்தம் (20%): உங்கள் கல்வி நிலை vs இன்டர்ன்ஷிப் தேவைகள்
🏢 துறை பொருத்தம் (20%): உங்கள் துறை ஆர்வங்கள் vs இன்டர்ன்ஷிப் துறை
📍 இடம் (20%): உங்கள் இட விருப்பம் vs இன்டர்ன்ஷிப் இடம்

அதிக சதவீதம் என்றால் சிறந்த பொருத்தம்! சிறந்த வாய்ப்புகளுக்கு 70%+ பொருத்தங்களை இலக்காக வைக்கவும்.`,
      }
      return responses[language] || responses.en
    }

    // Skill improvement questions
    if (lowerMessage.includes("skill") || lowerMessage.includes("improve") || lowerMessage.includes("learn")) {
      const responses = {
        en: `Here are ways to improve your skills:

📚 Online Learning Platforms:
• Coursera - Professional certificates
• edX - University courses
• Udemy - Practical skills
• Khan Academy - Fundamentals

🛠️ Technical Skills:
• Programming: FreeCodeCamp, Codecademy
• Design: Adobe Creative Suite tutorials
• Data Analysis: Kaggle Learn
• Digital Marketing: Google Digital Garage

💼 Soft Skills:
• Communication: Toastmasters
• Leadership: LinkedIn Learning
• Project Management: PMI resources

Focus on skills that appear frequently in your target internships!`,
        hi: `अपने कौशल सुधारने के तरीके:

📚 ऑनलाइन लर्निंग प्लेटफॉर्म:
• Coursera - व्यावसायिक प्रमाणपत्र
• edX - विश्वविद्यालय पाठ्यक्रम
• Udemy - व्यावहारिक कौशल
• Khan Academy - बुनियादी बातें

🛠️ तकनीकी कौशल:
• प्रोग्रामिंग: FreeCodeCamp, Codecademy
• डिज़ाइन: Adobe Creative Suite ट्यूटोरियल
• डेटा विश्लेषण: Kaggle Learn
• डिजिटल मार्केटिंग: Google Digital Garage

💼 सॉफ्ट स्किल्स:
• संचार: Toastmasters
• नेतृत्व: LinkedIn Learning
• प्रोजेक्ट प्रबंधन: PMI संसाधन`,
        kn: `ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ಸುಧಾರಿಸುವ ಮಾರ್ಗಗಳು:

📚 ಆನ್‌ಲೈನ್ ಕಲಿಕೆ ವೇದಿಕೆಗಳು:
• Coursera - ವೃತ್ತಿಪರ ಪ್ರಮಾಣಪತ್ರಗಳು
• edX - ವಿಶ್ವವಿದ್ಯಾಲಯ ಕೋರ್ಸ್‌ಗಳು
• Udemy - ಪ್ರಾಯೋಗಿಕ ಕೌಶಲ್ಯಗಳು
• Khan Academy - ಮೂಲಭೂತ ಅಂಶಗಳು

🛠️ ತಾಂತ್ರಿಕ ಕೌಶಲ್ಯಗಳು:
• ಪ್ರೋಗ್ರಾಮಿಂಗ್: FreeCodeCamp, Codecademy
• ಡಿಸೈನ್: Adobe Creative Suite ಟ್ಯುಟೋರಿಯಲ್‌ಗಳು
• ಡೇಟಾ ವಿಶ್ಲೇಷಣೆ: Kaggle Learn
• ಡಿಜಿಟಲ್ ಮಾರ್ಕೆಟಿಂಗ್: Google Digital Garage`,
        ta: `உங்கள் திறன்களை மேம்படுத்தும் வழிகள்:

📚 ஆன்லைன் கற்றல் தளங்கள்:
• Coursera - தொழில்முறை சான்றிதழ்கள்
• edX - பல்கலைக்கழக படிப்புகள்
• Udemy - நடைமுறை திறன்கள்
• Khan Academy - அடிப்படைகள்

🛠️ தொழில்நுட்ப திறன்கள்:
• நிரலாக்கம்: FreeCodeCamp, Codecademy
• வடிவமைப்பு: Adobe Creative Suite பயிற்சிகள்
• தரவு பகுப்பாய்வு: Kaggle Learn
• டிஜிட்டல் மார்க்கெட்டிங்: Google Digital Garage`,
      }
      return responses[language] || responses.en
    }

    // PM Internship Scheme questions
    if (lowerMessage.includes("pm internship") || lowerMessage.includes("scheme") || lowerMessage.includes("program")) {
      const responses = {
        en: `About the PM Internship Scheme:

🎯 Objective: Provide practical work experience to students and recent graduates

📋 Eligibility:
• Students in final year of graduation/post-graduation
• Recent graduates (within 2 years)
• Age limit: 21-24 years

💰 Benefits:
• Monthly stipend of ₹5,000
• Certificate of completion
• Real work experience
• Networking opportunities

⏰ Duration: 6-12 months depending on the internship

📍 Sectors: Technology, Healthcare, Finance, Education, Government, and more

Apply through this portal to get matched with suitable opportunities!`,
        hi: `PM इंटर्नशिप योजना के बारे में:

🎯 उद्देश्य: छात्रों और हाल के स्नातकों को व्यावहारिक कार्य अनुभव प्रदान करना

📋 पात्रता:
• स्नातक/स्नातकोत्तर के अंतिम वर्ष के छात्र
• हाल के स्नातक (2 वर्ष के भीतर)
• आयु सीमा: 21-24 वर्ष

💰 लाभ:
• ₹5,000 मासिक वजीफा
• पूर्णता प्रमाणपत्र
• वास्तविक कार्य अनुभव
• नेटवर्किंग के अवसर

⏰ अवधि: इंटर्नशिप के आधार पर 6-12 महीने

📍 क्षेत्र: प्रौद्योगिकी, स्वास्थ्य सेवा, वित्त, शिक्षा, सरकार, और अधिक`,
        kn: `PM ಇಂಟರ್ನ್‌ಶಿಪ್ ಯೋಜನೆಯ ಬಗ್ಗೆ:

🎯 ಉದ್ದೇಶ: ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಇತ್ತೀಚಿನ ಪದವೀಧರರಿಗೆ ಪ್ರಾಯೋಗಿಕ ಕೆಲಸದ ಅನುಭವವನ್ನು ಒದಗಿಸುವುದು

📋 ಅರ್ಹತೆ:
• ಪದವಿ/ಸ್ನಾತಕೋತ್ತರ ಅಂತಿಮ ವರ್ಷದ ವಿದ್ಯಾರ್ಥಿಗಳು
• ಇತ್ತೀಚಿನ ಪದವೀಧರರು (2 ವರ್ಷಗಳೊಳಗೆ)
• ವಯಸ್ಸಿನ ಮಿತಿ: 21-24 ವರ್ಷಗಳು

💰 ಪ್ರಯೋಜನಗಳು:
• ₹5,000 ಮಾಸಿಕ ಸ್ಟೈಪೆಂಡ್
• ಪೂರ್ಣಗೊಳಿಸುವಿಕೆಯ ಪ್ರಮಾಣಪತ್ರ
• ನಿಜವಾದ ಕೆಲಸದ ಅನುಭವ
• ನೆಟ್‌ವರ್ಕಿಂಗ್ ಅವಕಾಶಗಳು`,
        ta: `PM இன்டர்ன்ஷிப் திட்டம் பற்றி:

🎯 நோக்கம்: மாணவர்கள் மற்றும் சமீபத்திய பட்டதாரிகளுக்கு நடைமுறை பணி அனுபவம் வழங்குதல்

📋 தகுதி:
• பட்டம்/முதுகலை இறுதி ஆண்டு மாணவர்கள்
• சமீபத்திய பட்டதாரிகள் (2 ஆண்டுகளுக்குள்)
• வயது வரம்பு: 21-24 ஆண்டுகள்

💰 நன்மைகள்:
• ₹5,000 மாதாந்திர உதவித்தொகை
• நிறைவு சான்றிதழ்
• உண்மையான பணி அனுபவம்
• நெட்வொர்க்கிங் வாய்ப்புகள்`,
      }
      return responses[language] || responses.en
    }

    // Default response
    const defaultResponses = {
      en: `I can help you with:
• Resume upload and optimization tips
• Understanding match percentages
• Skill improvement recommendations
• PM Internship Scheme information
• General guidance on internship applications

Please ask me about any of these topics!`,
      hi: `मैं आपकी इनमें मदद कर सकता हूं:
• रिज्यूमे अपलोड और ऑप्टिमाइज़ेशन टिप्स
• मैच प्रतिशत समझना
• कौशल सुधार की सिफारिशें
• PM इंटर्नशिप योजना की जानकारी
• इंटर्नशिप आवेदन पर सामान्य मार्गदर्शन

कृपया मुझसे इनमें से किसी भी विषय के बारे में पूछें!`,
      kn: `ನಾನು ನಿಮಗೆ ಇವುಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು:
• ರೆಸ್ಯೂಮ್ ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಆಪ್ಟಿಮೈಸೇಶನ್ ಸಲಹೆಗಳು
• ಮ್ಯಾಚ್ ಶೇಕಡಾವಾರು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು
• ಕೌಶಲ್ಯ ಸುಧಾರಣೆ ಶಿಫಾರಸುಗಳು
• PM ಇಂಟರ್ನ್‌ಶಿಪ್ ಯೋಜನೆಯ ಮಾಹಿತಿ
• ಇಂಟರ್ನ್‌ಶಿಪ್ ಅರ್ಜಿಗಳ ಬಗ್ಗೆ ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನ

ದಯವಿಟ್ಟು ಈ ವಿಷಯಗಳಲ್ಲಿ ಯಾವುದಾದರೂ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ!`,
      ta: `நான் உங்களுக்கு இவற்றில் உதவ முடியும்:
• ரெஸ்யூம் பதிவேற்றம் மற்றும் மேம்படுத்தல் குறிப்புகள்
• பொருத்த சதவீதத்தை புரிந்துகொள்ளுதல்
• திறன் மேம்பாட்டு பரிந்துரைகள்
• PM இன்டர்ன்ஷிப் திட்ட தகவல்
• இன்டர்ன்ஷிப் விண்ணப்பங்கள் பற்றிய பொதுவான வழிகாட்டுதல்

தயவுசெய்து இந்த தலைப்புகளில் ஏதேனும் ஒன்றைப் பற்றி என்னிடம் கேளுங்கள்!`,
    }
    return defaultResponses[language] || defaultResponses.en
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse = getBotResponse(inputValue)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // 1-2 second delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              {t("common.assistant") || "AI Assistant"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                        message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("chatbot.placeholder") || "Ask me anything..."}
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
