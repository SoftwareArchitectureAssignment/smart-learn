// RUN: npx dotenv-cli -e .env -- npx tsx prisma/seed.ts

import { prisma } from "../lib/prisma";

async function main() {
  const topics = [
    { id: "topic-web-dev", name: "Web Development", description: "Frontend and backend web technologies" },
    {
      id: "topic-data-science",
      name: "Data Science",
      description: "Data analysis, machine learning, and AI",
    },
    { id: "topic-mobile-dev", name: "Mobile Development", description: "iOS and Android app development" },
    { id: "topic-devops", name: "DevOps", description: "CI/CD, containers, and cloud infrastructure" },
    {
      id: "topic-cybersecurity",
      name: "Cybersecurity",
      description: "Security practices and ethical hacking",
    },
    { id: "topic-databases", name: "Databases", description: "SQL, NoSQL, and data modeling" },
    { id: "topic-ui-ux", name: "UI/UX Design", description: "User interface and user experience design" },
    {
      id: "topic-blockchain",
      name: "Blockchain",
      description: "Blockchain technology and cryptocurrencies",
    },
  ];

  console.log("Seeding topics...");

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: {},
      create: topic,
    });
    console.log(`✓ Created/verified topic: ${topic.name}`);
  }

  const questions = [
    // Web Development Questions (10)
    {
      text: "What does HTML stand for?",
      topicIds: ["topic-web-dev"],
      options: [
        { text: "HyperText Markup Language", isCorrect: true, order: 0 },
        { text: "HighText Machine Language", isCorrect: false, order: 1 },
        { text: "HyperText Making Language", isCorrect: false, order: 2 },
        { text: "Home Tool Markup Language", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which of the following is NOT a JavaScript framework?",
      topicIds: ["topic-web-dev"],
      options: [
        { text: "Django", isCorrect: true, order: 0 },
        { text: "React", isCorrect: false, order: 1 },
        { text: "Vue", isCorrect: false, order: 2 },
        { text: "Angular", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is the purpose of CSS?",
      topicIds: ["topic-web-dev", "topic-ui-ux"],
      options: [
        { text: "Styling and layout of web pages", isCorrect: true, order: 0 },
        { text: "Database management", isCorrect: false, order: 1 },
        { text: "Server-side scripting", isCorrect: false, order: 2 },
        { text: "Network configuration", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What HTTP status code indicates a successful request?",
      topicIds: ["topic-web-dev"],
      options: [
        { text: "200", isCorrect: true, order: 0 },
        { text: "404", isCorrect: false, order: 1 },
        { text: "500", isCorrect: false, order: 2 },
        { text: "301", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which method is used to make an asynchronous HTTP request in JavaScript?",
      topicIds: ["topic-web-dev"],
      options: [
        { text: "fetch()", isCorrect: true, order: 0 },
        { text: "request()", isCorrect: false, order: 1 },
        { text: "get()", isCorrect: false, order: 2 },
        { text: "send()", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is REST API?",
      topicIds: ["topic-web-dev"],
      options: [
        { text: "Representational State Transfer Application Programming Interface", isCorrect: true, order: 0 },
        { text: "Remote Execution Service Technology API", isCorrect: false, order: 1 },
        { text: "Rapid Event Streaming Technology API", isCorrect: false, order: 2 },
        { text: "Real-time Execution System Transfer API", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which of these is a CSS preprocessor?",
      topicIds: ["topic-web-dev"],
      options: [
        { text: "SASS", isCorrect: true, order: 0 },
        { text: "Bootstrap", isCorrect: false, order: 1 },
        { text: "jQuery", isCorrect: false, order: 2 },
        { text: "TypeScript", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What does SPA stand for in web development?",
      topicIds: ["topic-web-dev"],
      options: [
        { text: "Single Page Application", isCorrect: true, order: 0 },
        { text: "Static Page Architecture", isCorrect: false, order: 1 },
        { text: "Simple Programming Application", isCorrect: false, order: 2 },
        { text: "Server Page Application", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which HTML tag is used for creating a hyperlink?",
      topicIds: ["topic-web-dev"],
      options: [
        { text: "<a>", isCorrect: true, order: 0 },
        { text: "<link>", isCorrect: false, order: 1 },
        { text: "<href>", isCorrect: false, order: 2 },
        { text: "<url>", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is webpack used for?",
      topicIds: ["topic-web-dev"],
      options: [
        { text: "Module bundling", isCorrect: true, order: 0 },
        { text: "Database management", isCorrect: false, order: 1 },
        { text: "Version control", isCorrect: false, order: 2 },
        { text: "Testing", isCorrect: false, order: 3 },
      ],
    },

    // Data Science Questions (10)
    {
      text: "What is the primary programming language used for data science?",
      topicIds: ["topic-data-science"],
      options: [
        { text: "Python", isCorrect: true, order: 0 },
        { text: "Java", isCorrect: false, order: 1 },
        { text: "C++", isCorrect: false, order: 2 },
        { text: "PHP", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which library is commonly used for data manipulation in Python?",
      topicIds: ["topic-data-science"],
      options: [
        { text: "Pandas", isCorrect: true, order: 0 },
        { text: "Express", isCorrect: false, order: 1 },
        { text: "Flask", isCorrect: false, order: 2 },
        { text: "Spring", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What does ML stand for?",
      topicIds: ["topic-data-science"],
      options: [
        { text: "Machine Learning", isCorrect: true, order: 0 },
        { text: "Mobile Language", isCorrect: false, order: 1 },
        { text: "Master Logic", isCorrect: false, order: 2 },
        { text: "Memory Location", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which algorithm is used for supervised learning?",
      topicIds: ["topic-data-science"],
      options: [
        { text: "Linear Regression", isCorrect: true, order: 0 },
        { text: "K-Means Clustering", isCorrect: false, order: 1 },
        { text: "DBSCAN", isCorrect: false, order: 2 },
        { text: "Apriori", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is a neural network inspired by?",
      topicIds: ["topic-data-science"],
      options: [
        { text: "Human brain", isCorrect: true, order: 0 },
        { text: "Computer chips", isCorrect: false, order: 1 },
        { text: "Internet protocol", isCorrect: false, order: 2 },
        { text: "Database structure", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which library is used for data visualization in Python?",
      topicIds: ["topic-data-science"],
      options: [
        { text: "Matplotlib", isCorrect: true, order: 0 },
        { text: "NumPy", isCorrect: false, order: 1 },
        { text: "TensorFlow", isCorrect: false, order: 2 },
        { text: "Scikit-learn", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is overfitting in machine learning?",
      topicIds: ["topic-data-science"],
      options: [
        { text: "Model performs well on training data but poorly on new data", isCorrect: true, order: 0 },
        { text: "Model performs poorly on all data", isCorrect: false, order: 1 },
        { text: "Model takes too long to train", isCorrect: false, order: 2 },
        { text: "Model uses too much memory", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is the purpose of cross-validation?",
      topicIds: ["topic-data-science"],
      options: [
        { text: "To assess model performance and prevent overfitting", isCorrect: true, order: 0 },
        { text: "To clean the data", isCorrect: false, order: 1 },
        { text: "To visualize data", isCorrect: false, order: 2 },
        { text: "To store data", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which of these is an unsupervised learning algorithm?",
      topicIds: ["topic-data-science"],
      options: [
        { text: "K-Means Clustering", isCorrect: true, order: 0 },
        { text: "Decision Trees", isCorrect: false, order: 1 },
        { text: "Random Forest", isCorrect: false, order: 2 },
        { text: "Support Vector Machines", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is the role of an activation function in neural networks?",
      topicIds: ["topic-data-science"],
      options: [
        { text: "To introduce non-linearity", isCorrect: true, order: 0 },
        { text: "To store weights", isCorrect: false, order: 1 },
        { text: "To normalize data", isCorrect: false, order: 2 },
        { text: "To split data", isCorrect: false, order: 3 },
      ],
    },

    // Mobile Development Questions (10)
    {
      text: "Which language is primarily used for iOS development?",
      topicIds: ["topic-mobile-dev"],
      options: [
        { text: "Swift", isCorrect: true, order: 0 },
        { text: "Java", isCorrect: false, order: 1 },
        { text: "Python", isCorrect: false, order: 2 },
        { text: "Ruby", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is the native programming language for Android development?",
      topicIds: ["topic-mobile-dev"],
      options: [
        { text: "Kotlin", isCorrect: true, order: 0 },
        { text: "C#", isCorrect: false, order: 1 },
        { text: "JavaScript", isCorrect: false, order: 2 },
        { text: "PHP", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which framework allows cross-platform mobile development?",
      topicIds: ["topic-mobile-dev"],
      options: [
        { text: "React Native", isCorrect: true, order: 0 },
        { text: "Django", isCorrect: false, order: 1 },
        { text: "Spring Boot", isCorrect: false, order: 2 },
        { text: "Laravel", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is Flutter?",
      topicIds: ["topic-mobile-dev"],
      options: [
        { text: "A UI toolkit for building mobile apps", isCorrect: true, order: 0 },
        { text: "A database system", isCorrect: false, order: 1 },
        { text: "A cloud service", isCorrect: false, order: 2 },
        { text: "A testing framework", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which company develops React Native?",
      topicIds: ["topic-mobile-dev", "topic-web-dev"],
      options: [
        { text: "Facebook (Meta)", isCorrect: true, order: 0 },
        { text: "Google", isCorrect: false, order: 1 },
        { text: "Apple", isCorrect: false, order: 2 },
        { text: "Microsoft", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is the purpose of Android Studio?",
      topicIds: ["topic-mobile-dev"],
      options: [
        { text: "Integrated Development Environment for Android", isCorrect: true, order: 0 },
        { text: "Music production software", isCorrect: false, order: 1 },
        { text: "Video editing tool", isCorrect: false, order: 2 },
        { text: "Database management", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which language does Flutter use?",
      topicIds: ["topic-mobile-dev"],
      options: [
        { text: "Dart", isCorrect: true, order: 0 },
        { text: "Go", isCorrect: false, order: 1 },
        { text: "Rust", isCorrect: false, order: 2 },
        { text: "Scala", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is Xcode?",
      topicIds: ["topic-mobile-dev"],
      options: [
        { text: "Apple's IDE for iOS development", isCorrect: true, order: 0 },
        { text: "A code editor", isCorrect: false, order: 1 },
        { text: "A web browser", isCorrect: false, order: 2 },
        { text: "A testing tool", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is an APK file?",
      topicIds: ["topic-mobile-dev"],
      options: [
        { text: "Android Package file format", isCorrect: true, order: 0 },
        { text: "Apple Package Kit", isCorrect: false, order: 1 },
        { text: "Application Protocol Key", isCorrect: false, order: 2 },
        { text: "Advanced Programming Kit", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which of these is a mobile app testing framework?",
      topicIds: ["topic-mobile-dev"],
      options: [
        { text: "Appium", isCorrect: true, order: 0 },
        { text: "Redux", isCorrect: false, order: 1 },
        { text: "Webpack", isCorrect: false, order: 2 },
        { text: "Gradle", isCorrect: false, order: 3 },
      ],
    },

    // DevOps Questions (10)
    {
      text: "What does CI/CD stand for?",
      topicIds: ["topic-devops"],
      options: [
        { text: "Continuous Integration/Continuous Deployment", isCorrect: true, order: 0 },
        { text: "Code Integration/Code Delivery", isCorrect: false, order: 1 },
        { text: "Cloud Infrastructure/Cloud Deployment", isCorrect: false, order: 2 },
        { text: "Container Integration/Container Distribution", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which tool is commonly used for containerization?",
      topicIds: ["topic-devops"],
      options: [
        { text: "Docker", isCorrect: true, order: 0 },
        { text: "Git", isCorrect: false, order: 1 },
        { text: "Maven", isCorrect: false, order: 2 },
        { text: "Gradle", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is Kubernetes?",
      topicIds: ["topic-devops"],
      options: [
        { text: "Container orchestration platform", isCorrect: true, order: 0 },
        { text: "Programming language", isCorrect: false, order: 1 },
        { text: "Database system", isCorrect: false, order: 2 },
        { text: "Web framework", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which cloud provider offers AWS?",
      topicIds: ["topic-devops"],
      options: [
        { text: "Amazon", isCorrect: true, order: 0 },
        { text: "Google", isCorrect: false, order: 1 },
        { text: "Microsoft", isCorrect: false, order: 2 },
        { text: "IBM", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is Jenkins used for?",
      topicIds: ["topic-devops"],
      options: [
        { text: "Continuous Integration automation", isCorrect: true, order: 0 },
        { text: "Code editing", isCorrect: false, order: 1 },
        { text: "Database management", isCorrect: false, order: 2 },
        { text: "UI design", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What does IaC stand for in DevOps?",
      topicIds: ["topic-devops"],
      options: [
        { text: "Infrastructure as Code", isCorrect: true, order: 0 },
        { text: "Integration as Code", isCorrect: false, order: 1 },
        { text: "Internet as Cloud", isCorrect: false, order: 2 },
        { text: "Implementation as Container", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which tool is used for configuration management?",
      topicIds: ["topic-devops"],
      options: [
        { text: "Ansible", isCorrect: true, order: 0 },
        { text: "React", isCorrect: false, order: 1 },
        { text: "MySQL", isCorrect: false, order: 2 },
        { text: "Bootstrap", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is the main purpose of a load balancer?",
      topicIds: ["topic-devops"],
      options: [
        { text: "Distribute traffic across multiple servers", isCorrect: true, order: 0 },
        { text: "Store data", isCorrect: false, order: 1 },
        { text: "Compile code", isCorrect: false, order: 2 },
        { text: "Design interfaces", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "Which monitoring tool is popular in DevOps?",
      topicIds: ["topic-devops"],
      options: [
        { text: "Prometheus", isCorrect: true, order: 0 },
        { text: "Photoshop", isCorrect: false, order: 1 },
        { text: "PowerPoint", isCorrect: false, order: 2 },
        { text: "Pandas", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is Terraform used for?",
      topicIds: ["topic-devops"],
      options: [
        { text: "Infrastructure as Code provisioning", isCorrect: true, order: 0 },
        { text: "Web development", isCorrect: false, order: 1 },
        { text: "Mobile app testing", isCorrect: false, order: 2 },
        { text: "Data analysis", isCorrect: false, order: 3 },
      ],
    },

    // Cybersecurity Questions (10)
    {
      text: "What does VPN stand for?",
      topicIds: ["topic-cybersecurity"],
      options: [
        { text: "Virtual Private Network", isCorrect: true, order: 0 },
        { text: "Virtual Public Network", isCorrect: false, order: 1 },
        { text: "Verified Private Network", isCorrect: false, order: 2 },
        { text: "Virtual Protocol Network", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What type of attack involves flooding a server with traffic?",
      topicIds: ["topic-cybersecurity"],
      options: [
        { text: "DDoS (Distributed Denial of Service)", isCorrect: true, order: 0 },
        { text: "Phishing", isCorrect: false, order: 1 },
        { text: "Man-in-the-middle", isCorrect: false, order: 2 },
        { text: "SQL Injection", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is encryption?",
      topicIds: ["topic-cybersecurity"],
      options: [
        { text: "Converting data into coded form", isCorrect: true, order: 0 },
        { text: "Deleting data permanently", isCorrect: false, order: 1 },
        { text: "Copying data to cloud", isCorrect: false, order: 2 },
        { text: "Compressing files", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is a firewall?",
      topicIds: ["topic-cybersecurity", "topic-devops"],
      options: [
        { text: "A security system that monitors network traffic", isCorrect: true, order: 0 },
        { text: "A physical barrier", isCorrect: false, order: 1 },
        { text: "A type of virus", isCorrect: false, order: 2 },
        { text: "A backup system", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is phishing?",
      topicIds: ["topic-cybersecurity"],
      options: [
        { text: "A fraudulent attempt to obtain sensitive information", isCorrect: true, order: 0 },
        { text: "A type of malware", isCorrect: false, order: 1 },
        { text: "A network protocol", isCorrect: false, order: 2 },
        { text: "A programming language", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What does SSL stand for?",
      topicIds: ["topic-cybersecurity", "topic-web-dev"],
      options: [
        { text: "Secure Sockets Layer", isCorrect: true, order: 0 },
        { text: "System Security Layer", isCorrect: false, order: 1 },
        { text: "Safe Server Link", isCorrect: false, order: 2 },
        { text: "Standard Security Language", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is two-factor authentication?",
      topicIds: ["topic-cybersecurity"],
      options: [
        { text: "Security process requiring two forms of identification", isCorrect: true, order: 0 },
        { text: "Using two passwords", isCorrect: false, order: 1 },
        { text: "Logging in twice", isCorrect: false, order: 2 },
        { text: "Two security guards", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is malware?",
      topicIds: ["topic-cybersecurity"],
      options: [
        { text: "Malicious software designed to harm systems", isCorrect: true, order: 0 },
        { text: "Malfunctioning hardware", isCorrect: false, order: 1 },
        { text: "Marketing software", isCorrect: false, order: 2 },
        { text: "Management tool", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is penetration testing?",
      topicIds: ["topic-cybersecurity"],
      options: [
        { text: "Authorized simulated cyberattack to test security", isCorrect: true, order: 0 },
        { text: "Breaking into systems illegally", isCorrect: false, order: 1 },
        { text: "Installing antivirus", isCorrect: false, order: 2 },
        { text: "Creating backups", isCorrect: false, order: 3 },
      ],
    },
    {
      text: "What is a zero-day vulnerability?",
      topicIds: ["topic-cybersecurity"],
      options: [
        { text: "A security flaw unknown to the vendor", isCorrect: true, order: 0 },
        { text: "A vulnerability found on day zero", isCorrect: false, order: 1 },
        { text: "A completely secure system", isCorrect: false, order: 2 },
        { text: "A backup system", isCorrect: false, order: 3 },
      ],
    },
  ];

  console.log("Seeding assessment questions...");

  for (const question of questions) {
    await prisma.assessmentQuestion.create({
      data: {
        text: question.text,
        topics: {
          create: question.topicIds.map((topicId) => ({
            topic: {
              connect: { id: topicId },
            },
          })),
        },
        options: {
          create: question.options,
        },
      },
    });
    console.log(`✓ Created question: ${question.text.substring(0, 50)}...`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
