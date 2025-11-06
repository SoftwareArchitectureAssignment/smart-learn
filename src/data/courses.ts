export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  students: number;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  status: "Active" | "Draft" | "Completed";
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites from scratch.",
    instructor: "John Doe",
    duration: "8 weeks",
    level: "Beginner",
    students: 1250,
    price: 49.99,
    rating: 4.8,
    category: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    status: "Active",
  },
  {
    id: "2",
    title: "Advanced React & TypeScript",
    description: "Master React with TypeScript, including hooks, context, and advanced patterns.",
    instructor: "Jane Smith",
    duration: "10 weeks",
    level: "Advanced",
    students: 890,
    price: 79.99,
    rating: 4.9,
    category: "Frontend Development",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    status: "Active",
  },
  {
    id: "3",
    title: "Python for Data Science",
    description: "Explore data analysis, visualization, and machine learning with Python.",
    instructor: "Michael Chen",
    duration: "12 weeks",
    level: "Intermediate",
    students: 2100,
    price: 69.99,
    rating: 4.7,
    category: "Data Science",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
    status: "Active",
  },
  {
    id: "4",
    title: "UI/UX Design Principles",
    description: "Learn to create beautiful and user-friendly interfaces with modern design principles.",
    instructor: "Sarah Johnson",
    duration: "6 weeks",
    level: "Beginner",
    students: 1580,
    price: 39.99,
    rating: 4.6,
    category: "Design",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    status: "Active",
  },
  {
    id: "5",
    title: "Node.js Backend Development",
    description: "Build scalable server-side applications with Node.js, Express, and MongoDB.",
    instructor: "David Wilson",
    duration: "10 weeks",
    level: "Intermediate",
    students: 1320,
    price: 59.99,
    rating: 4.8,
    category: "Backend Development",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    status: "Active",
  },
  {
    id: "6",
    title: "Mobile App Development with Flutter",
    description: "Create cross-platform mobile applications using Flutter and Dart.",
    instructor: "Emily Brown",
    duration: "14 weeks",
    level: "Intermediate",
    students: 950,
    price: 74.99,
    rating: 4.7,
    category: "Mobile Development",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    status: "Active",
  },
  {
    id: "7",
    title: "DevOps & Cloud Computing",
    description: "Master Docker, Kubernetes, AWS, and CI/CD pipelines for modern DevOps.",
    instructor: "Robert Taylor",
    duration: "16 weeks",
    level: "Advanced",
    students: 780,
    price: 89.99,
    rating: 4.9,
    category: "DevOps",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop",
    status: "Active",
  },
  {
    id: "8",
    title: "Database Design & SQL",
    description: "Learn database fundamentals, SQL queries, and database optimization techniques.",
    instructor: "Lisa Anderson",
    duration: "8 weeks",
    level: "Beginner",
    students: 1650,
    price: 44.99,
    rating: 4.5,
    category: "Database",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop",
    status: "Active",
  },
];
