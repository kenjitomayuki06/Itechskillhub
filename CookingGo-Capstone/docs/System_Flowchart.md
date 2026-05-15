# PUP TechVoc Culinary Learning App – System Flowchart

```mermaid
flowchart TD
    A[App Launch] --> B{User Registered?}
    B -->|No| C[Registration Screen]
    B -->|Yes| D[Login Screen]

    C --> C1[Enter Student Details]
    C1 --> C2[PUP TechVoc ID Verification]
    C2 -->|Verified| C3[TECHVOC Program Selection]
    C2 -->|Not Found| C5[Admin Manual Approval]
    C3 --> C4[Profile Setup]
    C4 --> D

    D --> E[Main Dashboard]

    E --> F[Game Modules]
    E --> G[Progress Tracker]
    E --> H[Leaderboard]
    E --> I[Profile Settings]
    E --> J[Achievements]

    %% Game Modules
    F --> F1[Basic Cooking Skills]
    F --> F2[Food Safety & Hygiene]
    F --> F3[Kitchen Equipment]
    F --> F4[Recipe Challenges]
    F --> F5[Nutrition Basics]

    %% Basic Cooking Skills
    F1 --> F1A[Interactive Lessons]
    F1A --> F1B[Mini Games]
    F1B --> F1C[Skill Assessment]
    F1C --> F1D{Pass Assessment?}
    F1D -->|Yes| F1E[Unlock Next Level]
    F1D -->|No| F1F[Retry / Review]
    F1F --> F1A
    F1E --> F1G[Earn Points & Badges]

    %% Food Safety
    F2 --> F2A[Safety Protocols Quiz]
    F2A --> F2B[Virtual Kitchen Inspection]
    F2B --> F2C[Emergency Scenarios]
    F2C --> F2D[Certification Test]

    %% Kitchen Equipment
    F3 --> F3A[Equipment Identification]
    F3A --> F3B[Usage Simulation]
    F3B --> F3C[Maintenance Tasks]
    F3C --> F3D[Safety Procedures]

    %% Recipe Challenges
    F4 --> F4A[Recipe Selection]
    F4A --> F4B[Ingredient Management]
    F4B --> F4C[Step-by-Step Cooking]
    F4C --> F4D[Time Management Challenge]
    F4D --> F4E[Final Dish Evaluation]
    F4E --> F4F[Scoring & Feedback]

    %% Nutrition Basics
    F5 --> F5A[Nutritional Value Games]
    F5A --> F5B[Meal Planning Challenges]
    F5B --> F5C[Dietary Requirements]
    F5C --> F5D[Health Impact Scenarios]
    F5 --> F5E[Nutrition Matching Cards Game]
    F5E --> F5E1[Select Food Card]
    F5E1 --> F5E2[Match with Nutrient Card (3 nutrients)]
    F5E2 --> F5E3{Correct Match?}
    F5E3 -->|Yes| F5E4[Earn Points & Unlock Next Level]
    F5E3 -->|No| F5E5[Retry / Review]

    %% Progress Update
    F1G --> K[Update Progress Database]
    F2D --> K
    F3D --> K
    F4F --> K
    F5D --> K
    F5E4 --> K

    %% Progress Tracker
    G --> G1[Individual Progress]
    G --> G2[Module Completion]
    G --> G3[Skill Level Tracking]
    G --> G4[Time Spent Analytics]
    G --> G5[Performance Reports]

    %% Leaderboard
    H --> H1[Class Rankings]
    H --> H2[School-wide Leaderboard]
    H --> H3[Weekly Challenges]
    H --> H4[Top Performers]

    %% Achievements
    J --> J1[Skill Badges]
    J --> J2[Completion Certificates]
    J --> J3[Special Recognitions]
    J --> J4[Milestone Rewards]

    %% Profile Settings
    I --> I1[Personal Information]
    I --> I2[Learning Preferences]
    I --> I3[Notification Settings]
    I --> I4[Privacy Controls]

    %% Admin Panel
    O[Admin Panel] --> O1[User Management]
    O --> O2[Content Management]
    O --> O3[System Analytics]
    O --> O4[Gamification Settings]

    O1 --> O1A[Student Registration Approval]
    O1A --> O1B[Instructor Account Management]
    O1B --> O1C[Role Assignments]

    O2 --> O2A[Module Content Updates]
    O2A --> O2B[Assessment Creation]
    O2B --> O2C[Resource Library Management]

    O3 --> O3A[Usage Statistics]
    O3A --> O3B[Performance Metrics]
    O3B --> O3C[System Health Monitoring]

    O4 --> O4A[Points System Configuration]
    O4A --> O4B[Badge Design & Assignment]
    O4B --> O4C[Challenge Creation]
    O4C --> O4D[Reward Distribution]

    %% Offline Mode
    P[Offline Mode] --> P1[Download Content]
    P1 --> P2[Local Progress Tracking]
    P2 --> P3[Sync When Online]
