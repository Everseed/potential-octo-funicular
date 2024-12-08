export interface User {
    id: string
    name?: string
    email: string
    role: 'STUDENT' | 'MENTOR' | 'ADMIN'
    createdAt: string
    updatedAt: string
  }
  
  export interface Session {
    id: string
    title: string
    description?: string
    type: 'COURSE' | 'WORKSHOP' | 'TUTORING' | 'GROUP_STUDY'
    content: any
    resources?: any
    duration: number
    startTime?: string
    endTime?: string
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  }
  
  export interface Exam {
    id: string
    type: 'MCQ' | 'CODING' | 'OPEN'
    title: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    questions: any
    duration?: number
    startTime?: string
    endTime?: string
    score?: number
    difficulty: 'BEGINNER' | 'MEDIUM' | 'ADVANCED' | 'EXPERT'
    category?: string
    tags: string[]
  }