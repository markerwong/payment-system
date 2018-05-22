# Payment system

A payment system to save data to database and integrate with payment gateway.

---

## Access port and URL

### Payment system
Payment form URL: `http://localhost:3000/`

Payment record URL: `http://localhost:3000/record`

Port: `3000`

### Gateway A
Port: `3001`

### Gateway B
Port: `3002`

---

## Requirement

1. MongoDB as database storeage
2. Redis as cache memory
3. node version 8.9 or above

---

## Installation

1. Install node modules with the script below:
```
npm i
```

2. Update `config/default.json` for database and redis config

3. Start server with the script below:
```
npm run start
```
