import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

// Define interfaces
interface Question {
  id: string;
  question: string;
  category: string;
  tips?: string;
}

interface Answer {
  question: Question;
  response: string;
  feedback: string;
  score: number;
}

// Questions database
const questions: Record<string, Question[]> = {
  beginner: [
    {
      id: 'b_html_1',
      question: 'Would you like to upload a photo for your CV? (Optional)',
      category: 'Personal Information',
      tips: 'Photos can personalize your CV but are optional unless required by the employer.',
    },
    {
      id: 'b_html_2',
      question: 'What is your full name?',
      category: 'Personal Information',
      tips: 'Use the full name you’d use professionally on job applications and LinkedIn.',
    },
    {
      id: 'b_html_3',
      question: 'Which city do you live in?',
      category: 'Personal Information',
      tips: 'Include your current city or the one you are applying in for relevance.',
    },
    {
      id: 'b_html_4',
      question: 'What is your phone number?',
      category: 'Personal Information',
      tips: 'Double-check for accuracy so employers can reach you easily.',
    },
    {
      id: 'b_html_5',
      question: 'What is your email address?',
      category: 'Personal Information',
      tips: 'Use a professional email, ideally your first and last name.',
    },
    {
      id: 'b_html_6',
      question: 'Would you like to add a personal website? (Optional)',
      category: 'Personal Information',
      tips: 'Include a portfolio or blog if it showcases your work or skills.',
    },
    {
      id: 'b_html_7',
      question: 'Would you like to add a LinkedIn profile? (Optional)',
      category: 'Personal Information',
      tips: 'A complete LinkedIn profile can boost your credibility with recruiters.',
    },
    {
      id: 'b_css_1',
      question: 'Write a short summary about yourself.',
      category: 'Profile',
      tips: 'Briefly highlight your key skills, experience, and career goals in 2–3 lines.\n\n(e.g.) Passionate Computer Science student with a strong foundation in web development and cybersecurity. Seeking internship opportunities to apply technical skills and grow professionally in a dynamic tech environment.',
    },
    {
      id: 'b_js_1',
      question: 'List your educational background. For each include degree - school - location - and year — (separated by commas).',
      category: 'Education',
      tips: 'List your most relevant or highest education credentials. \n\n (e.g.) BSc in Computer Science - USTHB - Algiers - 2023 , Master Cybersecurity - USTHB - Algiers - 2025',
    },
    {
      id: 'b_react_1',
      question: 'Describe your most relevant work or project experience. Include job titles, roles, or achievements ((comma-separated).',
      category: 'Experience',
      tips: 'Describe your work or internship experiences. Mention the role, company, duration, and key achievements or responsibilities.\n\n(e.g.) Frontend Developer, TechCorp, 2022–2024\n- Developed user-friendly UI with React\n- Improved page speed by 40%\n\n Cybersecurity Intern, SecureIT, Summer 2023\n- Monitored network traffic for suspicious activity\n- Conducted vulnerability assessments and wrote reports\n\n Freelance Web Developer, 2021–2022\n- Built websites for small businesses using HTML/CSS/JS\n- Integrated contact forms and SEO best practices',

    },
    {
      id: 'b_gen_1',
      question: 'List your top skills (comma-separated).',
      category: 'Skills',
      tips: 'Include hard skills relevant to the job, like programming languages or tools.\n\n (e.g.) JavaScript, Python, React, Problem Solving, Teamwork, Communication',
    },
    {
      id: 'b_gen_2',
      question: 'Which languages do you speak?',
      category: 'Languages',
      tips: 'Mention both spoken and written proficiency if relevant to your work. \n\n (e.g.) English - fluent, French - intermediate, Arabic - native',
    },
    {
      id: 'b_gen_3',
      question: 'List your interests (comma-separated).',
      category: 'Interests',
      tips: 'Add hobbies that reflect your personality or support your professional image.\n\n (e.g.) Coding, Reading, Traveling, Gaming, Cooking',
    },
    {
      id: 'b_gen_4',
      question: 'Would you like to add any of the following: Internships, Extracurriculars, Certificates, Qualities, or References? Please type the one you\'d like to add (e.g., Internships), or click Skip to continue without adding any.',
      category: 'Additional Info',
      tips: 'Optional sections help showcase additional strengths and experiences.',
    },
  ],
};


const optionalCategoryOptions = [
  "Internships",
  "Extracurriculars",
  "Certificates",
  "Qualities",
  "References"
];

const followUpQuestionsMap: Record<string, string> = {
  Internships: "Please mention your Internships.",
  Extracurriculars: "Please describe your Extracurricular activities.",
  Certificates: "Please list your relevant Certificates.",
  Qualities: "Mention a few personal or professional Qualities you’re proud of.",
  References: "Add any References you’d like to include.",
};


// QuestionCard Component
const QuestionCard: React.FC<{
  question: Question;
  isRequired: boolean;
  isAnswerValid?: boolean;
  currentAnswer: string;
  setCurrentAnswer: (value: string) => void;
  handleSend: () => void;
  handleSkip: () => void;
  setPhotoFile?: (file: File) => void;
}> = ({ question, isRequired, isAnswerValid = true, currentAnswer, setCurrentAnswer, handleSend, handleSkip, setPhotoFile }) => {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isPhotoQuestion =
    question.question.toLowerCase().includes('upload a photo');

  const handleTextAreaClick = () => {
    if (isPhotoQuestion && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setCurrentAnswer(file.name);
    if (setPhotoFile) setPhotoFile(file); // ⬅️ This line is key
  }
};

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            {question.category}
          </div>
          <div className="mt-1 font-medium text-gray-800">{question.question}</div>
        </div>
      </div>

      {question.tips && (
        <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          <span className="font-semibold">💡 Tip:</span> {question.tips}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
          Your Answer:
        </label>

        {/* Hidden file input */}
        {isPhotoQuestion && (
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        )}

        <textarea
          id="answer"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
          rows={isPhotoQuestion ? 1 : 5}
          readOnly={isPhotoQuestion}
          onClick={handleTextAreaClick}
          value={currentAnswer}
          onChange={(e) => !isPhotoQuestion && setCurrentAnswer(e.target.value)}
          placeholder={
            isPhotoQuestion
              ? 'Click here to upload a photo...'
              : 'Say or write your answer here..'
          }
        />

        {!isPhotoQuestion && (
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>{currentAnswer.trim().split(/\s+/).filter(w => w.length > 0).length} words</div>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
  {!isRequired && (
    <button
      onClick={handleSkip}
      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
    >
      Skip
    </button>
  )}
  <button
  onClick={handleSend}
  disabled={!currentAnswer.trim() || !isAnswerValid}
  className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl transition ${
    (!currentAnswer.trim() || !isAnswerValid)
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:bg-blue-700'
  }`}
>
  Send
</button>

</div>

    </div>
  );
};




// Interview Component
const Interview: React.FC = () => {
  const [step, setStep] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [customFlowStep, setCustomFlowStep] = useState<null | 'awaiting-extra' | 'awaiting-confirmation'>(null);
  const [lastOptionalChoice, setLastOptionalChoice] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  

  const filteredQuestions = questions['beginner'];

  const requiredIds = [
  'b_html_2',
  'b_html_3',
  'b_html_4',
  'b_html_5',
  'b_css_1',
  'b_js_1',
  'b_react_1',
  'b_gen_1',
  'b_gen_2',
  'b_gen_3',
];
const currentQuestion = filteredQuestions[step];
const isRequired = currentQuestion ? requiredIds.includes(currentQuestion.id) : false;


const isOptionalPicker = currentQuestion?.id === 'b_gen_4';

const validOptionalChoices = optionalCategoryOptions.map(opt => opt.toLowerCase());


const isValidOptionalChoice =
  !isOptionalPicker || // if it's not that question, no need to validate
  validOptionalChoices.some((opt) =>
    currentAnswer.trim().toLowerCase().includes(opt)
  );


const isConfirmationQuestion = currentQuestion?.id === 'confirm_more_optional';


const isValidConfirmationAnswer =
  !isConfirmationQuestion || // no need to validate other questions
  ['yes', 'no'].includes(currentAnswer.trim().toLowerCase());



 const isAnswerValid = customFlowStep === 'awaiting-confirmation'
  ? ['yes', 'no'].includes(currentAnswer.trim().toLowerCase())
  : currentQuestion?.id === 'b_gen_4'
  ? validOptionalChoices.some((opt) =>
      currentAnswer.trim().toLowerCase().includes(opt)
    )
  : true;

  const [isCompleted, setIsCompleted] = useState(false);


const handleSend = () => {
  if (!currentAnswer.trim()) return;

  // Case 1: Main flow
  if (!customFlowStep) {
    const current = filteredQuestions[step];

    if (current.id === 'b_gen_4') {
      const choice = optionalCategoryOptions.find(opt =>
        currentAnswer.toLowerCase().includes(opt.toLowerCase())
      );

      if (choice) {
        setLastOptionalChoice(choice);
        setCustomFlowStep('awaiting-extra');
        setCurrentAnswer('');
        return;
      }
    }

    const newAnswer: Answer = {
      question: current,
      response: currentAnswer,
      feedback: '',
      score: 0,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    setCurrentAnswer('');
    setStep(prev => prev + 1);
    return;
  }

  // Case 2: Follow-up optional section (Internships etc.)
  if (customFlowStep === 'awaiting-extra' && lastOptionalChoice) {
    const newAnswer: Answer = {
      question: {
        id: `optional_${lastOptionalChoice.toLowerCase()}`,
        question: followUpQuestionsMap[lastOptionalChoice],
        category: "Additional Info",
      },
      response: currentAnswer,
      feedback: '',
      score: 0,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    setCustomFlowStep('awaiting-confirmation');
    setCurrentAnswer('');
    return;
  }

  // Case 3: Confirmation for more optional info
if (customFlowStep === 'awaiting-confirmation') {
  const wantsMore = currentAnswer.trim().toLowerCase().startsWith('y');
  setCurrentAnswer('');

  if (wantsMore) {
    setCustomFlowStep(null); // ⬅️ Go back to b_gen_4 again
    return;
  } else {
    setStep((prev) => {
      const nextStep = prev + 1;
      if (nextStep >= filteredQuestions.length) {
        setIsCompleted(true); // ⬅️ You're done!
      }
      return nextStep;
    });
  }
}

};



const handleDownload = () => {
  const doc = new jsPDF();
  let y = 10;
  const PAGE_HEIGHT = 297;

  const checkPageBreak = (space = 10) => {
    if (y + space >= PAGE_HEIGHT - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const getAnswer = (id: string) =>
    answers.find((a) => a.question.id === id)?.response || "";

  const fullName = getAnswer("b_html_2");
  const city = getAnswer("b_html_3");
  const phone = getAnswer("b_html_4");
  const email = getAnswer("b_html_5");
  const summary = getAnswer("b_css_1");
  const education = getAnswer("b_js_1");
  const experience = getAnswer("b_react_1");
  const skills = getAnswer("b_gen_1").split(",");
  const languages = getAnswer("b_gen_2").split(",");
  const interests = getAnswer("b_gen_3").split(",");
  const website = getAnswer("b_html_6");
  const linkedin = getAnswer("b_html_7");
  const photoAnswer = getAnswer("b_html_1"); // file name

  const optionalAnswers = answers.filter((a) =>
    a.question.id.startsWith("optional_")
  );
  const additionalInfo = optionalAnswers
    .map((a) => {
      const sectionTitle = a.question.id
        .replace("optional_", "")
        .replace(/^\w/, (c) => c.toUpperCase());
      return `${sectionTitle}:\n• ${a.response}`;
    })
    .join("\n\n");

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const drawSectionHeader = (label: string) => {
    checkPageBreak(20);
    y += 8;

    // Colors
    const accent = [108, 76, 159]; // #6C4C9F
    const lightPurple = [229, 218, 240]; // #E5DAF0

   doc.setDrawColor(accent[0], accent[1], accent[2]); 
    doc.setFillColor(lightPurple[0], lightPurple[1], lightPurple[2]);
    doc.rect(20, y - 5, 170, 10, "F");

    doc.setLineWidth(0.5);
    doc.line(20, y + 5, 190, y + 5);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text(label.toUpperCase(), 22, y + 3);

    y += 10;
    doc.setTextColor(0, 0, 0);
  };

  const generatePDF = () => {
    // Header background
    doc.setFillColor(229, 218, 240); // Light purple
    doc.rect(0, 0, 210, 20, "F");

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`${city}     |     ${phone}     |     ${email}`, 105, 8, {
      align: "center",
    });

    if (website || linkedin) {
      const extra = [website, linkedin].filter(Boolean).join("     |     ");
      doc.text(extra, 105, 15, { align: "center" });
    }

    y = 30;

    // Full Name
    const nameY = 25 + 40 / 2 + 5;
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(fullName, 70, nameY);
    y = 70;

    // Career Objective
    drawSectionHeader("Career Objective");
    const summaryLines = doc.splitTextToSize(summary, 170);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(summaryLines, 22, y);
    y += summaryLines.length * 6;

    // Skills
    drawSectionHeader("Core Qualifications");
    skills.forEach((skill) => {
      doc.text(`• ${capitalize(skill.trim())}`, 25, y);
      y += 6;
    });

    // Experience
    drawSectionHeader("Work Experience");
    const experienceItems = experience.split(",");
    experienceItems.forEach((exp) => {
      const lines = doc.splitTextToSize(`• ${exp.trim()}`, 170);
      lines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, 25, y);
        y += 6;
      });
    });

    // Education
    drawSectionHeader("Education");
    const educationItems = education.split(",");
    educationItems.forEach((edu) => {
      const lines = doc.splitTextToSize(`• ${edu.trim()}`, 170);
      lines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, 25, y);
        y += 6;
      });
    });

    // Languages
    drawSectionHeader("Languages");
    languages.forEach((lang) => {
      doc.text(`• ${capitalize(lang.trim())}`, 25, y);
      y += 6;
    });

    // Interests
    drawSectionHeader("Interests");
    interests.forEach((i) => {
      doc.text(`• ${capitalize(i.trim())}`, 25, y);
      y += 6;
    });

    // Optional Info
    if (additionalInfo && additionalInfo.trim() !== "") {
      drawSectionHeader("Additional Info");
      const lines = doc.splitTextToSize(additionalInfo, 160);
      lines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, 25, y);
        y += 6;
      });
    }

    doc.save("CV.pdf");
  };

  // Photo (unchanged logic)
  if (photoAnswer && photoFile) {
    const img = new Image();
    img.src = URL.createObjectURL(photoFile);
    img.onload = () => {
      doc.addImage(img, "PNG", 20, 25, 40, 40); // top-left
      generatePDF();
    };
  } else {
    generatePDF();
  }
};




  const handleSkip = () => {
    if (step + 1 < filteredQuestions.length) {
      setStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">📋 CV Generator</h1>
        </div>
        

      {isCompleted ? (
  <div className="bg-white p-6 rounded-xl shadow space-y-4 text-center">
    <h2 className="text-xl font-bold text-green-700">🎉 Congratulations!</h2>
    <p>You have successfully created your professional CV.</p>
    <button
      onClick={handleDownload}
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download your CV
    </button>
  </div>
) : customFlowStep === 'awaiting-extra' && lastOptionalChoice ? (
  <QuestionCard
    question={{
      id: `optional_${lastOptionalChoice.toLowerCase()}`,
      question: followUpQuestionsMap[lastOptionalChoice],
      category: "Additional Info",
      
    }}
    isRequired={false}
    isAnswerValid={true}
    currentAnswer={currentAnswer}
    setCurrentAnswer={setCurrentAnswer}
    handleSend={handleSend}
    handleSkip={handleSkip}
  />
) : customFlowStep === 'awaiting-confirmation' ? (
  <QuestionCard
    question={{
      id: 'confirm_more_optional',
      question: "Do you want to mention any other info? (yes/no)",
      category: "Additional Info",
    }}
    isRequired={false}
    currentAnswer={currentAnswer}
    setCurrentAnswer={setCurrentAnswer}
    handleSend={handleSend}
    handleSkip={handleSkip}
  />
 ) : currentQuestion ? (
  <QuestionCard
    question={currentQuestion}
    isRequired={requiredIds.includes(currentQuestion.id)}
    isAnswerValid={isAnswerValid}
    currentAnswer={currentAnswer}
    setCurrentAnswer={setCurrentAnswer}
    handleSend={handleSend}
    handleSkip={handleSkip}
    setPhotoFile={setPhotoFile}

  />
) : null}




        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((step + 1) / filteredQuestions.length) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 text-center mt-1">
            {step + 1} / {filteredQuestions.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
