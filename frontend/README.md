# Bliss Mind frontend

Standalone Angular application for browsing wellness sessions, booking, account access, the wellness journal, notifications, and instructor applications.

## Run locally

```sh
npm install
npm start
```

The app is served by Angular CLI (normally at `http://localhost:4200`) and sends API requests to `http://localhost:8000`. Run the Bliss Mind backend separately and ensure its CORS configuration permits the frontend origin. API failures are shown in the relevant page; the frontend does not substitute sample data.

Useful scripts:

- `npm start` — start the development server
- `npm run build` — create a production build in `dist/bliss-mind`
- `npm run watch` — continuously build using development settings

Booking records a selected payment preference (`mobile_money`, `card`, or `cash`) only. The frontend does not collect payment credentials or integrate a payment gateway.
