## The architecture of this project 
⚡ Hybrid Notification Flow (Web + Mobile)



Quote/Contact Service
        │
        ▼
     Redis (quote-events / contact-updates)
        │
        ▼
 Channel Server
        ├──► 🟢 User online → convertAndSendToUser("/queue/updates")
        └──► 🔴 User offline → Redis publish("notification-events", JSON)
                                │
                                ▼
                    Notification Service (subscriber)
                        ├──► convertAndSendToUser("/queue/updates")
                        └──► (later: FCM/mobile if needed)
                        
<img width="1512" height="982" alt="Screenshot 2025-11-05 at 12 05 09 AM" src="https://github.com/user-attachments/assets/2faf69ae-4281-4d41-9c9d-848c214c1f51" />
For deploying :- render, redis, neon, vercel 
The repos for the backend services :- https://github.com/manavkapur/api-gateway, https://github.com/manavkapur/Contact-service, https://github.com/manavkapur/user-service, https://github.com/manavkapur/quote-service, https://github.com/manavkapur/Email-service , https://github.com/manavkapur/Email-service, https://github.com/manavkapur/notification-service, https://github.com/manavkapur/eureka-server 
