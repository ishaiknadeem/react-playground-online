// API service with real REST endpoints and dummy data fallback
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

// Mock API responses for fallback
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

// Base API URL - can be configured for different environments
const API_BASE_URL = 'https://api.examplatform.com/v1';

// Generic API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  console.log(`API: Making request to ${API_BASE_URL}${endpoint}`);
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const examinerApi = {
  getAll: async (): Promise<Examiner[]> => {
    console.log('API: Fetching all examiners...');
    
    try {
      const data = await apiRequest('/examiners');
      console.log('API: Successfully fetched examiners from server:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to fetch examiners, using fallback data:', error);
      return MOCK_EXAMINERS;
    }
  },

  create: async (examiner: Omit<Examiner, 'id'>): Promise<Examiner> => {
    console.log('API: Creating new examiner:', examiner);
    
    try {
      const data = await apiRequest('/examiners', {
        method: 'POST',
        body: JSON.stringify(examiner),
      });
      console.log('API: Examiner created successfully:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to create examiner, using fallback:', error);
      const newExaminer = { ...examiner, id: Date.now().toString() };
      MOCK_EXAMINERS.push(newExaminer);
      return newExaminer;
    }
  },

  update: async (id: string, updates: Partial<Examiner>): Promise<Examiner> => {
    console.log('API: Updating examiner:', id, updates);
    
    try {
      const data = await apiRequest(`/examiners/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      console.log('API: Examiner updated successfully:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to update examiner, using fallback:', error);
      const examinerIndex = MOCK_EXAMINERS.findIndex(e => e.id === id);
      if (examinerIndex !== -1) {
        MOCK_EXAMINERS[examinerIndex] = { ...MOCK_EXAMINERS[examinerIndex], ...updates };
        return MOCK_EXAMINERS[examinerIndex];
      }
      throw new Error('Examiner not found');
    }
  },

  delete: async (id: string): Promise<void> => {
    console.log('API: Deleting examiner:', id);
    
    try {
      await apiRequest(`/examiners/${id}`, {
        method: 'DELETE',
      });
      console.log('API: Examiner deleted successfully');
    } catch (error) {
      console.error('API: Failed to delete examiner, using fallback:', error);
      const examinerIndex = MOCK_EXAMINERS.findIndex(e => e.id === id);
      if (examinerIndex !== -1) {
        MOCK_EXAMINERS.splice(examinerIndex, 1);
      }
    }
  }
};

export const candidateApi = {
  getAll: async (): Promise<Candidate[]> => {
    console.log('API: Fetching all candidates...');
    
    try {
      const data = await apiRequest('/candidates');
      console.log('API: Successfully fetched candidates from server:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to fetch candidates, using fallback data:', error);
      return MOCK_CANDIDATES;
    }
  },

  create: async (candidate: Omit<Candidate, 'id'>): Promise<Candidate> => {
    console.log('API: Creating new candidate:', candidate);
    
    try {
      const data = await apiRequest('/candidates', {
        method: 'POST',
        body: JSON.stringify(candidate),
      });
      console.log('API: Candidate created successfully:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to create candidate, using fallback:', error);
      const newCandidate = { ...candidate, id: Date.now().toString() };
      MOCK_CANDIDATES.push(newCandidate);
      return newCandidate;
    }
  },

  update: async (id: string, updates: Partial<Candidate>): Promise<Candidate> => {
    console.log('API: Updating candidate:', id, updates);
    
    try {
      const data = await apiRequest(`/candidates/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      console.log('API: Candidate updated successfully:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to update candidate, using fallback:', error);
      const candidateIndex = MOCK_CANDIDATES.findIndex(c => c.id === id);
      if (candidateIndex !== -1) {
        MOCK_CANDIDATES[candidateIndex] = { ...MOCK_CANDIDATES[candidateIndex], ...updates };
        return MOCK_CANDIDATES[candidateIndex];
      }
      throw new Error('Candidate not found');
    }
  },

  delete: async (id: string): Promise<void> => {
    console.log('API: Deleting candidate:', id);
    
    try {
      await apiRequest(`/candidates/${id}`, {
        method: 'DELETE',
      });
      console.log('API: Candidate deleted successfully');
    } catch (error) {
      console.error('API: Failed to delete candidate, using fallback:', error);
      const candidateIndex = MOCK_CANDIDATES.findIndex(c => c.id === id);
      if (candidateIndex !== -1) {
        MOCK_CANDIDATES.splice(candidateIndex, 1);
      }
    }
  },

  resendInvitation: async (id: string): Promise<void> => {
    console.log('API: Resending invitation to candidate:', id);
    
    try {
      await apiRequest(`/candidates/${id}/resend-invitation`, {
        method: 'POST',
      });
      console.log('API: Invitation resent successfully');
    } catch (error) {
      console.error('API: Failed to resend invitation:', error);
    }
  }
};

export const examApi = {
  getAll: async (): Promise<ExamDetails[]> => {
    console.log('API: Fetching all exams...');
    
    try {
      const data = await apiRequest('/exams');
      console.log('API: Successfully fetched exams from server:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to fetch exams, using fallback data:', error);
      return MOCK_EXAMS;
    }
  },

  getByExaminer: async (examinerId: string): Promise<ExamDetails[]> => {
    console.log('API: Fetching exams by examiner:', examinerId);
    
    try {
      const data = await apiRequest(`/exams?examiner=${examinerId}`);
      console.log('API: Successfully fetched examiner exams from server:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to fetch examiner exams, using fallback data:', error);
      const userExams = MOCK_EXAMS.filter(exam => exam.createdBy === 'Current User');
      return userExams.length > 0 ? userExams : MOCK_EXAMS.slice(0, 2);
    }
  },

  create: async (exam: Omit<ExamDetails, 'id'>): Promise<ExamDetails> => {
    console.log('API: Creating new exam:', exam);
    
    try {
      const data = await apiRequest('/exams', {
        method: 'POST',
        body: JSON.stringify(exam),
      });
      console.log('API: Exam created successfully:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to create exam, using fallback:', error);
      const newExam = { ...exam, id: Date.now().toString() };
      MOCK_EXAMS.push(newExam);
      return newExam;
    }
  },

  update: async (id: string, updates: Partial<ExamDetails>): Promise<ExamDetails> => {
    console.log('API: Updating exam:', id, updates);
    
    try {
      const data = await apiRequest(`/exams/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      console.log('API: Exam updated successfully:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to update exam, using fallback:', error);
      const examIndex = MOCK_EXAMS.findIndex(e => e.id === id);
      if (examIndex !== -1) {
        MOCK_EXAMS[examIndex] = { ...MOCK_EXAMS[examIndex], ...updates };
        return MOCK_EXAMS[examIndex];
      }
      throw new Error('Exam not found');
    }
  },

  delete: async (id: string): Promise<void> => {
    console.log('API: Deleting exam:', id);
    
    try {
      await apiRequest(`/exams/${id}`, {
        method: 'DELETE',
      });
      console.log('API: Exam deleted successfully');
    } catch (error) {
      console.error('API: Failed to delete exam, using fallback:', error);
      const examIndex = MOCK_EXAMS.findIndex(e => e.id === id);
      if (examIndex !== -1) {
        MOCK_EXAMS.splice(examIndex, 1);
      }
    }
  }
};

export const settingsApi = {
  getSettings: async (): Promise<any> => {
    console.log('API: Fetching organization settings...');
    
    try {
      const data = await apiRequest('/settings');
      console.log('API: Successfully fetched settings from server:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to fetch settings, using fallback data:', error);
      return {
        organizationName: 'Tech Corp',
        website: 'https://techcorp.com',
        emailNotifications: true,
        examReminders: true,
        autoGrading: true,
        proctoring: false,
        maxExamDuration: 120,
        allowedLanguages: ['javascript', 'python', 'java'],
      };
    }
  },

  updateSettings: async (settings: any): Promise<any> => {
    console.log('API: Updating organization settings:', settings);
    
    try {
      const data = await apiRequest('/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings),
      });
      console.log('API: Settings updated successfully:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to update settings, using fallback:', error);
      return settings;
    }
  }
};
