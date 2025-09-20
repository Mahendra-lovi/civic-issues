// services.ts

// Define the shape of an issue using an interface
export interface Issue {
  id: string; // unique ID
  image: string | null; // URI of the uploaded image
  description: string; // text description
  category: string; // category selected
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: string; // when issue was reported
}

// Fake in-memory database (array)
let issues: Issue[] = [];

// Add a new issue
export const addIssue = (issue: Issue): void => {
  issues.push(issue);
};

// Get all issues
export const getIssues = (): Issue[] => {
  return issues;
};

// Clear all issues (optional, for debugging)
export const clearIssues = (): void => {
  issues = [];
};
