
// Mock API service - replace with real API calls in production
export interface Examiner {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  examsCreated: number;
  lastLogin: string;
  joinedDate: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  examTitle: string;
  status: 'invited' | 'in-progress' | 'completed' | 'submitted';
  score?: number;
  timeSpent?: string;
  submittedAt?: string;
  invitedAt: string;
}

export interface ExamDetails {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  duration: number;
  status: 'draft' | 'active' | 'completed';
  candidates: number;
  completedSubmissions: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Mock API responses
const MOCK_EXAMINERS: Examiner[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Senior HR Manager',
    status: 'active',
    examsCreated: 12,
    lastLogin: '2024-01-15',
    joinedDate: '2023-06-15'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'Technical Recruiter',
    status: 'active',
    examsCreated: 8,
    lastLogin: '2024-01-14',
    joinedDate: '2023-08-20'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'HR Coordinator',
    status: 'inactive',
    examsCreated: 5,
    lastLogin: '2024-01-10',
    joinedDate: '2023-11-05'
  }
];

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    examTitle: 'JavaScript Fundamentals',
    status: 'completed',
    score: 85,
    timeSpent: '45 mins',
    submittedAt: '2024-01-15T10:30:00Z',
    invitedAt: '2024-01-14T09:00:00Z'
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    examTitle: 'React Components',
    status: 'in-progress',
    invitedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob.wilson@email.com',
    examTitle: 'Algorithm Challenge',
    status: 'invited',
    invitedAt: '2024-01-15T14:00:00Z'
  },
  {
    id: '4',
    name: 'Carol Brown',
    email: 'carol.brown@email.com',
    examTitle: 'JavaScript Fundamentals',
    status: 'submitted',
    score: 92,
    timeSpent: '38 mins',
    submittedAt: '2024-01-15T16:45:00Z',
    invitedAt: '2024-01-15T08:00:00Z'
  }
];

const MOCK_EXAMS: ExamDetails[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test basic JavaScript concepts including variables, functions, and DOM manipulation',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-01-10T10:00:00Z',
    duration: 60,
    status: 'active',
    candidates: 25,
    completedSubmissions: 18,
    difficulty: 'easy'
  },
  {
    id: '2',
    title: 'React Components',
    description: 'Build and test React components with state management and props',
    createdBy: 'Mike Chen',
    createdAt: '2024-01-12T14:30:00Z',
    duration: 90,
    status: 'active',
    candidates: 15,
    completedSubmissions: 8,
    difficulty: 'medium'
  },
  {
    id: '3',
    title: 'Algorithm Challenge',
    description: 'Solve complex algorithmic problems and optimize solutions',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-01-08T09:15:00Z',
    duration: 120,
    status: 'completed',
    candidates: 30,
    completedSubmissions: 30,
    difficulty: 'hard'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const examinerApi = {
  getAll: async (): Promise<Examiner[]> => {
    try {
      await delay(500);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/examiners');
      // return response.json();
      return MOCK_EXAMINERS;
    } catch (error) {
      console.error('Failed to fetch examiners:', error);
      return MOCK_EXAMINERS; // Fallback to dummy data
    }
  },

  create: async (examiner: Omit<Examiner, 'id'>): Promise<Examiner> => {
    try {
      await delay(300);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/examiners', {
      //   method: 'POST',
      //   body: JSON.stringify(examiner)
      // });
      // return response.json();
      const newExaminer = { ...examiner, id: Date.now().toString() };
      MOCK_EXAMINERS.push(newExaminer);
      return newExaminer;
    } catch (error) {
      console.error('Failed to create examiner:', error);
      throw error;
    }
  }
};

export const candidateApi = {
  getAll: async (): Promise<Candidate[]> => {
    try {
      await delay(400);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/candidates');
      // return response.json();
      return MOCK_CANDIDATES;
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      return MOCK_CANDIDATES; // Fallback to dummy data
    }
  }
};

export const examApi = {
  getAll: async (): Promise<ExamDetails[]> => {
    try {
      await delay(600);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/exams');
      // return response.json();
      return MOCK_EXAMS;
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      return MOCK_EXAMS; // Fallback to dummy data
    }
  },

  getByExaminer: async (examinerId: string): Promise<ExamDetails[]> => {
    try {
      await delay(500);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/exams?examiner=${examinerId}`);
      // return response.json();
      return MOCK_EXAMS.filter(exam => exam.createdBy === 'Current User');
    } catch (error) {
      console.error('Failed to fetch examiner exams:', error);
      return MOCK_EXAMS.slice(0, 2); // Fallback to subset of dummy data
    }
  },

  create: async (exam: Omit<ExamDetails, 'id'>): Promise<ExamDetails> => {
    try {
      await delay(400);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/exams', {
      //   method: 'POST',
      //   body: JSON.stringify(exam)
      // });
      // return response.json();
      const newExam = { ...exam, id: Date.now().toString() };
      MOCK_EXAMS.push(newExam);
      return newExam;
    } catch (error) {
      console.error('Failed to create exam:', error);
      throw error;
    }
  }
};
