// app/routes/types.ts
export interface Question {
  id: string;
  question: string;
  category: string;
  level: string;
  tips?: string;
  feedback: {
    good: string;
    bad: string;
  };
  evaluationCriteria: string[];
}

export interface InterviewLevel {
  id: string;
  name: string;
  description: string;
  duration: number;
  questionCount: number;
}

export interface Answer {
  question: Question;
  answer: string;
  feedback: string;
  score: number;
}