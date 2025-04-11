React Calendar with MongoDB & Redux


![image](https://github.com/user-attachments/assets/6eba18f8-a876-49e1-9e21-04a15fad99c6)
![image](https://github.com/user-attachments/assets/a1cbb2ed-2fe1-402b-8ea3-6feae328e466)

![image](https://github.com/user-attachments/assets/342ea9b9-daae-4ba4-80b6-22d5b68dcaeb)

1. Conceptual Overview
This project proposes a Google Calendar-inspired scheduling tool with integrated goal management, built on:

React (Frontend)

Redux (State Management)

MongoDB (Database)

The system bridges time-blocking (calendar events) and goal hierarchies (tasks/categories), enabling users to:

Drag-and-drop tasks onto a temporal grid.

Auto-generate events from predefined goals.

Dynamically modify schedules via CRUD operations.

2.1 Core Modules
Module	Functionality
Goal Engine	Hierarchical task tree (Goals → Sub-tasks) with color-coded visual tagging.
Event Engine	Temporal event calculus (start/end time, duration, conflicts).
State Machine	Redux-managed transitions: [Event Creation → Drag/Drop → Persistence].
